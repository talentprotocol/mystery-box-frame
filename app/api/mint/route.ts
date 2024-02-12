import { NextRequest, NextResponse } from "next/server";
import { FrameActionPayload, getAddressForFid, getFrameHtml } from "frames.js";
import {
  BASE_URL,
  ERROR_IMAGE_URL,
  NOT_ELIGIBLE_IMAGE_URL,
  REDIRECT_LINK,
  SOLD_OUT_IMAGE_URL,
  SUCCESS_IMAGE_URL,
  SUPPLY_LIMIT,
} from "../../../lib/constants";
import { generateImageSvg } from "../../../lib/svg";
import sharp from "sharp";
import {
  getBalanceOf,
  getTotalSupply,
  mintTo,
} from "../../../lib/thirdweb-engine";
import { isAddressEligible } from "../../../lib/mint-gating";
import { validateFrameMessageWithNeynar } from "../../../lib/neynar";
import {
  NOT_ELIGIBLE_RESPONSE,
  SOLD_OUT_RESPONSE,
  SUCCESS_RESPONSE,
  TRY_AGAIN_RESPONSE,
} from "../../../lib/frame-utils";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined;
  try {
    const body: FrameActionPayload = await req.json();
    const { valid: isValid, action } = await validateFrameMessageWithNeynar(
      body.trustedData.messageBytes
    );
    if (!isValid) {
      return new NextResponse(TRY_AGAIN_RESPONSE);
    }

    accountAddress = await getAddressForFid({
      fid: action?.interactor.fid!,
      options: {
        fallbackToCustodyAddress: true,
        hubRequestOptions: {
          headers: { api_key: process.env.NEYNAR_API_KEY! },
        },
      },
    });

    const { farcasterProfile, isEligible } = await isAddressEligible(
      accountAddress!
    );

    if (!isEligible) {
      console.error(`${accountAddress} is not eligible`);
      return new NextResponse(NOT_ELIGIBLE_RESPONSE);
    }

    const { userId: fid, profileHandle: username } = farcasterProfile!;

    const totalSupply = await getTotalSupply();
    if (parseInt(totalSupply.result!) >= SUPPLY_LIMIT) {
      return new NextResponse(SOLD_OUT_RESPONSE);
    }
    const accountBalance = await getBalanceOf(accountAddress!);
    if (parseInt(accountBalance.result!) > 0) {
      return new NextResponse(SUCCESS_RESPONSE);
    }

    const svg = await generateImageSvg(fid!.toString(), username!);
    const image = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    await mintTo(accountAddress!, username!, image);

    return new NextResponse(SUCCESS_RESPONSE);
  } catch (e) {
    console.error(e);
    return new NextResponse(TRY_AGAIN_RESPONSE);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
