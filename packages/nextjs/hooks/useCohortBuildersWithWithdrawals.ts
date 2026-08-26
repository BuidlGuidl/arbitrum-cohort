import { useMemo } from "react";
import { useScaffoldReadContract } from "./scaffold-eth";
import { formatUnits } from "viem";
import { buildersData } from "~~/data/builders";
import { WithdrawalData, withdrawalsData } from "~~/data/withdrawals";
import { BuilderWithSocialBase } from "~~/types/sharedTypes";

type Withdrawal = Omit<WithdrawalData, "id" | "builder">;

type BuilderResult = {
  builder: BuilderWithSocialBase;
  amount: number;
  unlockedAmount: number;
  withdrawals: Withdrawal[];
};

const builderList = buildersData.map(builder => builder.address);

export const useCohortBuildersWithWithdrawals = () => {
  const { data: allBuildersContractData, isLoading: isLoadingContractData } = useScaffoldReadContract({
    contractName: "Cohort",
    functionName: "allBuildersData",
    args: [builderList],
  });

  const data = useMemo<BuilderResult[]>(
    () =>
      buildersData.map(builder => {
        const contractData = allBuildersContractData?.find(
          builderContract => builderContract.builderAddress.toLowerCase() === builder.address.toLowerCase(),
        );
        return {
          builder: {
            address: builder.address,
            x: builder.x,
            github: builder.github,
          },
          amount: contractData ? parseFloat(formatUnits(contractData.cap, 6)) : 0,
          unlockedAmount: contractData ? parseFloat(formatUnits(contractData.unlockedAmount, 6)) : 0,
          withdrawals: withdrawalsData.filter(
            withdrawal => withdrawal.builder.toLowerCase() === builder.address.toLowerCase(),
          ),
        };
      }),
    [allBuildersContractData],
  );

  // Caps and unlocked amounts only make sense once the contract answered, so keep the spinner until then.
  return { data, isLoading: isLoadingContractData || !allBuildersContractData };
};
