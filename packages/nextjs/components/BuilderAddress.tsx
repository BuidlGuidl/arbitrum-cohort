import Image from "next/image";
import { blo } from "blo";
import clsx from "clsx";
import { getAddress, isAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsAvatar, useEnsName } from "wagmi";

export type BuilderAddressProps = {
  className?: string;
  address: string;
  x?: string;
  github?: string;
  isImageOnly?: boolean;
};

export function BuilderAddress({ className, address, x, github, isImageOnly }: BuilderAddressProps) {
  const checkSumAddress = address ? getAddress(address) : undefined;

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

  if (isImageOnly) {
    return (
      <>
        {isEnsNameLoading || isEnsAvatarLoading ? (
          <div className="skeleton w-7 h-7 rounded-md bg-base-200" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ensAvatar || blo(address as `0x${string}`)}
            width={28}
            height={28}
            alt="Avatar"
            className="rounded-full shrink-0"
          />
        )}
      </>
    );
  }

  return (
    <div className={clsx("flex flex-wrap items-center gap-4 shrink-0 lg:gap-6", className)}>
      {isEnsNameLoading || isEnsAvatarLoading ? (
        <div className="skeleton w-12 h-12 rounded-md bg-base-200" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ensAvatar || blo(address as `0x${string}`)}
          width={48}
          height={48}
          alt="Avatar"
          className="rounded-lg shrink-0"
        />
      )}

      {isEnsNameLoading ? (
        <div className="skeleton w-32 h-6 rounded-md bg-base-200" />
      ) : (
        <p className="m-0 text-lg">{ens || checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}</p>
      )}
      <div className="flex items-center gap-2 shrink-0">
        {x && (
          <a href={`https://x.com/${x}`} target="_blank" rel="noopener noreferrer">
            <Image alt="Twitter Icon" src="/icon-twitter.svg" width={28} height={28} />
          </a>
        )}
        {github && (
          <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer">
            <Image alt="Github Icon" src="/icon-github.svg" width={28} height={28} />
          </a>
        )}
      </div>
    </div>
  );
}
