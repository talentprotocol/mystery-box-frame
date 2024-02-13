import { NextRequest, NextResponse } from "next/server";
import { REDIRECT_LINK } from "../../../../lib/constants";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  return NextResponse.redirect(REDIRECT_LINK, { status: 302 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
