import { NextRequest, NextResponse } from "next/server";
import { FrameActionPayload } from "frames.js";
import { START_RESPONSE, TRY_AGAIN_RESPONSE } from "../../../lib/frame-utils";
import { validateFrameMessageWithNeynar } from "../../../lib/neynar";
import { BUILDERFI_APP_URL } from "../../../lib/constants";
import { generateCaptchaChallenge } from "../../../lib/captcha";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameActionPayload = await req.json();
  const { valid: isValid, action } = await validateFrameMessageWithNeynar(
    body.trustedData.messageBytes
  );
  if (!isValid) {
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }
  if ((action as any)?.tapped_button.index === 1) {
    return NextResponse.redirect(BUILDERFI_APP_URL, { status: 302 });
  }
  const captchaId = await generateCaptchaChallenge();
  return new NextResponse(START_RESPONSE(captchaId));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
