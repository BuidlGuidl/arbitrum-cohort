import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "./scaffold-eth";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { formatUnits } from "viem";

type Withdrawal = {
  reason: string;
  amount: number;
  timestamp: number;
  projectName: string;
};

type Builder = {
  ens: string;
  address: `0x${string}`;
  amount: number;
  unlockedAmount?: number;
  cohortWithdrawals: { items: Withdrawal[] };
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
  const [buildersData, setBuildersData] = useState<Builder[]>([]);

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
        if (builderFromContract) {
          return {
            ...builder,
            unlockedAmount: parseFloat(formatUnits(builderFromContract.unlockedAmount, 6)),
          };
        }
        return builder;
      });
      setBuildersData(fetchedBuilderList);
    }
  }, [cohortBuildersData, allBuildersContractData]);

  return { data: buildersData, isLoading: isLoadingBuilders || isLoadingBuildersContractData };
};
