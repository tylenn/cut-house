import "server-only";

import { cookies } from "next/headers";

import { INTRO_COOKIE } from "@/lib/intro";

export async function hasSeenIntro(): Promise<boolean> {
  const store = await cookies();
  return store.get(INTRO_COOKIE)?.value === "seen";
}
