import { formatUnits } from "viem";
import { ContractAddress } from "~~/components/ContractAddress";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const StreamContractInfo = () => {
  const { data: contractInfo, isLoading: isLoadingContractInfo } = useDeployedContractInfo({ contractName: "Cohort" });
  // TODO: change to use USDC on production
  const { data: balance } = useScaffoldReadContract({
    contractName: "ERC20Mock",
    functionName: "balanceOf",
    args: [contractInfo?.address],
  });

  return (
    <div className="mb-8 w-full grid grid-cols-1">
      <div className="p-8 bg-[#1f324a] rounded-t-lg lg:rounded-tr-none lg:rounded-tl-lg lg:rounded-bl-lg">
        <p className="mt-0 text-2xl lg:text-3xl">Stream Contract</p>
        <div className="flex items-center gap-6">
          {!isLoadingContractInfo && contractInfo && <ContractAddress address={contractInfo.address} />}
          <div className="px-2 py-1 bg-primary text-primary-content whitespace-nowrap rounded-lg text-lg">
            {balance ? Number(formatUnits(balance, 6)).toLocaleString() : "..."} USDC
          </div>
        </div>
      </div>
    </div>
  );
};
