"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ContributionLogItem } from "~~/components/ContributionLogItem";
import { ProjectCard } from "~~/components/ProjectCard";
import { Stream, StreamItem } from "~~/components/Stream";
import { StreamContributionItem } from "~~/components/StreamContributionItem";
import { useCohortBuildersWithWithdrawals } from "~~/hooks/useCohortBuildersWithWithdrawals";
import { useCohortWithdrawals } from "~~/hooks/useCohortWithdrawals";
import { projectsData } from "~~/utils/dummyData";

const Home: NextPage = () => {
  const { data: cohortWithdrawalsData, isLoading: isLoadingCohortWithdrawals } = useCohortWithdrawals();
  const { data: buildersWithWithdrawals, isLoading: isLoadingBuildersWithWithdrawals } =
    useCohortBuildersWithWithdrawals();

  return (
    <div className="px-4 md:px-0">
      <div className="container mx-auto">
        <section className="lg:flex lg:justify-between bg-[#1f324a] rounded-lg p-8 mb-8 w-full relative bg-gradient-to-b from-[#1f324a] to-[#162434]">
          <div className="max-w-3xl text-lg">
            <h1 className="text-4xl md:text-6xl/[1.2]">
              Welcome to <br className="hidden md:block" /> Arbitrum Builders Cohort
            </h1>
            <p className="mt-8">
              A collaborative initiative designed for building dapps and tools on the Arbitrum ecosystem.
            </p>
            <p>
              <span className="font-bold">A place for builders to contribute and learn</span>, where a handpicked group
              of high-impact builders receives targeted support, mentorship, and funding for their contributions through
              monthly on-chain streams.
            </p>
            <p>
              Progress is tracked transparently through public updates, contribution logs, and on-chain activity,
              encouraging a culture of accountability and shared learning.
            </p>
            <p>
              <span className="font-bold">Focus areas:</span> DeFi projects, MEV solvers, AI agents and TEEs (Trusted
              Execution Environments), DAO transparency tools.
            </p>
          </div>
          <div className="mt-6 lg:mt-0 lg:self-end">
            <Link href="/faq" className="btn btn-primary btn-lg py-2 px-4 leading-snug text-left">
              Frequently
              <br /> Asked Questions
              <PlusIcon className="w-8 h-8" />
            </Link>
          </div>
        </section>
      </div>
      <div id="projects" className="container mx-auto">
        <section className="bg-base-300 rounded-lg p-8 mb-8">
          <h2 className="mb-6 text-3xl md:text-4xl">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {projectsData.map(project => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                builders={project.builders}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
              />
            ))}
          </div>
        </section>
      </div>
      <div id="builders" className="container mx-auto">
        <section className="bg-base-300 rounded-lg p-8 mb-8">
          <h2 className="mb-4 text-3xl md:text-4xl">Builders</h2>
          <div className="mt-12">
            <div className="hidden mb-2 lg:grid lg:grid-cols-4">
              <div>
                <p className="mt-0">Builder</p>
              </div>
              <div className="lg:col-span-2">
                <p className="mt-0">Stream</p>
              </div>
            </div>
            <Stream>
              {isLoadingBuildersWithWithdrawals ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                buildersWithWithdrawals.map(builder => (
                  <StreamItem
                    key={builder.address}
                    builder={{
                      address: builder.address,
                      twitterUrl: "https://x.com/hunterhchang",
                      githubUrl: "https://github.com/ChangoMan",
                    }}
                    cap={builder.amount}
                    unlockedAmount={builder.unlockedAmount || 0}
                    viewWork={builder.cohortWithdrawals.items.length > 0}
                  >
                    <div className="px-6 rounded-lg bg-base-100 divide-y">
                      {builder.cohortWithdrawals.items.map(item => (
                        <StreamContributionItem
                          key={item.timestamp}
                          title={item.projectName}
                          description={item.reason}
                          date={new Date(item.timestamp * 1000).toLocaleDateString()} // Convert timestamp to date string
                          amount={item.amount}
                        />
                      ))}
                    </div>
                  </StreamItem>
                ))
              )}
            </Stream>
          </div>
        </section>
      </div>
      <div id="contributions" className="container mx-auto">
        <section className="bg-base-300 rounded-lg p-8 mb-8">
          <h2 className="mb-4 text-3xl md:text-4xl">Contribution Log</h2>
          <div className="divide-y">
            {isLoadingCohortWithdrawals ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              cohortWithdrawalsData.map(item => (
                <ContributionLogItem
                  key={item.id}
                  title={item.projectName}
                  description={item.reason}
                  date={new Date(item.timestamp * 1000).toLocaleDateString()}
                  amount={item.amount}
                  builder={{
                    address: item.builder,
                    twitterUrl: "https://x.com/hunterhchang",
                    githubUrl: "https://github.com/ChangoMan",
                  }}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
