import { BuilderAddress } from "./BuilderAddress";

type ContributionLogItemProps = {
  title: string;
  description: string;
  date: string;
  amount: string;
  builder: {
    address: string;
    twitterUrl?: string;
    githubUrl?: string;
  };
};

export function ContributionLogItem({ title, description, date, amount, builder }: ContributionLogItemProps) {
  return (
    <div className="py-8 flex flex-col items-start gap-4 lg:flex-row lg:gap-8">
      <BuilderAddress address={builder.address} twitterUrl={builder.twitterUrl} githubUrl={builder.githubUrl} />
      <div>
        <div className="flex items-center gap-4">
          <h3 className="m-0 text-xl lg:text-2xl">{title}</h3>
          <p className="m-0">{date}</p>
        </div>
        <p className="mb-0 mt-2">{description}</p>
      </div>
      <div className="px-2 py-1 bg-primary text-primary-content whitespace-nowrap rounded-lg text-lg lg:mt-2">
        {amount}
      </div>
    </div>
  );
}
