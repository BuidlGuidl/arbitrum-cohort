"use client";

import Link from "next/link";
import { blo } from "blo";
import clsx from "clsx";
import { Address as AddressType, getAddress, isAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsAvatar, useEnsName } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

type ContractAddressProps = {
  address: AddressType;
  className?: string;
};

export const ContractAddress = ({ address, className }: ContractAddressProps) => {
  const checkSumAddress = address ? getAddress(address) : "";

  const { targetNetwork } = useTargetNetwork();

  const { data: ens, isLoading: isEnsNameLoading } = useEnsName({
    address: checkSumAddress,
    chainId: 1,
    query: {
      enabled: isAddress(checkSumAddress ?? ""),
    },
  });

  const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useEnsAvatar({
    name: ens ? normalize(ens) : undefined,
    chainId: 1,
    query: {
      enabled: Boolean(ens),
      gcTime: 30_000,
    },
  });

  const shortAddress = checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4);
  const blockExplorerAddressLink = getBlockExplorerAddressLink(targetNetwork, checkSumAddress);

  return (
    <div className={clsx("flex flex-wrap items-center gap-4 shrink-0", className)}>
      {isEnsNameLoading || isEnsAvatarLoading ? (
        <div className="skeleton w-8 h-8 rounded-full bg-base-200" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ensAvatar || blo(address as `0x${string}`)}
          width={32}
          height={32}
          alt="Avatar"
          className="rounded-full shrink-0"
        />
      )}

      {isEnsNameLoading ? (
        <div className="skeleton w-32 h-6 rounded-md bg-base-200" />
      ) : (
        <p className="m-0 text-lg">
          <Link href={blockExplorerAddressLink} target="_blank" rel="noopener noreferrer">
            {ens ? ens : shortAddress}
          </Link>
        </p>
      )}
    </div>
  );
};
