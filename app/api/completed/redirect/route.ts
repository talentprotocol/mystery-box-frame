import { NextRequest, NextResponse } from "next/server";
import { EXPLORER_LINK } from "../../../../lib/constants";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const txHash = searchParams.get("txHash");
  if (!txHash) {
    return new NextResponse(null, { status: 400 });
  }
  return NextResponse.redirect(EXPLORER_LINK(txHash!), { status: 302 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
