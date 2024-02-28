import { NextRequest, NextResponse } from "next/server";
import {
  EXPLORER_ADDRESS_LINK,
  EXPLORER_TX_LINK,
} from "../../../../lib/constants";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const txHash = searchParams.get("txHash");
  const address = searchParams.get("address");
  if (!txHash && !address) {
    return new NextResponse(null, { status: 400 });
  }
  if (txHash) {
    return NextResponse.redirect(EXPLORER_TX_LINK(txHash!), { status: 302 });
  } else {
    return NextResponse.redirect(EXPLORER_ADDRESS_LINK(address!), {
      status: 302,
    });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
