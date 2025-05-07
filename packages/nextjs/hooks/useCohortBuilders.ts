import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

type Builder = {
  id: string;
  text: string;
  setterId: `0x${string}`;
  premium: boolean;
  value: bigint;
  timestamp: number;
};

type BuildersData = { cohortBuilders: { items: Builder[] } };

const fetchBuilders = async () => {
  const BuildersQuery = gql`
    query Builders {
      cohortBuilders(orderBy: "timestamp", orderDirection: "desc") {
        items {
          ens
          address
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

export const useCohortBuilders = () => {
  const { data: cohortBuildersData, isLoading } = useQuery({
    queryKey: ["builders"],
    queryFn: fetchBuilders,
  });

  const data = cohortBuildersData?.cohortBuilders.items || [];
  return { data, isLoading };
};
