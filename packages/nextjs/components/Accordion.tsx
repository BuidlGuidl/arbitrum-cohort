"use client";

import { useState } from "react";
import { BuilderAddress } from "~~/components/BuilderAddress";
import { ProgressBar } from "~~/components/ProgressBar";

interface AccordionItemProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}

export function AccordionItem({ defaultOpen = false, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4">
        <div>
          <BuilderAddress
            address="0xf7e89E45502890381F9242403eA8661fad89Ca79"
            twitterUrl="https://twitter.com/BuilderDao"
            githubUrl="https://github.com/BuilderDao"
          />
        </div>
        <div className="lg:col-span-2">
          <ProgressBar className="mt-2" value={90} />
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
