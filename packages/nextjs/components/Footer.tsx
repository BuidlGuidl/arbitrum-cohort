import Image from "next/image";
import Link from "next/link";
import { StreamContractInfo } from "./StreamContractInfo";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="container mx-auto px-4 md:px-0">
      <StreamContractInfo />
      <footer className="p-8 mb-8 w-full bg-base-300 rounded-lg">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div>
            <p className="m-0 text-2xl lg:text-4xl">Arbitrum Builders Cohort</p>
            <p>A place for builders to contribute and learn.</p>
          </div>
          <div className="flex gap-8 md:gap-12 lg:mr-20">
            <div>
              <p className="mt-0 text-lg text-secondary md:text-xl">Cohort</p>
              <ul className="space-y-2">
                <li>
                  <Link className="link no-underline hover:underline" href="/#projects">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link className="link no-underline hover:underline" href="/#builders">
                    Builders
                  </Link>
                </li>
                <li>
                  <Link className="link no-underline hover:underline" href="/faq">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mt-0 text-lg text-secondary md:text-xl">Social</p>
              <ul className="space-y-2">
                <li>
                  <Link className="link no-underline hover:underline" href="https://x.com/buidlguidl" target="_blank">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    className="link no-underline hover:underline"
                    href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA"
                    target="_blank"
                  >
                    Telegram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-5 md:mt-0 md:items-center md:flex-row md:gap-6">
          <p className="m-0 flex items-center gap-2">
            Funded by{" "}
            <a href="https://arbitrum.foundation/" target="_blank" rel="noopener noreferrer">
              <Image
                alt="Arbitrum Logo"
                src="/logo-arbitrum.svg"
                width={1657.31}
                height={422.01}
                className="h-8 w-auto"
              />
            </a>
          </p>
          <p className="m-0 flex items-center gap-2">
            Admin by{" "}
            <a href="https://buidlguidl.com/" target="_blank" rel="noopener noreferrer">
              <Image
                alt="BuidlGuidl Logo"
                src="/logo-buidlguidl.svg"
                width={135}
                height={27}
                className="h-5 w-auto mb-1.5"
              />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
