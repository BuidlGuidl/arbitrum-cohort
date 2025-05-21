import { BuilderAddressProps } from "~~/components/BuilderAddress";

export interface CollapsibleItemProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
  builder: BuilderAddressProps;
  viewWork: boolean;
}
