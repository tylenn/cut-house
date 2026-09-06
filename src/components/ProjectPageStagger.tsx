import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Semantic wrapper for project page content. Enter motion is handled by page transitions. */
export function ProjectPageStagger({ children }: Props) {
  return <article>{children}</article>;
}
