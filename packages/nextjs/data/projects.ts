type Project = {
  name: string;
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
};

export const projectsData: Project[] = [
  {
    name: "dev-creds",
    title: "DevCreds",
    description:
      "DevCreds is an on-chain developer reputation system on Arbitrum powered by attestations (EAS). Think of it as a trustworthy, verifiable version of LinkedIn endorsements, built for the Web3 world.",
    githubUrl: "https://github.com/damianmarti/dev-creds/",
    liveUrl: "",
  },
];
