import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") ?? "/";

  // Only ever redirect to a same-origin path, so a crafted link cannot bounce
  // someone off-site through our domain.
  const safePath = redirectTo.startsWith("/") ? redirectTo : "/";

  return NextResponse.redirect(new URL(safePath, request.url));
}
