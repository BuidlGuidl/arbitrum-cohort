type StreamContributionItemProps = {
  title: string;
  description: string;
  date: string;
  amount: string;
};

export function StreamContributionItem({ title, description, date, amount }: StreamContributionItemProps) {
  return (
    <div className="py-6 grid grid-cols-1 gap-6 lg:grid-cols-6">
      <div>
        <div className="mt-2 px-2 py-1 inline-block bg-primary text-primary-content rounded-lg text-lg">{amount}</div>
      </div>
      <div className="lg:col-span-5">
        <div className="flex flex-col gap-1 lg:flex-row lg:gap-4 lg:items-center">
          <h3 className="m-0 text-xl lg:text-2xl">{title}</h3>
          <p className="m-0 text-sm lg:text-base">{date}</p>
        </div>
        <p className="mb-0 mt-2">{description}</p>
      </div>
    </div>
  );
}
