import { forwardRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { projectsData } from "~~/data/projects";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const WithdrawModal = forwardRef<
  HTMLDialogElement,
  {
    closeModal: () => void;
  }
>(({ closeModal }, ref) => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { address: builderAddress } = useAccount();

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Cohort",
  });

  const { data: requiresApproval } = useScaffoldReadContract({
    contractName: "Cohort",
    functionName: "requiresApproval",
    args: [builderAddress],
  });

  const doWithdraw = async () => {
    if (!selectedProject || !reason || !amount) {
      toast.error("Please fill out all fields before withdrawing.");
      return;
    }

    try {
      setIsWithdrawing(true);
      const parsedAmount = parseUnits(amount, 6);
      await writeContractAsync({
        functionName: "streamWithdraw",
        args: [parsedAmount, reason, selectedProject],
      });
      toast.success(
        requiresApproval
          ? "Withdrawal request successfully created! The withdrawal request will be reviewed by the team and the funds will be released upon approval."
          : "Withdrawal successful!",
      );
      closeModal();
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <dialog id="action_modal" className="modal" ref={ref}>
      <div className="modal-box flex flex-col space-y-6 rounded-lg">
        <form method="dialog" className="bg-secondary -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <p className="font-bold text-xl m-0">Request a withdrawal from your stream</p>
          </div>
          <button className="btn btn-sm btn-circle btn-ghost text-xl h-auto">✕</button>
        </form>
        <div className="flex flex-col gap-6 items-center">
          <select
            className="select select-bordered w-full rounded-lg"
            value={selectedProject}
            onChange={event => setSelectedProject(event.target.value)}
          >
            <option value="" disabled>
              Select a project
            </option>
            {projectsData.map(project => (
              <option key={project.name} value={project.name}>
                {project.title}
              </option>
            ))}
          </select>
          <textarea
            className="textarea textarea-ghost focus:outline-none min-h-[200px] focus:bg-transparent px-4 w-full font-medium placeholder:text-base-content/50 border border-gray-600 bg-base-200 rounded-lg text-accent"
            placeholder="Reason for withdrawing & links"
            value={reason}
            onChange={event => setReason(event.target.value)}
          />
          <input
            type="number"
            className="input input-bordered w-full rounded-lg"
            placeholder="USDC Amount"
            value={amount}
            onChange={event => setAmount(event.target.value)}
          />
          <button
            className="btn btn-secondary btn-lg py-3 flex items-center justify-center"
            onClick={doWithdraw}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2"></span> Withdrawing
              </>
            ) : (
              "Withdraw"
            )}
          </button>
        </div>
      </div>
      <Toaster />
    </dialog>
  );
});

WithdrawModal.displayName = "WithdrawModal";
