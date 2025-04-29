import { BuilderAddress } from "./BuilderAddress";

export function ContributionLogItem() {
  return (
    <div className="py-8 flex flex-col items-start gap-4 lg:flex-row lg:gap-8">
      <BuilderAddress
        address="0xB4F53bd85c00EF22946d24Ae26BC38Ac64F5E7B1"
        twitterUrl="https://x.com/hunterhchang"
        githubUrl="https://github.com/ChangoMan"
      />
      <div>
        <div className="flex items-center gap-4">
          <h3 className="m-0 text-xl lg:text-2xl">Project Title</h3>
          <p className="m-0">28.03.2025</p>
        </div>
        <p className="mb-0 mt-2">
          Collaborated on adding force fields, chests, doors to biomes so players can create and govern their own
          places: https://github.com/tenetxyz/biomes-scaffold
        </p>
      </div>
      <div className="px-2 py-1 bg-primary text-primary-content whitespace-nowrap rounded-lg text-lg lg:mt-2">
        200 USDC
      </div>
    </div>
  );
}
