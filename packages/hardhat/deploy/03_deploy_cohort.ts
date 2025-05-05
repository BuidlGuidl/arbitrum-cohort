import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "Cohort" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployCohort: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();

  const { deploy, get } = hre.deployments;

  const ERC20Mock = await get("ERC20Mock");
  const ERC20MockAddress = ERC20Mock.address;

  const name = "Arbitrum Cohort";
  const description = "Arbitrum cohort contract";
  const cycle = 30 * 24 * 60 * 60; // 30 days
  const requiresApproval = true;

  await deploy("Cohort", {
    from: deployer,
    // Contract constructor arguments

    // First Argument: Address of primary admin
    // Second Argument: Enter zero address for eth mode or enter address of ERC20 token contract for token mode
    // Third Argument: Name of the cohort
    // Fourth Argument: Description of the cohort
    // Fifth Argument: Cycle duration in seconds
    // Sixth Argument: Array of addresses of the cohort members
    // Seventh Argument: Array of cap amounts for each cohort member
    // Eighth Argument: Boolean value to indicate if approval is required for the cohort members

    args: [
      "0xCA26083b950A93a8d192aCE87D62Af43F65E80Fc",
      ERC20MockAddress,
      name,
      description,
      cycle,
      ["0xFd3515eFA038CcA37301E5907A3C8C67AB59Da9a", "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93"],
      [1000000000, 2000000000],
      requiresApproval,
    ],

    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract
  // const cohort = await hre.ethers.getContract("Cohort", deployer);
};

export default deployCohort;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Cohort
deployCohort.tags = ["Cohort"];
