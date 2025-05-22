import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { buildersData } from "~~/data/builders";
import { BuilderWithSocialBase, WithdrawalRequestBase } from "~~/types/sharedTypes";

type Withdrawal = WithdrawalRequestBase & {
  builder: `0x${string}`;
};

type WithdrawalsData = { cohortWithdrawals: { items: Withdrawal[] } };

type WithdrawalResult = WithdrawalRequestBase & {
  builder: BuilderWithSocialBase;
};

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
  const [withdrawalsResult, setWithdrawalsResult] = useState<WithdrawalResult[]>([]);

  const { data: withdrawalsData, isLoading } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: fetchWithdrawals,
  });

  useEffect(() => {
    if (withdrawalsData && withdrawalsData.cohortWithdrawals.items.length > 0) {
      const fetchedWithdrawalList = withdrawalsData.cohortWithdrawals.items.map((withdrawal: Withdrawal) => {
        const builderData = buildersData.find(
          (builderData: any) => builderData.address.toLowerCase() === withdrawal.builder.toLowerCase(),
        );
        const withdrawResult: WithdrawalResult = {
          id: withdrawal.id,
          reason: withdrawal.reason,
          builder: {
            address: withdrawal.builder,
            x: builderData?.x || "",
            github: builderData?.github || "",
          },
          amount: withdrawal.amount,
          timestamp: withdrawal.timestamp,
          projectName: withdrawal.projectName,
        };
        return withdrawResult;
      });
      setWithdrawalsResult(fetchedWithdrawalList);
    }
  }, [withdrawalsData]);

  return { data: withdrawalsResult, isLoading };
};
