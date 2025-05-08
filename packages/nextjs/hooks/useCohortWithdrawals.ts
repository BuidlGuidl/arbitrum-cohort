import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

type Withdrawal = {
  id: string;
  reason: string;
  builder: `0x${string}`;
  amount: bigint;
  timestamp: number;
  projectName: string;
};

type WithdrawalsData = { cohortWithdrawals: { items: Withdrawal[] } };

const fetchWithdrawals = async () => {
  const WithdrawalsQuery = gql`
    query Withdrawls {
      cohortWithdrawals(orderBy: "timestamp", orderDirection: "desc") {
        items {
          reason
          builder
          amount
          timestamp
          id
          projectName
        }
      }
    }
  `;
  const data = await request<WithdrawalsData>(
    process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
    WithdrawalsQuery,
  );
  return data;
};

export const useCohortWithdrawals = () => {
  const { data: withdrawalsData, isLoading } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: fetchWithdrawals,
  });

  const data = withdrawalsData?.cohortWithdrawals.items || [];

  return { data, isLoading };
};
