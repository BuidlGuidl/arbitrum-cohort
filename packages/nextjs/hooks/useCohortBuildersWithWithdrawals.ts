import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "./scaffold-eth";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { formatUnits } from "viem";
import { buildersData } from "~~/data/builders";
import { BuilderWithSocialBase, WithdrawalRequestBase } from "~~/types/sharedTypes";

type Withdrawal = Omit<WithdrawalRequestBase, "id">;

type Builder = {
  ens: string;
  address: `0x${string}`;
  amount: number;
  unlockedAmount?: number;
  cohortWithdrawals: { items: Withdrawal[] };
};

type BuilderResult = {
  builder: BuilderWithSocialBase & {
    ens: string;
  };
  amount: number;
  unlockedAmount: number;
  withdrawals: Withdrawal[];
};

type BuildersData = { cohortBuilders: { items: Builder[] } };

const fetchBuilders = async () => {
  const BuildersQuery = gql`
    query Builders {
      cohortBuilders(orderBy: "timestamp", orderDirection: "desc") {
        items {
          ens
          address
          amount
          cohortWithdrawals(orderBy: "timestamp", orderDirection: "desc") {
            items {
              amount
              reason
              projectName
              timestamp
            }
          }
        }
      }
    }
  `;
  const data = await request<BuildersData>(
    process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
    BuildersQuery,
  );
  return data;
};

export const useCohortBuildersWithWithdrawals = () => {
  const [builderList, setBuilderList] = useState<string[]>([]);
  const [buildersResult, setBuildersResult] = useState<BuilderResult[]>([]);

  const { data: cohortBuildersData, isLoading: isLoadingBuilders } = useQuery({
    queryKey: ["buildersWithWithdrawals"],
    queryFn: fetchBuilders,
  });

  useEffect(() => {
    if (cohortBuildersData && cohortBuildersData.cohortBuilders.items.length > 0) {
      const fetchedBuilderList = cohortBuildersData.cohortBuilders.items.map((builder: Builder) => builder.address);
      setBuilderList(fetchedBuilderList);
    }
  }, [cohortBuildersData]);

  const { data: allBuildersContractData, isLoading: isLoadingBuildersContractData } = useScaffoldReadContract({
    contractName: "Cohort",
    functionName: "allBuildersData",
    args: [builderList],
  });

  useEffect(() => {
    if (
      cohortBuildersData &&
      cohortBuildersData.cohortBuilders.items.length > 0 &&
      allBuildersContractData &&
      allBuildersContractData.length > 0
    ) {
      type BuilderContractData = (typeof allBuildersContractData)[0];
      const fetchedBuilderList = cohortBuildersData.cohortBuilders.items.map((builder: Builder) => {
        const builderFromContract = allBuildersContractData.find(
          (builderContract: BuilderContractData) =>
            builderContract.builderAddress.toLowerCase() === builder.address.toLowerCase(),
        );
        const builderData = buildersData.find(
          (builderData: any) => builderData.address.toLowerCase() === builder.address.toLowerCase(),
        );
        const builderResult: BuilderResult = {
          builder: {
            address: builder.address,
            ens: builder.ens,
            x: builderData?.x || "",
            github: builderData?.github || "",
          },
          amount: builder.amount,
          unlockedAmount: 0,
          withdrawals: builder.cohortWithdrawals.items,
        };
        if (builderFromContract) {
          builderResult.unlockedAmount = parseFloat(formatUnits(builderFromContract.unlockedAmount, 6));
        }
        return builderResult;
      });
      setBuildersResult(fetchedBuilderList);
    }
  }, [cohortBuildersData, allBuildersContractData]);

  return { data: buildersResult, isLoading: isLoadingBuilders || isLoadingBuildersContractData };
};
