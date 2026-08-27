import type { StegaBranded, StegaCleaned } from "next-sanity";

/**
 * Draft mode brands every string with an invisible Visual Editing payload;
 * `stega: false` does not. A component that renders in both has to accept
 * either shape, so props derive from this rather than from the raw query type.
 */
export type StegaAware<T> = StegaCleaned<T> | StegaBranded<T>;
