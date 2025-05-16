"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { StreamContributionItem } from "~~/components/StreamContributionItem";
import { WithdrawalRequest, WithdrawalRequestItem } from "~~/components/WithdrawalRequest";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useCohortWithdrawalRequests } from "~~/hooks/useCohortWithdrawalRequests";

const Admin: NextPage = () => {
  const { address: currentUserAddress } = useAccount();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const { data: cohortWithdrawalRequestsData, isLoading: isLoadingCohortWithdrawalRequests } =
    useCohortWithdrawalRequests();

  const { data: isAdminData, isLoading: isCheckingAdmin } = useScaffoldReadContract({
    contractName: "Cohort",
    functionName: "isAdmin",
    args: [currentUserAddress],
  });

  useEffect(() => {
    if (isAdminData !== undefined) {
      setIsAdmin(isAdminData);
    }
  }, [isAdminData]);

  if (isCheckingAdmin || isAdmin === null) {
    return <div className="text-center mt-8">Checking admin permissions...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0">
      <div id="builders" className="container mx-auto">
        <section className="bg-base-300 rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl md:text-4xl">Pending Withdrawals</h2>
          </div>
          <div className="mt-12">
            <div className="hidden mb-2 lg:grid lg:grid-cols-4">
              <div>
                <p className="mt-0">Builder</p>
              </div>
              <div className="lg:col-span-2">
                <p className="mt-0">Withdrawal Request</p>
              </div>
            </div>
            <WithdrawalRequest>
              {isLoadingCohortWithdrawalRequests ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                cohortWithdrawalRequestsData.map(withdrawalRequestData => (
                  <WithdrawalRequestItem
                    key={withdrawalRequestData.id}
                    builder={withdrawalRequestData.builder}
                    requestId={withdrawalRequestData.requestId}
                    reason={withdrawalRequestData.reason}
                    amount={withdrawalRequestData.amount}
                    timestamp={withdrawalRequestData.timestamp}
                    projectTitle={withdrawalRequestData.projectTitle}
                    viewWork={withdrawalRequestData.withdrawals.length > 0}
                  >
                    <div className="px-6 rounded-lg bg-base-100 divide-y">
                      {withdrawalRequestData.withdrawals.map(item => (
                        <StreamContributionItem
                          key={item.id}
                          title={item.projectTitle}
                          description={item.reason}
                          date={new Date(item.timestamp * 1000).toLocaleDateString()}
                          amount={item.amount}
                        />
                      ))}
                    </div>
                  </WithdrawalRequestItem>
                ))
              )}
            </WithdrawalRequest>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
