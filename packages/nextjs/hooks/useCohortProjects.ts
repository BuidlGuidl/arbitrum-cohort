import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { projectsData } from "~~/data/projects";

type Withdrawal = {
  projectName: string;
  cohortBuilder: {
    ens: string;
    address: `0x${string}`;
  };
};

type WithdrawalsData = { cohortWithdrawals: { items: Withdrawal[] } };

type ProjectResult = {
  name: string;
  title: string;
  builders: `0x${string}`[];
  description: string;
  githubUrl: string;
  liveUrl: string;
};

const fetchWithdrawals = async () => {
  const WithdrawalsQuery = gql`
    query Withdrawls {
      cohortWithdrawals(orderBy: "timestamp", orderDirection: "desc") {
        items {
          projectName
          cohortBuilder {
            ens
            address
          }
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

export const useCohortProjects = () => {
  const [projectsResult, setProjectsResult] = useState<ProjectResult[]>([]);

  const { data: withdrawalsData, isLoading } = useQuery({
    queryKey: ["projectsFromWithdrawals"],
    queryFn: fetchWithdrawals,
  });

  useEffect(() => {
    if (!isLoading) {
      type ProjectData = (typeof projectsData)[0];
      const fetchedProjectList = projectsData.map((projectData: ProjectData) => {
        const buildersData = withdrawalsData?.cohortWithdrawals.items.filter(
          (withdrawalData: Withdrawal) => withdrawalData.projectName === projectData.name,
        );
        const projectResult: ProjectResult = {
          name: projectData.name,
          title: projectData.title,
          builders: buildersData
            ? [...new Set(buildersData.map((builderData: Withdrawal) => builderData.cohortBuilder.address))]
            : [],
          description: projectData.description,
          githubUrl: projectData.githubUrl,
          liveUrl: projectData.liveUrl,
        };
        return projectResult;
      });
      setProjectsResult(fetchedProjectList);
    }
  }, [withdrawalsData, isLoading]);

  return { data: projectsResult, isLoading };
};
