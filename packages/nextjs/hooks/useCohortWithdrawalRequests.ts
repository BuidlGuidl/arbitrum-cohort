import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

type WithdrawalRequest = {
  id: string;
  requestId: bigint;
  reason: string;
  builder: `0x${string}`;
  amount: bigint;
  timestamp: number;
};

type WithdrawalRequestsData = { cohortWithdrawalRequests: { items: WithdrawalRequest[] } };

const fetchWithdrawalRequests = async () => {
  const WithdrawalRequestsQuery = gql`
    query WithdrawlRequests {
      cohortWithdrawalRequests(orderBy: "timestamp", orderDirection: "desc") {
        items {
          reason
          builder
          amount
          timestamp
          id
          requestId
          status
          projectName
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
  const { data: withdrawalRequestsData, isLoading } = useQuery({
    queryKey: ["withdrawalRequests"],
    queryFn: fetchWithdrawalRequests,
  });

  const data = withdrawalRequestsData?.cohortWithdrawalRequests.items || [];

  return { data, isLoading };
};
