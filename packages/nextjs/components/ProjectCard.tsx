import { BuilderAddress } from "./BuilderAddress";

type ProjectCardProps = {
  title: string;
  description: string;
  builders: { address: `0x${string}`; ens: string }[];
  githubUrl?: string;
  liveUrl?: string;
};

export function ProjectCard({ title, description, builders, githubUrl, liveUrl }: ProjectCardProps) {
  // Remove duplicate addresses
  const uniqueBuilders = Array.from(new Map(builders.map(builder => [builder.address, builder])).values());

  return (
    <div className="bg-base-200 rounded-bl-lg rounded-br-lg">
      <div className="bg-primary rounded-tl-lg rounded-tr-lg p-2 md:px-4 md:py-3">
        <h3 className="m-0 text-lg font-semibold text-primary-content md:text-2xl">{title}</h3>
      </div>
      <div className="p-4 space-y-4">
        <p className="m-0">{description}</p>
        {uniqueBuilders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span>Builders:</span>
            <div className="flex gap-1">
              {uniqueBuilders.map(builder => (
                <BuilderAddress key={builder.address} address={builder.address} isImageOnly />
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <a href={githubUrl} className="btn btn-primary 2xl:min-w-32" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={liveUrl} className="btn btn-primary 2xl:min-w-32" target="_blank" rel="noopener noreferrer">
            Live URL
          </a>
        </div>
      </div>
    </div>
  );
}
