import { useMemo } from "react";
import { buildersData } from "~~/data/builders";
import { withdrawalsData } from "~~/data/withdrawals";
import { BuilderWithSocialBase, WithdrawalRequestBase } from "~~/types/sharedTypes";

type WithdrawalResult = WithdrawalRequestBase & {
  builder: BuilderWithSocialBase;
};

export const useCohortWithdrawals = () => {
  const data = useMemo<WithdrawalResult[]>(
    () =>
      withdrawalsData.map(withdrawal => {
        const builder = buildersData.find(
          builder => builder.address.toLowerCase() === withdrawal.builder.toLowerCase(),
        );
        return {
          id: withdrawal.id,
          reason: withdrawal.reason,
          builder: {
            address: withdrawal.builder,
            x: builder?.x || "",
            github: builder?.github || "",
          },
          amount: withdrawal.amount,
          timestamp: withdrawal.timestamp,
          projectName: withdrawal.projectName,
        };
      }),
    [],
  );

  return { data, isLoading: false };
};
