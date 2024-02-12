import { NextRequest, NextResponse } from "next/server";
import { generateCaptchaChallenge } from "../../../lib/captcha";
import { START_RESPONSE } from "../../../lib/frame-utils";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const captchaId = await generateCaptchaChallenge();
  return new NextResponse(START_RESPONSE(captchaId));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
