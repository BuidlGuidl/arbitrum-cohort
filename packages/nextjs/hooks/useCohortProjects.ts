import { useMemo } from "react";
import { projectsData } from "~~/data/projects";
import { withdrawalsData } from "~~/data/withdrawals";

type ProjectResult = {
  name: string;
  title: string;
  builders: `0x${string}`[];
  description: string;
  githubUrl: string;
  liveUrl: string;
};

export const useCohortProjects = () => {
  const data = useMemo<ProjectResult[]>(
    () =>
      projectsData.map(project => ({
        name: project.name,
        title: project.title,
        builders: [
          ...new Set(
            withdrawalsData
              .filter(withdrawal => withdrawal.projectName === project.name)
              .map(withdrawal => withdrawal.builder),
          ),
        ],
        description: project.description,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
      })),
    [],
  );

  return { data, isLoading: false };
};
