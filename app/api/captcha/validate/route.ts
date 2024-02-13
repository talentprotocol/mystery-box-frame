import { NextRequest, NextResponse } from "next/server";
import { FrameActionPayload, getFrameHtml } from "frames.js";
import {
  BASE_URL,
  ERROR_IMAGE_URL,
  LETS_GO_IMAGE_URL,
} from "../../../../lib/constants";
import { validateCaptchaChallenge } from "../../../../lib/captcha";
import {
  INVALID_CAPTCHA_RESPONSE,
  REQUEST_MINT_RESPONSE,
  TRY_AGAIN_RESPONSE,
  WAVE_1_COMPLETED_RESPONSE,
} from "../../../../lib/frame-utils";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const captchaId = searchParams.get("id");

  if (!captchaId) {
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }

  const body: FrameActionPayload = await req.json();

  const inputText = body.untrustedData.inputText;

  if (!inputText) {
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }

  const isValid = await validateCaptchaChallenge(
    captchaId,
    parseInt(inputText)
  );

  if (!isValid) {
    console.error("Invalid captcha", { captchaId, inputText });
    return new NextResponse(INVALID_CAPTCHA_RESPONSE);
  }

  //return new NextResponse(REQUEST_MINT_RESPONSE(captchaId, inputText));
  return new NextResponse(WAVE_1_COMPLETED_RESPONSE);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
