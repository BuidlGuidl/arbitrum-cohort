import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "./scaffold-eth";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { formatUnits } from "viem";
import { buildersData } from "~~/data/builders";
import { projectsData } from "~~/data/projects";

type CohortWithdrawal = {
  id: string;
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
  cohortWithdrawals: { items: CohortWithdrawal[] };
};

type Withdrawal = CohortWithdrawal & {
  projectTitle: string;
};

type BuilderResult = {
  builder: {
    address: `0x${string}`;
    ens: string;
    x: string;
    github: string;
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
              id
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
          withdrawals: builder.cohortWithdrawals.items.map((withdrawalItem: CohortWithdrawal) => ({
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
