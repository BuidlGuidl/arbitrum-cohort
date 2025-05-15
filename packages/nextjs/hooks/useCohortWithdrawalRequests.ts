import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { buildersData } from "~~/data/builders";
import { projectsData } from "~~/data/projects";

type WithdrawalRequest = {
  id: string;
  requestId: bigint;
  reason: string;
  builder: `0x${string}`;
  amount: number;
  timestamp: number;
  projectName: string;
  cohortBuilder: {
    cohortWithdrawals: {
      items: CohortWithdrawal[];
    };
  };
};

type CohortWithdrawal = {
  id: string;
  amount: number;
  timestamp: number;
  reason: string;
  projectName: string;
};

type WithdrawalRequestsData = { cohortWithdrawalRequests: { items: WithdrawalRequest[] } };

type Withdrawal = CohortWithdrawal & {
  projectTitle: string;
};

type WithdrawalRequestResult = {
  id: string;
  requestId: bigint;
  reason: string;
  builder: {
    address: `0x${string}`;
    x: string;
    github: string;
  };
  amount: number;
  timestamp: number;
  projectName: string;
  projectTitle: string;
  withdrawals: Withdrawal[];
};

const fetchWithdrawalRequests = async () => {
  const WithdrawalRequestsQuery = gql`
    query WithdrawlRequests {
      cohortWithdrawalRequests(where: { status: pending }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          reason
          builder
          amount
          timestamp
          id
          requestId
          projectName
          cohortBuilder {
            cohortWithdrawals {
              items {
                id
                amount
                timestamp
                reason
                projectName
              }
            }
          }
        }
      }
    }
  `;
  const data = await request<WithdrawalRequestsData>(
    process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
    WithdrawalRequestsQuery,
  );
  return data;
};

export const useCohortWithdrawalRequests = () => {
  const [withdrawalRequestsResult, setWithdrawalRequestsResult] = useState<WithdrawalRequestResult[]>([]);

  const { data: withdrawalRequestsData, isLoading } = useQuery({
    queryKey: ["withdrawalRequests"],
    queryFn: fetchWithdrawalRequests,
  });

  useEffect(() => {
    if (withdrawalRequestsData && withdrawalRequestsData.cohortWithdrawalRequests.items.length > 0) {
      const fetchedWithdrawalRequestList = withdrawalRequestsData.cohortWithdrawalRequests.items.map(
        (withdrawal: WithdrawalRequest) => {
          const builderData = buildersData.find(
            (builderData: any) => builderData.address.toLowerCase() === withdrawal.builder.toLowerCase(),
          );
          const projectData = projectsData.find(
            (projectData: any) => projectData.name.toLowerCase() === withdrawal.projectName.toLowerCase(),
          );
          const withdrawRequestResult: WithdrawalRequestResult = {
            id: withdrawal.id,
            requestId: withdrawal.requestId,
            reason: withdrawal.reason,
            builder: {
              address: withdrawal.builder,
              x: builderData?.x || "",
              github: builderData?.github || "",
            },
            amount: withdrawal.amount,
            timestamp: withdrawal.timestamp,
            projectName: withdrawal.projectName,
            projectTitle: projectData?.title || withdrawal.projectName,
            withdrawals: withdrawal.cohortBuilder.cohortWithdrawals.items.map((withdrawalItem: CohortWithdrawal) => ({
              id: withdrawalItem.id,
              amount: withdrawalItem.amount,
              timestamp: withdrawalItem.timestamp,
              reason: withdrawalItem.reason,
              projectName: withdrawalItem.projectName,
              projectTitle:
                projectsData.find(
                  (projectData: any) => projectData.name.toLowerCase() === withdrawalItem.projectName.toLowerCase(),
                )?.title || withdrawalItem.projectName,
            })),
          };
          return withdrawRequestResult;
        },
      );
      setWithdrawalRequestsResult(fetchedWithdrawalRequestList);
    }
  }, [withdrawalRequestsData]);

  return { data: withdrawalRequestsResult, isLoading };
};
