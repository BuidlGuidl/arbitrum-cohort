"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Projects",
    href: "/#projects",
  },
  {
    label: "Builders",
    href: "/#builders",
  },
  {
    label: "Contributions",
    href: "/#contributions",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
];

export const HeaderMenuLinks = () => {
  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`hover:bg-base-200 focus:!bg-base-200 active:!text-base-content py-2 px-4 rounded-lg gap-2 grid grid-flow-col text-lg`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 py-4 px-0 sm:px-2 lg:py-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="lg:hidden dropdown" ref={burgerMenuRef}>
              <label
                tabIndex={0}
                className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
                onClick={() => {
                  setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
                }}
              >
                <Bars3Icon className="h-6 w-6" />
              </label>
              {isDrawerOpen && (
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                  onClick={() => {
                    setIsDrawerOpen(false);
                  }}
                >
                  <HeaderMenuLinks />
                </ul>
              )}
            </div>
            <Link href="/" passHref className="hidden lg:flex items-center ml-4 mr-6 shrink-0">
              <Image
                alt="Arbitrum Foundation"
                className="cursor-pointer w-60 h-auto"
                src="/logo-arbitrum-foundation.svg"
                width={1920}
                height={488.9}
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 pr-4 md:pr-0">
            <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
              <HeaderMenuLinks />
            </ul>
            <RainbowKitCustomConnectButton />
            {isLocalNetwork && <FaucetButton />}
          </div>
        </div>
      </div>
    </div>
  );
};
