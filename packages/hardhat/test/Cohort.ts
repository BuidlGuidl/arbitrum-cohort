import { expect } from "chai";
import { ethers } from "hardhat";
import { Cohort, ERC20Mock } from "../typechain-types";
import { Cohort__factory, ERC20Mock__factory } from "../typechain-types/factories/contracts";

describe("Cohort", function () {
  let cohort: Cohort;
  let erc20: ERC20Mock;
  let owner: any, admin: any, builder1: any, builder2: any, other: any;
  const name = "Test Cohort";
  const description = "A test cohort";
  const cycle = 60 * 60 * 24 * 30; // 30 days
  const cap1 = 1_000_000_000;
  const cap2 = 2_000_000_000;
  const requiresApproval = true;

  beforeEach(async () => {
    [owner, admin, builder1, builder2, other] = await ethers.getSigners();
    // Deploy ERC20Mock
    erc20 = await new ERC20Mock__factory(owner).deploy();
    await erc20.waitForDeployment();
    // Deploy Cohort contract (ERC20 mode)
    cohort = await new Cohort__factory(owner).deploy(
      owner.address,
      erc20.getAddress(),
      name,
      description,
      cycle,
      [builder1.address, builder2.address],
      [cap1, cap2],
      requiresApproval,
    );
    await cohort.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct initial values", async function () {
      expect(await cohort.name()).to.equal(name);
      expect(await cohort.description()).to.equal(description);
      expect(await cohort.primaryAdmin()).to.equal(owner.address);
      expect(await cohort.tokenAddress()).to.equal(await erc20.getAddress());
      expect(await cohort.cycle()).to.equal(cycle);
      expect(await cohort.requireApprovalForWithdrawals()).to.equal(requiresApproval);
      expect(await cohort.isERC20()).to.equal(true);
      expect(await cohort.isONETIME()).to.equal(false);
      expect(await cohort.activeBuilders(0)).to.equal(builder1.address);
      expect(await cohort.activeBuilders(1)).to.equal(builder2.address);
    });
  });

  describe("Funding", function () {
    it("Should accept ERC20 funding", async function () {
      await erc20.mint(owner.address, 1_000_000_000);
      await erc20.approve(cohort.getAddress(), 1_000_000_000);
      await expect(cohort.fundContract(1_000_000_000)).to.emit(cohort, "ERC20FundsReceived");
      expect(await erc20.balanceOf(cohort.getAddress())).to.equal(1_000_000_000);
    });
    it("Should revert if no value sent for ETH mode", async function () {
      const ethMinCap = 10_000_000_000_000; // 0.00001 ether
      // Deploy ETH mode
      const ethCohort = await new Cohort__factory(owner).deploy(
        owner.address,
        ethers.ZeroAddress,
        name,
        description,
        cycle,
        [builder1.address],
        [ethMinCap],
        false,
      );
      await ethCohort.waitForDeployment();
      await expect(ethCohort.fundContract(0)).to.be.revertedWithCustomError(ethCohort, "NoValueSent");
      await expect(ethCohort.fundContract(0, { value: ethMinCap })).to.emit(ethCohort, "FundsReceived");
    });
  });

  describe("Builder Management", function () {
    it("Should allow admin to add and remove builders", async function () {
      await expect(cohort.addBuilderStream(other.address, cap1)).to.emit(cohort, "AddBuilder");
      expect(await cohort.activeBuilders(2)).to.equal(other.address);
      await expect(cohort.removeBuilderStream(other.address)).to.emit(cohort, "UpdateBuilder");
      // After removal, the builder should not be able to withdraw
      await expect(
        cohort.connect(other).streamWithdraw(100_000_000, "work done", "project1"),
      ).to.be.revertedWithCustomError(cohort, "NoActiveStreamForBuilder");
    });
    it("Should allow admin to update builder cap", async function () {
      await expect(cohort.updateBuilderStreamCap(builder1.address, cap2)).to.emit(cohort, "UpdateBuilder");
      const builderInfo = await cohort.streamingBuilders(builder1.address);
      expect(builderInfo.cap).to.equal(cap2);
    });
    it("Should not allow builder to withdraw more than the new lower cap", async function () {
      // Lower the cap for builder1
      const lowerCap = 100_000_000;
      await expect(cohort.updateBuilderStreamCap(builder1.address, lowerCap)).to.emit(cohort, "UpdateBuilder");
      // Try to withdraw an amount higher than the new cap but lower than the previous cap
      await expect(
        cohort.connect(builder1).streamWithdraw(200_000_000, "work done", "project1"),
      ).to.be.revertedWithCustomError(cohort, "InsufficientInStream");
    });
    it("Should not allow non-admin to add a builder", async function () {
      await expect(cohort.connect(builder1).addBuilderStream(other.address, cap1)).to.be.revertedWithCustomError(
        cohort,
        "AccessDenied",
      );
    });
    it("Should not allow non-admin to remove a builder", async function () {
      await expect(cohort.connect(builder1).removeBuilderStream(builder2.address)).to.be.revertedWithCustomError(
        cohort,
        "AccessDenied",
      );
    });
    it("Should not allow non-admin to update builder cap", async function () {
      await expect(
        cohort.connect(builder1).updateBuilderStreamCap(builder2.address, cap2),
      ).to.be.revertedWithCustomError(cohort, "AccessDenied");
    });
    it("Should allow admin to add multiple builders with addBatch", async function () {
      const newBuilder1 = ethers.Wallet.createRandom().address;
      const newBuilder2 = ethers.Wallet.createRandom().address;
      const newCaps = [123_000_000, 456_000_000];
      await expect(cohort.addBatch([newBuilder1, newBuilder2], newCaps))
        .to.emit(cohort, "AddBuilder")
        .withArgs(newBuilder1, newCaps[0])
        .and.to.emit(cohort, "AddBuilder")
        .withArgs(newBuilder2, newCaps[1]);
      // Check that the new builders are in activeBuilders and have correct caps
      const idx1 = await cohort.builderIndex(newBuilder1);
      const idx2 = await cohort.builderIndex(newBuilder2);
      expect(await cohort.activeBuilders(idx1)).to.equal(newBuilder1);
      expect(await cohort.activeBuilders(idx2)).to.equal(newBuilder2);
      const info1 = await cohort.streamingBuilders(newBuilder1);
      const info2 = await cohort.streamingBuilders(newBuilder2);
      expect(info1.cap).to.equal(newCaps[0]);
      expect(info2.cap).to.equal(newCaps[1]);
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async () => {
      // Fund contract for withdrawals
      await erc20.mint(owner.address, 10_000_000_000);
      await erc20.approve(cohort.getAddress(), 10_000_000_000);
      await cohort.fundContract(10_000_000_000);
    });
    it("Should allow builder to request withdrawal (approval required)", async function () {
      await cohort.connect(builder1).streamWithdraw(100_000_000, "work done", "project1");
      const req = await cohort.withdrawRequests(builder1.address, 0);
      expect(req.amount).to.equal(100_000_000);
      expect(req.completed).to.equal(false);
      expect(req.approved).to.equal(false);
    });
    it("Should not allow withdrawal when contract is locked", async function () {
      await cohort.toggleLock(true);
      await expect(
        cohort.connect(builder1).streamWithdraw(100_000_000, "work done", "project1"),
      ).to.be.revertedWithCustomError(cohort, "ContractIsLocked");
    });
    it("Should allow admin to approve withdrawal request", async function () {
      await cohort.connect(builder1).streamWithdraw(100_000_000, "work done", "project1");
      await expect(cohort.approveWithdraw(builder1.address, 0)).to.emit(cohort, "WithdrawApproved");
      const req = await cohort.withdrawRequests(builder1.address, 0);
      expect(req.completed).to.equal(true);
      expect(req.approved).to.equal(true);
    });
    it("Should allow admin to reject withdrawal request", async function () {
      await cohort.connect(builder1).streamWithdraw(100_000_000, "work done", "project1");
      await expect(cohort.rejectWithdraw(builder1.address, 0)).to.emit(cohort, "WithdrawRejected");
      const req = await cohort.withdrawRequests(builder1.address, 0);
      expect(req.completed).to.equal(true);
      expect(req.approved).to.equal(false);
    });
    it("Should revert withdrawal if not enough unlocked", async function () {
      await expect(
        cohort.connect(builder1).streamWithdraw(10_000_000_000, "fail", "fail"),
      ).to.be.revertedWithCustomError(cohort, "InsufficientInStream");
    });
    it("Should allow builder to withdraw immediately after admin disables approval requirement", async function () {
      // Admin disables approval requirement for builder1
      await cohort.setBuilderApprovalRequirement(builder1.address, false);
      // Builder1 can now withdraw immediately
      await expect(cohort.connect(builder1).streamWithdraw(100_000_000, "work done", "project1")).to.emit(
        cohort,
        "Withdraw",
      );
    });
    it("Should require approval again after admin re-enables approval requirement", async function () {
      // Admin disables approval requirement for builder1
      await cohort.setBuilderApprovalRequirement(builder1.address, false);
      // Builder1 can withdraw immediately
      await expect(cohort.connect(builder1).streamWithdraw(100_000_000, "work done", "project1")).to.emit(
        cohort,
        "Withdraw",
      );

      // There should be no withdrawal requests yet
      await expect(cohort.withdrawRequests(builder1.address, 0)).to.be.reverted;

      // Admin re-enables approval requirement for builder1
      await cohort.setBuilderApprovalRequirement(builder1.address, true);

      // Builder1 tries to withdraw again, should create a withdrawal request (not emit Withdraw event)
      await expect(cohort.connect(builder1).streamWithdraw(100_000_000, "work done 2", "project2")).to.emit(
        cohort,
        "WithdrawRequested",
      );

      // Confirm that the withdrawal request is pending and not completed
      const req2 = await cohort.withdrawRequests(builder1.address, 0);
      expect(req2.completed).to.equal(false);
      expect(req2.approved).to.equal(false);
    });
    it("Should not allow a non-builder to withdraw", async function () {
      await expect(
        cohort.connect(other).streamWithdraw(100_000_000, "malicious", "hack"),
      ).to.be.revertedWithCustomError(cohort, "NoActiveStreamForBuilder");
    });
    it("Should not allow a non-admin to drain the contract", async function () {
      // Only admin can call drainContract, so a non-admin should be reverted with AccessDenied
      await expect(cohort.connect(other).drainContract(await erc20.getAddress())).to.be.revertedWithCustomError(
        cohort,
        "AccessDenied",
      );
    });
    it("Should respect contract-wide approval requirement toggling", async function () {
      // Fund the contract for withdrawals
      await erc20.mint(owner.address, 2_000_000_000);
      await erc20.approve(cohort.getAddress(), 2_000_000_000);
      await cohort.fundContract(2_000_000_000);

      // Set contract-wide approval requirement to false
      await cohort.toggleContractApprovalRequirement(false);
      // Builder1 still requires approval (per-builder flag is true)
      await expect(cohort.connect(builder1).streamWithdraw(100_000_000, "work done", "project1")).to.emit(
        cohort,
        "WithdrawRequested",
      );

      // Approve the first withdrawal request
      await cohort.approveWithdraw(builder1.address, 0);

      // Set contract-wide approval requirement to true
      await cohort.toggleContractApprovalRequirement(true);
      // Builder1's next withdrawal should also require approval
      await expect(cohort.connect(builder1).streamWithdraw(100_000_000, "work done 2", "project2")).to.emit(
        cohort,
        "WithdrawRequested",
      );
    });
    it("Should allow new builder to withdraw without approval after contract-wide approval is disabled", async function () {
      await cohort.toggleContractApprovalRequirement(false);
      const newBuilder = ethers.Wallet.createRandom().address;
      await expect(cohort.addBuilderStream(newBuilder, cap1)).to.emit(cohort, "AddBuilder");
      await erc20.mint(owner.address, cap1);
      await erc20.approve(cohort.getAddress(), cap1);
      await cohort.fundContract(cap1);

      // Fund the new builder with ETH for gas
      await owner.sendTransaction({
        to: newBuilder,
        value: ethers.parseEther("1.0"),
      });

      const newBuilderSigner = await ethers.getImpersonatedSigner(newBuilder);
      await expect(cohort.connect(newBuilderSigner).streamWithdraw(100_000_000, "work done", "project1")).to.emit(
        cohort,
        "Withdraw",
      );
    });
    it("Should not allow builder to make a second withdrawal if a pending withdrawal exists", async function () {
      // Builder1 makes a withdrawal request (approval required)
      await cohort.connect(builder1).streamWithdraw(100_000_000, "work done", "project1");
      // Attempt a second withdrawal before the first is approved or rejected
      await expect(
        cohort.connect(builder1).streamWithdraw(100_000_000, "work done again", "project1"),
      ).to.be.revertedWithCustomError(cohort, "PendingWithdrawRequestExists");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin to transfer primary admin", async function () {
      await expect(cohort.transferPrimaryAdmin(admin.address)).to.emit(cohort, "PrimaryAdminTransferred");
      expect(await cohort.primaryAdmin()).to.equal(admin.address);
    });
    it("Should allow admin to lock and unlock contract", async function () {
      await expect(cohort.toggleLock(true)).to.emit(cohort, "ContractLocked");
      expect(await cohort.locked()).to.equal(true);
      await expect(cohort.toggleLock(false)).to.emit(cohort, "ContractLocked");
      expect(await cohort.locked()).to.equal(false);
    });
    it("Should return correct data from allBuildersData", async function () {
      // Add another builder for more coverage
      await cohort.addBuilderStream(other.address, cap1);
      const activeBuilders = [builder1.address, builder2.address, other.address];
      const data = await cohort.allBuildersData(activeBuilders);
      expect(data.length).to.equal(activeBuilders.length);
      expect(data[0].builderAddress).to.equal(builder1.address);
      expect(data[0].cap).to.equal(cap1);
      expect(data[1].builderAddress).to.equal(builder2.address);
      expect(data[1].cap).to.equal(cap2);
      expect(data[2].builderAddress).to.equal(other.address);
      expect(data[2].cap).to.equal(cap1);
    });
    it("Should return correct unlockedBuilderAmount for a builder", async function () {
      // Initially, the unlocked amount should be the full cap
      const unlocked = await cohort.unlockedBuilderAmount(builder1.address);
      expect(unlocked).to.equal(cap1);

      // Fund the contract so the withdrawal can succeed
      await erc20.mint(owner.address, cap1);
      await erc20.approve(cohort.getAddress(), cap1);
      await cohort.fundContract(cap1);

      // Withdraw the full cap
      await cohort.setBuilderApprovalRequirement(builder1.address, false);
      await cohort.connect(builder1).streamWithdraw(unlocked, "full cycle", "project1");

      // After withdrawal, unlocked amount should reset to 0
      const afterWithdraw = await cohort.unlockedBuilderAmount(builder1.address);
      expect(afterWithdraw).to.equal(0n);

      // Simulate time passing (half a cycle)
      const halfCycle = Math.floor(cycle / 2);
      await ethers.provider.send("evm_increaseTime", [halfCycle]);
      await ethers.provider.send("evm_mine", []);

      // Now, unlocked amount should be about half the cap
      const unlockedAfterTime = await cohort.unlockedBuilderAmount(builder1.address);
      expect(Number(unlockedAfterTime)).to.be.closeTo(Math.floor(cap1 / 2), 1e6);
    });
  });
});
