"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { BuilderAddress } from "~~/components/BuilderAddress";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { CollapsibleItemProps } from "~~/types/sharedTypes";

interface WithdrawalRequestItemProps extends CollapsibleItemProps {
  requestId: bigint;
  reason: string;
  amount: number;
  timestamp: number;
  projectTitle: string;
}

export function WithdrawalRequestItem({
  defaultOpen = false,
  children,
  builder,
  requestId,
  reason,
  amount,
  timestamp,
  projectTitle,
  viewWork,
}: WithdrawalRequestItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  const { writeContractAsync: cohortContract } = useScaffoldWriteContract({
    contractName: "Cohort",
  });

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await cohortContract({
        functionName: "approveWithdraw",
        args: [builder.address, requestId],
      });
      toast.success("Withdrawal approved successfully!");
      setApproved(true);
    } catch (error) {
      console.error("Failed to approve withdrawal:", error);
      toast.error("Failed to approve withdrawal. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      await cohortContract({
        functionName: "rejectWithdraw",
        args: [builder.address, requestId],
      });
      toast.success("Withdrawal rejected successfully!");
      setRejected(true);
    } catch (error) {
      console.error("Failed to reject withdrawal:", error);
      toast.error("Failed to reject withdrawal. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
        <div>
          <BuilderAddress address={builder.address} x={builder.x} github={builder.github} />
        </div>
        <div className="mt-2 lg:mt-0 lg:col-span-3">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-6">
            <div className="flex flex-col items-start gap-4 xl:flex-row">
              <div className="flex-shrink-0 mt-2 px-2 py-1 inline-block bg-primary text-primary-content rounded-lg text-lg">
                {amount} USDC
              </div>
              <div className="max-w-3xl">
                <div className="flex flex-col gap-1 lg:flex-row lg:gap-4 lg:items-baseline">
                  <h3 className="m-0 text-xl lg:text-2xl">{projectTitle}</h3>
                  <p className="m-0 text-sm lg:text-base">{new Date(timestamp * 1000).toLocaleDateString()}</p>
                </div>
                <p className="mb-0 mt-2">{reason}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0 lg:flex-col lg:gap-4 text-center">
              {approved && <div>Withdrawal approved!</div>}
              {rejected && <div>Withdrawal rejected!</div>}
              {!approved && !rejected && (
                <>
                  <button
                    className={`btn btn-success btn-xs !min-h-8 !h-8 xl:btn-md xl:!min-h-10 xl:!h-10 lg:btn-block ${isApproving ? "loading" : ""}`}
                    onClick={handleApprove}
                    disabled={isApproving}
                  >
                    Approve
                  </button>
                  <button
                    className={`btn btn-error btn-xs !min-h-8 !h-8 xl:btn-md xl:!min-h-10 xl:!h-10 lg:btn-block ${isRejecting ? "loading" : ""}`}
                    onClick={handleReject}
                    disabled={isRejecting}
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-primary btn-xs !min-h-8 !h-8 xl:btn-md xl:!min-h-10 xl:!h-10 lg:btn-block"
                disabled={!viewWork}
              >
                {isOpen ? "Hide Previous Work" : "View Previous Work"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <div className="mt-8">{children}</div>}
    </div>
  );
}
