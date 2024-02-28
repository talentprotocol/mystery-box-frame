import { NextRequest, NextResponse } from "next/server";
import { FrameActionPayload, getAddressForFid } from "frames.js";
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
import { getTxHash, mintTokens } from "../../../lib/syndicate-mint";
import { checkNFTTotalSupply } from "../../../lib/collection-contract-checks";

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

    const fid = action?.interactor.fid!;
    const isEligible = await isUserEligible(action?.interactor.username!);
    console.log(fid, "is eligible?", isEligible);

    if (!isEligible) {
      console.error(`${action?.interactor.username} is not eligible`);
      return new NextResponse(NOT_ELIGIBLE_RESPONSE);
    }

    const isSoldOut = await checkNFTTotalSupply();
    console.log(fid, "is sold out?", isSoldOut);
    if (isSoldOut) {
      console.error("Sold out");
      return new NextResponse(SOLD_OUT_RESPONSE);
    }

    accountAddress = await getAddressForFid({
      fid,
      options: {
        fallbackToCustodyAddress: true,
        hubRequestOptions: {
          headers: { api_key: process.env.NEYNAR_API_KEY! },
        },
      },
    });

    console.log(fid, "account address", accountAddress);

    console.time("minting");
    const txData = await mintTokens(
      body.trustedData.messageBytes,
      accountAddress!,
      action?.interactor.fid!
    );
    console.timeEnd("minting");

    console.log(fid, "minted successfully", txData.transactionId);

    const txHash = await getTxHash(txData.transactionId);

    console.log(fid, "txHash", txHash);

    return new NextResponse(SUCCESS_RESPONSE({ transactionHash: txHash }));
  } catch (e) {
    console.error(e);
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
