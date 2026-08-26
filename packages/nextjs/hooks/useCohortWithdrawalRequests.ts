import { useMemo } from "react";
import { useDeployedContractInfo, useScaffoldEventHistory, useTargetNetwork } from "./scaffold-eth";
import { formatUnits } from "viem";
import { useReadContracts } from "wagmi";
import { buildersData } from "~~/data/builders";
import { projectsData } from "~~/data/projects";
import { withdrawalsData } from "~~/data/withdrawals";
import { BuilderWithSocialBase, WithdrawalRequestBase } from "~~/types/sharedTypes";

// Block the Cohort contract was deployed at, see contracts/deployedContracts.ts
const COHORT_START_BLOCK = 345914690n;

// withdrawRequests(builder, requestId) return values
type WithdrawRequestState = readonly [
  amount: bigint,
  reason: string,
  approved: boolean,
  completed: boolean,
  requestTime: bigint,
  projectName: string,
];

type Withdrawal = WithdrawalRequestBase & {
  projectTitle: string;
};

type WithdrawalRequestResult = WithdrawalRequestBase & {
  requestId: bigint;
  builder: BuilderWithSocialBase;
  projectTitle: string;
  withdrawals: Withdrawal[];
};

const getProjectTitle = (projectName: string) =>
  projectsData.find(project => project.name.toLowerCase() === projectName.toLowerCase())?.title || projectName;

/**
 * Pending withdrawal requests, read from the chain: WithdrawRequested events give us every
 * (builder, requestId) pair, and the withdrawRequests mapping tells us which ones are still open.
 * Both approving and rejecting a request set `completed`, so `!completed` means pending.
 */
export const useCohortWithdrawalRequests = () => {
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContract } = useDeployedContractInfo({ contractName: "Cohort" });

  const { data: requestEvents, isLoading: isLoadingEvents } = useScaffoldEventHistory({
    contractName: "Cohort",
    eventName: "WithdrawRequested",
    fromBlock: COHORT_START_BLOCK,
  });

  const requests = useMemo(
    () =>
      (requestEvents || []).flatMap(({ args }) =>
        args.builder && args.requestId !== undefined
          ? [{ builder: args.builder as `0x${string}`, requestId: args.requestId }]
          : [],
      ),
    [requestEvents],
  );

  const { data: requestStates, isLoading: isLoadingStates } = useReadContracts({
    contracts: requests.map(request => ({
      chainId: targetNetwork.id,
      address: deployedContract?.address,
      abi: deployedContract?.abi,
      functionName: "withdrawRequests",
      args: [request.builder, request.requestId],
    })),
    query: { enabled: Boolean(deployedContract) && requests.length > 0 },
  });

  const data = useMemo<WithdrawalRequestResult[]>(() => {
    if (!requestStates) return [];

    return requests
      .map((request, index) => ({ request, state: requestStates[index]?.result as WithdrawRequestState | undefined }))
      .filter(({ state }) => state && !state[3])
      .map(({ request, state }) => {
        const [amount, reason, , , requestTime, projectName] = state as WithdrawRequestState;
        const builder = buildersData.find(builder => builder.address.toLowerCase() === request.builder.toLowerCase());
        return {
          id: `${request.builder}-${request.requestId}`,
          requestId: request.requestId,
          reason,
          builder: {
            address: request.builder,
            x: builder?.x || "",
            github: builder?.github || "",
          },
          amount: parseFloat(formatUnits(amount, 6)),
          timestamp: Number(requestTime),
          projectName,
          projectTitle: getProjectTitle(projectName),
          withdrawals: withdrawalsData
            .filter(withdrawal => withdrawal.builder.toLowerCase() === request.builder.toLowerCase())
            .map(withdrawal => ({
              id: withdrawal.id,
              amount: withdrawal.amount,
              timestamp: withdrawal.timestamp,
              reason: withdrawal.reason,
              projectName: withdrawal.projectName,
              projectTitle: getProjectTitle(withdrawal.projectName),
            })),
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [requests, requestStates]);

  return { data, isLoading: isLoadingEvents || (requests.length > 0 && isLoadingStates) };
};
