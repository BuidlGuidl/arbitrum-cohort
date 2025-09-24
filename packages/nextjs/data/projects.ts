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
      "DevCreds is an on-chain developer reputation system on Arbitrum powered by attestations (EAS). Think of it as a trustworthy, verifiable version of LinkedIn endorsements.",
    githubUrl: "https://github.com/damianmarti/dev-creds/",
    liveUrl: "https://github.com/damianmarti/dev-creds/",
  },
  {
    name: "proposals-dashboard",
    title: "Proposals Dashboard",
    description:
      "A governance dashboard for Arbitrum that ingests proposals from Forums, Snapshot and Tally, glues them together and provides a user friendly UI to browse and navigate through them.",
    githubUrl: "https://github.com/carletex/arbitrum-dashboard",
    liveUrl: "https://github.com/carletex/arbitrum-dashboard",
  },
];
