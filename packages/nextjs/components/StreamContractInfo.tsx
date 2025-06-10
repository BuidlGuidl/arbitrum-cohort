import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { ContractAddress } from "~~/components/ContractAddress";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export const StreamContractInfo = () => {
  const { data: contractInfo, isLoading: isLoadingContractInfo } = useDeployedContractInfo({ contractName: "Cohort" });
  const erc20Abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const { data: balance } = useReadContract({
    abi: erc20Abi,
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC on Arbitrum
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
            {typeof balance !== "undefined" ? Number(formatUnits(balance as bigint, 6)).toLocaleString() : "..."} USDC
          </div>
        </div>
      </div>
    </div>
  );
};
