"use client";

import { useState } from "react";
import { StreamContributionItem } from "./StreamContributionItem";
import toast from "react-hot-toast";
import { BuilderAddress, BuilderAddressProps } from "~~/components/BuilderAddress";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface WithdrawalRequestItemProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
  builder: BuilderAddressProps;
  requestId: bigint;
  reason: string;
  amount: number;
  timestamp: number;
  projectTitle: string;
  viewWork: boolean;
}

export function WithdrawalRequest({ children }: { children: React.ReactNode }) {
  return <div className="space-y-8">{children}</div>;
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
        <div className="lg:col-span-3">
          <div className="mt-2 flex items-center gap-2 md:gap-6">
            <StreamContributionItem
              title={projectTitle}
              description={reason}
              date={new Date(timestamp * 1000).toLocaleDateString()}
              amount={amount}
            />
            {approved && <div>Withdrawal approved!</div>}
            {rejected && <div>Withdrawal rejected!</div>}
            {!approved && !rejected && (
              <>
                <button
                  className={`btn btn-success btn-xs !min-h-8 !h-8 lg:btn-md lg:!min-h-10 lg:!h-10 ${isApproving ? "loading" : ""}`}
                  onClick={handleApprove}
                  disabled={isApproving}
                >
                  Approve
                </button>
                <button
                  className={`btn btn-error btn-xs !min-h-8 !h-8 lg:btn-md lg:!min-h-10 lg:!h-10 ${isRejecting ? "loading" : ""}`}
                  onClick={handleReject}
                  disabled={isRejecting}
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-primary btn-xs !min-h-8 !h-8 lg:btn-md lg:!min-h-10 lg:!h-10"
              disabled={!viewWork}
            >
              {isOpen ? "Hide Previous Work" : "View Previous Work"}
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div className="mt-8">{children}</div>}
    </div>
  );
}
