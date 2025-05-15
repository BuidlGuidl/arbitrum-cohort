import { BuilderAddress } from "./BuilderAddress";

type ContributionLogItemProps = {
  title: string;
  description: string;
  date: string;
  amount: number;
  builder: {
    address: string;
    x?: string;
    github?: string;
  };
};

export function ContributionLogItem({ title, description, date, amount, builder }: ContributionLogItemProps) {
  return (
    <div className="py-8 flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
      <BuilderAddress className="lg:mt-2 lg:min-w-80" address={builder.address} x={builder.x} github={builder.github} />
      <div>
        <div className="flex flex-col gap-1 lg:flex-row lg:gap-4 lg:items-baseline">
          <h3 className="m-0 text-xl lg:text-2xl">{title}</h3>
          <p className="m-0 text-sm lg:text-base">{date}</p>
        </div>
        <p className="mb-0 mt-2">{description}</p>
      </div>
      <div className="px-2 py-1 bg-primary text-primary-content whitespace-nowrap rounded-lg text-lg lg:mt-2">
        {amount} USDC
      </div>
    </div>
  );
}
