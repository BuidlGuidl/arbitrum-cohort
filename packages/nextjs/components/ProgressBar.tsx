import React from "react";
import clsx from "clsx";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value = 0, className = "" }) => {
  return (
    <div className={clsx("relative w-full py-4 bg-primary rounded-md", className)}>
      <div className="absolute py-4 inset-0 bg-accent rounded-md" style={{ width: `${value}%` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary-content text-sm font-medium">{value}%</span>
        </div>
      </div>
    </div>
  );
};
