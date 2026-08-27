import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { revalidateSecret } from "@/sanity/env";

/**
 * Belt and braces.
 *
 * The Live Content API already handles freshness on its own — it attaches sync
 * tags per query and revalidates them. This webhook exists so a publish purges
 * immediately rather than on the next natural revalidation.
 */
export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      request,
      revalidateSecret,
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse("Bad request", { status: 400 });
    }

    // Second argument is a cacheLife profile. updateTag() is the single-arg
    // one, but it is Server-Action only and does nothing in a route handler.
    revalidateTag(body._type, "max");

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (error) {
    console.error("Revalidation webhook failed", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
