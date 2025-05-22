import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { buildersData } from "~~/data/builders";
import { projectsData } from "~~/data/projects";
import { BuilderWithSocialBase, WithdrawalRequestBase } from "~~/types/sharedTypes";

type WithdrawalRequest = WithdrawalRequestBase & {
  requestId: bigint;
  builder: `0x${string}`;
  cohortBuilder: {
    cohortWithdrawals: {
      items: WithdrawalRequestBase[];
    };
  };
};

type WithdrawalRequestsData = { cohortWithdrawalRequests: { items: WithdrawalRequest[] } };

type Withdrawal = WithdrawalRequestBase & {
  projectTitle: string;
};

type WithdrawalRequestResult = WithdrawalRequestBase & {
  requestId: bigint;
  builder: BuilderWithSocialBase;
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
            withdrawals: withdrawal.cohortBuilder.cohortWithdrawals.items.map(
              (withdrawalItem: WithdrawalRequestBase) => ({
                id: withdrawalItem.id,
                amount: withdrawalItem.amount,
                timestamp: withdrawalItem.timestamp,
                reason: withdrawalItem.reason,
                projectName: withdrawalItem.projectName,
                projectTitle:
                  projectsData.find(
                    (projectData: any) => projectData.name.toLowerCase() === withdrawalItem.projectName.toLowerCase(),
                  )?.title || withdrawalItem.projectName,
              }),
            ),
          };
          return withdrawRequestResult;
        },
      );
      setWithdrawalRequestsResult(fetchedWithdrawalRequestList);
    }
  }, [withdrawalRequestsData]);

  return { data: withdrawalRequestsResult, isLoading };
};
