import React from "react";
import clsx from "clsx";

interface ProgressBarProps {
  value: number; // 0-100
  cap: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value = 0, cap = 100, className = "" }) => {
  return (
    <div className={clsx("relative w-full py-4 bg-primary rounded-md", className)}>
      <div className="absolute py-4 inset-0 bg-accent rounded-md" style={{ width: `${value}%` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary-content text-sm font-medium">{value}%</span>
        </div>
      </div>
      <p className="absolute inset-0 flex items-center justify-end pr-4 text-primary-content text-sm font-medium">
        {cap} USDC
      </p>
    </div>
  );
};
