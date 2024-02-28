import { NextRequest, NextResponse } from "next/server";
import { generateCaptchaChallenge } from "../../../lib/captcha";
import {
  START_RESPONSE,
  SUCCESS_RESPONSE,
  TRY_AGAIN_RESPONSE,
} from "../../../lib/frame-utils";
import { FrameActionPayload, getAddressForFid } from "frames.js";
import { validateFrameMessageWithNeynar } from "../../../lib/neynar";
import { checkNFTBalance } from "../../../lib/collection-contract-checks";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  try {
    const body: FrameActionPayload = await req.json();
    const { valid: isValid, action } = await validateFrameMessageWithNeynar(
      body.trustedData.messageBytes
    );
    if (!isValid) {
      return new NextResponse(TRY_AGAIN_RESPONSE);
    }
    const accountAddress = await getAddressForFid({
      fid: action?.interactor.fid!,
      options: {
        fallbackToCustodyAddress: true,
        hubRequestOptions: {
          headers: { api_key: process.env.NEYNAR_API_KEY! },
        },
      },
    });
    const alreadyMinted = await checkNFTBalance(accountAddress);
    if (alreadyMinted) {
      return new NextResponse(SUCCESS_RESPONSE({ address: accountAddress }));
    }
  } catch (error) {
    console.error("Error while validating frame message with Neynar:", error);
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }

  const captchaId = await generateCaptchaChallenge();
  return new NextResponse(START_RESPONSE(captchaId));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
