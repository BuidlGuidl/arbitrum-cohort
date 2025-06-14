import { BuilderAddressProps } from "~~/components/BuilderAddress";

export interface CollapsibleItemProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
  builder: BuilderAddressProps;
  viewWork: boolean;
}

export interface WithdrawalRequestBase {
  id: string;
  amount: number;
  timestamp: number;
  reason: string;
  projectName: string;
}

export interface BuilderWithSocialBase {
  address: `0x${string}`;
  x: string;
  github: string;
}
