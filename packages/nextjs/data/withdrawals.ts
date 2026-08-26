export type WithdrawalData = {
  id: string;
  builder: `0x${string}`;
  amount: number; // USDC units, already divided by 1e6
  reason: string;
  projectName: string;
  timestamp: number; // seconds
};

// Snapshot of the cohort withdrawals indexed by Ponder, newest first.
export const withdrawalsData: WithdrawalData[] = [
  {
    id: "0x0f61692b12751ebc81f8245099810c0e3671fda07d8af26680fe39986cc5aa2f-0x1",
    builder: "0xB4F53bd85c00EF22946d24Ae26BC38Ac64F5E7B1",
    amount: 800,
    reason:
      "AI matching existing proposals - snapshot - tally (#22)\nLLM-based matching for snapshot/tally stages admin page (#27)\nTest #26 #23 #17 #12 #11 (forum, snapshot, tally imports and wire UI to database)\nInitial test of RAG (#19)",
    projectName: "proposals-dashboard",
    timestamp: 1773792350,
  },
  {
    id: "0xf41bff6ce1aad872e94ff4e2b9e429d05e99bbcada8011ae9be007bfbd389e73-0x7",
    builder: "0xB4F53bd85c00EF22946d24Ae26BC38Ac64F5E7B1",
    amount: 200,
    reason: "December work: Ideate and test My peers feature (#78). PM",
    projectName: "dev-creds",
    timestamp: 1773792108,
  },
  {
    id: "0x82b022996a88b1527485d443478099fcc5f057bc4d6796e805e19334232f8361-0x1",
    builder: "0x1990a6bCdb13D33463cBA884a1aE6020292523e8",
    amount: 500,
    reason: "Handle Re-imports PR (#18), Set up Live enviroment (#24) Review admin dashboard PR (#16)",
    projectName: "proposals-dashboard",
    timestamp: 1772382896,
  },
  {
    id: "0xc2872ceacef87e2ed22bec6f852b10ce6f58f46b0e71e290540e7587a730ebcf-0x4",
    builder: "0x4b7b07D8BAf51975eeAb0E1eb4B481A5aC691ED6",
    amount: 200,
    reason:
      "Implement responsive design fixes for all the pages in the app: https://github.com/damianmarti/dev-creds/pull/75",
    projectName: "dev-creds",
    timestamp: 1767743090,
  },
  {
    id: "0xafa1693c98c0e389b84470e39d0a380679883cd153d9d4e9f1a4164ec164b605-0x3",
    builder: "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93",
    amount: 600,
    reason:
      "Fix automatic deployment. Upgrade nextjs react https://github.com/damianmarti/dev-creds/pull/77Add My Peers page https://github.com/damianmarti/dev-creds/pull/78 PR Review: https://github.com/damianmarti/dev-creds/pull/75",
    projectName: "dev-creds",
    timestamp: 1766850010,
  },
  {
    id: "0x23d16a7235319ac5a32ec2743e96313232342b34c1f0c06ec40933dc78ede07b-0x1",
    builder: "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93",
    amount: 400,
    reason:
      "Add Arbitrum schema https://github.com/damianmarti/dev-creds/pull/68 Production setup and deploy. Check for developer data at builder page https://github.com/damianmarti/dev-creds/pull/71 PR Reviews: https://github.com/damianmarti/dev-creds/pull/73",
    projectName: "dev-creds",
    timestamp: 1762780569,
  },
  {
    id: "0x3ec4e36d62eebdad73c0b3febd3565a6c08816198a8b5cbf269b2668522f2427-0x3",
    builder: "0x1990a6bCdb13D33463cBA884a1aE6020292523e8",
    amount: 500,
    reason: "Forum import (#11), Snapshot import (#12)",
    projectName: "proposals-dashboard",
    timestamp: 1762160404,
  },
  {
    id: "0xa66bcf72ed686384f6d40878648098e998ab5cc26884b8cb7d59f218f280cd84-0x4",
    builder: "0x95E08FA8ac4301acC5b943f860Cd8AC84433e3CF",
    amount: 1000,
    reason:
      "Add link to my builder profile for registered users,Remove Skills UI from attestations page, Remove Collaborators UI from builder page - (PR #51)\nImproved form to open as modal for builder page + added validations for evidences to be valid urls\nImproved attestations list table\nHardcoded list of skills with Autocomplete\nReplacing placeholder for compute on builder page to show Address component (PR #58)\nMove Developer Search to Header (PR #65)\nGithub username validation (PR #69)\nReviewed PRs - (#54,#56,#59,#62,#64,#66,#68,#72)",
    projectName: "dev-creds",
    timestamp: 1762071064,
  },
  {
    id: "0x5dcc07880fa60b64c2cb31a029a3d39f89bedc954d18e5c43d98fe183e52c239-0x15",
    builder: "0xB4F53bd85c00EF22946d24Ae26BC38Ac64F5E7B1",
    amount: 200,
    reason: "Create dashboard UI with moc data (PR #10). Update data fetching issues with proper specification",
    projectName: "proposals-dashboard",
    timestamp: 1761819822,
  },
  {
    id: "0x50d5a2a70a4b5cc9411b3e5c1bb2ecf3ef2c7c127a1f77e59aaa200577854993-0x1",
    builder: "0xB4F53bd85c00EF22946d24Ae26BC38Ac64F5E7B1",
    amount: 800,
    reason:
      "Update link Github behavior (#61) and initial Readme version (#55).\nReview PRs (#69 #68 #65 #64 #62 #59 #58 #56)\nCreate video demo to share with the team",
    projectName: "dev-creds",
    timestamp: 1761819764,
  },
  {
    id: "0xf7700b610ed8fbd5d2bee368d3a018fee566f7742145674c38e9ac0e106f70b8-0x4",
    builder: "0x4b7b07D8BAf51975eeAb0E1eb4B481A5aC691ED6",
    amount: 750,
    reason:
      "Created OG image generation and dynamic metatags for builder profiles: https://github.com/damianmarti/dev-creds/pull/62\n\nAdded miniapp integration and  farcaster wallet support: https://github.com/damianmarti/dev-creds/pull/66",
    projectName: "dev-creds",
    timestamp: 1761568198,
  },
  {
    id: "0x4a9cd4428bcd29a7df75ba814f2659f876a98bda227abcd885cf8a2503e08130-0x2b",
    builder: "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93",
    amount: 1000,
    reason:
      "Builder profile with GitHub data and stats https://github.com/damianmarti/dev-creds/pull/41 Remove background to attestations list https://github.com/damianmarti/dev-creds/pull/54 Improve builder skills https://github.com/damianmarti/dev-creds/pull/56 Collaborator and verified badges  https://github.com/damianmarti/dev-creds/pull/59 Improve developers search https://github.com/damianmarti/dev-creds/pull/64 PR reviews: https://github.com/damianmarti/dev-creds/pull/40 https://github.com/damianmarti/dev-creds/pull/39 https://github.com/damianmarti/dev-creds/pull/51 https://github.com/damianmarti/dev-creds/pull/55 https://github.com/damianmarti/dev-creds/pull/58 https://github.com/damianmarti/dev-creds/pull/65 https://github.com/damianmarti/dev-creds/pull/66 https://github.com/damianmarti/dev-creds/pull/61",
    projectName: "dev-creds",
    timestamp: 1760967333,
  },
  {
    id: "0xb55410cb9abe3f035da0df72f46c1f4ef256eaf959f10c46272e8f3f60dccd68-0x18",
    builder: "0x1990a6bCdb13D33463cBA884a1aE6020292523e8",
    amount: 500,
    reason:
      "Define spec for the project with Pablo. Scaffold project + cleanup + initial database set up (PR #1 + #2). Review PR #3 (initial database schema)",
    projectName: "proposals-dashboard",
    timestamp: 1759402672,
  },
  {
    id: "0x65c5d0d7d6932fcf8f5f0a09795e9d9fdad337ee7d509ca7b0f975213871b930-0x5",
    builder: "0xB4F53bd85c00EF22946d24Ae26BC38Ac64F5E7B1",
    amount: 300,
    reason:
      "Review and test APIs for the different proposal platforms (tally, snapshot, forum). Create initial database schema and seed (PR #3)",
    projectName: "proposals-dashboard",
    timestamp: 1759224134,
  },
  {
    id: "0xfdb579052dddbc02bb63b93631a72f0183c53be886905656f4ece75eda786576-0xd",
    builder: "0xB4F53bd85c00EF22946d24Ae26BC38Ac64F5E7B1",
    amount: 700,
    reason: "Add footer (PR #53) and review PRs (#54 #51 #41 #39 #37 #32 #31 #25 #23 #20 #15)",
    projectName: "dev-creds",
    timestamp: 1759224024,
  },
  {
    id: "0x314a8d91cb123eb7005367b99eba5d5e42db52ff2fcfbf4e9c38c8e6ab1438cf-0x4",
    builder: "0x95E08FA8ac4301acC5b943f860Cd8AC84433e3CF",
    amount: 1000,
    reason:
      "Worked on Builder and Builders page with mockup data UI (covers 2 issues) - https://github.com/damianmarti/dev-creds/pull/20\nPR covering 5 issues (https://github.com/damianmarti/dev-creds/pull/32)\nCreating reusable components and graphql queries #26\nCreating reusable types to share between components #27\nCovers working and linking of search and builders list #29\nCovers link between Builders page and Builder Profile #34\nCovers prefilling value when attest button clicked on Builder Profile #35\nHelped review Dev-search and Ponder attestion list PR (#23)\nReview Github evidences PR (https://github.com/damianmarti/dev-creds/pull/31/files)\nReview Builder profile with GitHub data and stats (#41)",
    projectName: "dev-creds",
    timestamp: 1759218675,
  },
  {
    id: "0xedd474913a388757d53ffb28195d19ed90930c61b4bb994c94397e5117ff0f87-0x8",
    builder: "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93",
    amount: 750,
    reason:
      "Add dev search and ponder attestation list https://github.com/damianmarti/dev-creds/pull/23 Add attest page  https://github.com/damianmarti/dev-creds/pull/25 Verify GitHub evidences https://github.com/damianmarti/dev-creds/pull/31 Use a classic for loop to save dev skills https://github.com/damianmarti/dev-creds/pull/37 Issues creation and review. PR reviews: https://github.com/damianmarti/dev-creds/pull/14 https://github.com/damianmarti/dev-creds/pull/24 https://github.com/damianmarti/dev-creds/pull/20 https://github.com/damianmarti/dev-creds/pull/32",
    projectName: "dev-creds",
    timestamp: 1758925235,
  },
  {
    id: "0x0bd3c802e73fddd27896309490722a296e6128315a39b0f928a5ec80ce5fc830-0x4",
    builder: "0x4b7b07D8BAf51975eeAb0E1eb4B481A5aC691ED6",
    amount: 750,
    reason:
      "Worked on DevCreds issues:\n\nhttps://github.com/damianmarti/dev-creds/issues/19\nhttps://github.com/damianmarti/dev-creds/issues/18",
    projectName: "dev-creds",
    timestamp: 1758923167,
  },
  {
    id: "0x2165ea31d4d4a99f42098bc93d77462daa7ee023ae7917f1c15ecee65caa93c5-0x6",
    builder: "0xB4F53bd85c00EF22946d24Ae26BC38Ac64F5E7B1",
    amount: 500,
    reason:
      'Help with project ideation and prepare the "live mockups" with the different pages and use cases. Review github connection PR.\n--------\nPrepare initial proposals for Cohort Builds and review current governance workflows to prepare a build proposal to enhance it.',
    projectName: "dev-creds",
    timestamp: 1757370643,
  },
  {
    id: "0xa1f878ca6df9342d3d4befad6b8096e6e3eabfb1e878c74a794f7d3e97b94ec1-0x6",
    builder: "0x95E08FA8ac4301acC5b943f860Cd8AC84433e3CF",
    amount: 750,
    reason:
      "Worked on PRs -\nhttps://github.com/damianmarti/dev-creds/pull/12\nhttps://github.com/damianmarti/dev-creds/pull/14\nHelp review -\nhttps://github.com/damianmarti/dev-creds/pull/15\nRaised issues -\nhttps://github.com/damianmarti/dev-creds/issues/18\nhttps://github.com/damianmarti/dev-creds/issues/19\nTackled issues -\nhttps://github.com/damianmarti/dev-creds/issues/1\nhttps://github.com/damianmarti/dev-creds/issues/2\nhttps://github.com/damianmarti/dev-creds/issues/3",
    projectName: "dev-creds",
    timestamp: 1756997421,
  },
  {
    id: "0x5f2e340f541b670f06416f1be67e37c8a18483fdd0bcd9808eccedab37287a6e-0x9",
    builder: "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93",
    amount: 500,
    reason:
      "Create EAS schema. Allow to attest developers, with skills, description and evidence. Page with attestations list. Create first issues. EAS Indexer investigation. Add ponder indexer and add eas to config. Create new EAS schema with evidence as an array (https://github.com/damianmarti/dev-creds/pull/15). Review link GitHub feature PR (https://github.com/damianmarti/dev-creds/pull/12).",
    projectName: "dev-creds",
    timestamp: 1756853743,
  },
];
