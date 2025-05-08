import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

type Builder = {
  ens: string;
  address: `0x${string}`;
  amount: bigint;
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
