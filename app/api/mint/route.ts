import { NextRequest, NextResponse } from "next/server";
import { FrameActionPayload } from "frames.js";
import { isUserEligible } from "../../../lib/mint-gating";
import { validateFrameMessageWithNeynar } from "../../../lib/neynar";
import {
  NOT_ELIGIBLE_RESPONSE,
  SOLD_OUT_RESPONSE,
  SUCCESS_RESPONSE,
  TRY_AGAIN_RESPONSE,
} from "../../../lib/frame-utils";
import {
  deleteCaptchaChallenge,
  validateCaptchaChallenge,
} from "../../../lib/captcha";
import { SUPPLY_LIMIT } from "../../../lib/constants";
import { mintTokens } from "../../../lib/syndicate-mint";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined;
  const { searchParams } = new URL(req.url);
  const captchaId = searchParams.get("id");
  const result = searchParams.get("result");

  if (!captchaId || !result) {
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }
  const isCaptchaValid = await validateCaptchaChallenge(
    captchaId,
    parseInt(result)
  );
  if (!isCaptchaValid) {
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }
  await deleteCaptchaChallenge(captchaId);
  try {
    const body: FrameActionPayload = await req.json();
    const { valid: isValid, action } = await validateFrameMessageWithNeynar(
      body.trustedData.messageBytes
    );
    if (!isValid) {
      return new NextResponse(TRY_AGAIN_RESPONSE);
    }

    const isEligible = await isUserEligible(action?.interactor.username!);
    console.log(isEligible);

    if (!isEligible) {
      console.error(`${accountAddress} is not eligible`);
      return new NextResponse(NOT_ELIGIBLE_RESPONSE);
    }

    // TODO: check total supply and balance with syndicate api
    const totalSupply = 10000;
    const balance = 0;
    if (totalSupply >= SUPPLY_LIMIT) {
      console.error("Sold out");
      return new NextResponse(SOLD_OUT_RESPONSE);
    }

    if (balance > 0) {
      console.error("Already minted");
      return new NextResponse(SUCCESS_RESPONSE);
    }

    console.time("minting");
    /*await mintTokens(
      body.trustedData.messageBytes,
      accountAddress!,
      action?.interactor.fid!
    );*/
    console.timeEnd("minting");

    return new NextResponse(SUCCESS_RESPONSE);
  } catch (e) {
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
