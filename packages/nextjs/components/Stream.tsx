"use client";

import { useState } from "react";
import { BuilderAddress, BuilderAddressProps } from "~~/components/BuilderAddress";
import { ProgressBar } from "~~/components/ProgressBar";

interface StreamItemProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
  builder: BuilderAddressProps;
  cap: number;
  unlockedAmount: number;
}

export function Stream({ children }: { children: React.ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}

export function StreamItem({ defaultOpen = false, children, builder, cap, unlockedAmount }: StreamItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const percentage = Math.floor((unlockedAmount / cap) * 100);

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4">
        <div>
          <BuilderAddress address={builder.address} twitterUrl={builder.twitterUrl} githubUrl={builder.githubUrl} />
        </div>
        <div className="lg:col-span-2">
          <ProgressBar className="mt-2" value={percentage} cap={cap} />
        </div>
        <div className="text-right">
          <button onClick={() => setIsOpen(!isOpen)} className="btn btn-primary">
            {isOpen ? "Hide Work" : "View Work"}
          </button>
        </div>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
}
