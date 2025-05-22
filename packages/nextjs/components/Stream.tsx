"use client";

import { useState } from "react";
import { BuilderAddress } from "~~/components/BuilderAddress";
import { ProgressBar } from "~~/components/ProgressBar";
import { CollapsibleItemProps } from "~~/types/sharedTypes";

type StreamItemProps = CollapsibleItemProps & {
  cap: number;
  unlockedAmount: number;
};

export function Stream({ children }: { children: React.ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}

export function StreamItem({ defaultOpen = false, children, builder, cap, unlockedAmount, viewWork }: StreamItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const percentage = Math.floor((unlockedAmount / cap) * 100);

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
        <div>
          <BuilderAddress address={builder.address} x={builder.x} github={builder.github} />
        </div>
        <div className="lg:col-span-3">
          <div className="mt-2 flex items-center gap-2 md:gap-6">
            <ProgressBar value={percentage} cap={cap} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-primary btn-xs !min-h-8 !h-8 lg:btn-md lg:!min-h-10 lg:!h-10"
              disabled={!viewWork}
            >
              {isOpen ? "Hide Work" : "View Work"}
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div className="mt-8">{children}</div>}
    </div>
  );
}
