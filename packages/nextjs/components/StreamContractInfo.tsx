import { ContractAddress } from "~~/components/ContractAddress";

export const StreamContractInfo = () => {
  return (
    <div className="mb-8 w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="p-8 bg-[#1f324a] rounded-t-lg lg:rounded-tr-none lg:rounded-tl-lg lg:rounded-bl-lg">
        <p className="mt-0 text-2xl lg:text-3xl">Stream Contract</p>
        <ContractAddress address="0x495634676f6626A97Cc178FfA01EE3E99E2655c6" />
      </div>
      <div className="p-8 bg-base-300 rounded-b-lg lg:rounded-bl-none lg:rounded-tr-lg lg:rounded-br-lg">
        <p className="mt-0 text-2xl lg:text-3xl">Owner</p>
        <ContractAddress address="0x630ddBE2a248e6F483FD021C13617421b476aE92" />
      </div>
    </div>
  );
};
