"use client";

import { useRef } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ContributionLogItem } from "~~/components/ContributionLogItem";
import { ProjectCard } from "~~/components/ProjectCard";
import { Stream, StreamItem } from "~~/components/Stream";
import { StreamContributionItem } from "~~/components/StreamContributionItem";
import { WithdrawModal } from "~~/components/WithdrawModal";
import { useCohortBuilders } from "~~/hooks/useCohortBuilders";
import { useCohortBuildersWithWithdrawals } from "~~/hooks/useCohortBuildersWithWithdrawals";
import { useCohortProjects } from "~~/hooks/useCohortProjects";
import { useCohortWithdrawals } from "~~/hooks/useCohortWithdrawals";

const Home: NextPage = () => {
  const withdrawModalRef = useRef<HTMLDialogElement>(null);

  const { data: cohortWithdrawalsData, isLoading: isLoadingCohortWithdrawals } = useCohortWithdrawals();
  const { data: buildersWithWithdrawals, isLoading: isLoadingBuildersWithWithdrawals } =
    useCohortBuildersWithWithdrawals();
  const { data: cohortProjectsData, isLoading: isLoadingCohortProjects } = useCohortProjects();
  const { address: currentUserAddress } = useAccount();
  const { data: builders, isLoading: isBuildersLoading } = useCohortBuilders();
  const isBuilder = builders?.some(builder => builder.address.toLowerCase() === currentUserAddress?.toLowerCase());

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
            {isLoadingCohortProjects ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              cohortProjectsData.map(project => (
                <ProjectCard
                  key={project.name}
                  title={project.title}
                  description={project.description}
                  builders={project.builders}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                />
              ))
            )}
          </div>
        </section>
      </div>
      <div id="builders" className="container mx-auto">
        <section className="bg-base-300 rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl md:text-4xl">Builders</h2>
            {isBuildersLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : isBuilder ? (
              <button
                className="btn btn-primary 2xl:min-w-32"
                onClick={() => {
                  withdrawModalRef.current?.showModal();
                }}
              >
                Withdraw
              </button>
            ) : null}
          </div>
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
                buildersWithWithdrawals.map(builderData => (
                  <StreamItem
                    key={builderData.builder.address}
                    builder={builderData.builder}
                    cap={builderData.amount}
                    unlockedAmount={builderData.unlockedAmount}
                    viewWork={builderData.withdrawals.length > 0}
                  >
                    <div className="px-6 rounded-lg bg-base-100 divide-y">
                      {builderData.withdrawals.map(item => (
                        <StreamContributionItem
                          key={item.timestamp}
                          title={item.projectName}
                          description={item.reason}
                          date={new Date(item.timestamp * 1000).toLocaleDateString()}
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
                  builder={item.builder}
                />
              ))
            )}
          </div>
        </section>
      </div>
      <WithdrawModal ref={withdrawModalRef} closeModal={() => withdrawModalRef.current?.close()} />
    </div>
  );
};

export default Home;
