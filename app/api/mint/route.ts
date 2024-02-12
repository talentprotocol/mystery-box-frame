import { NextRequest, NextResponse } from "next/server";
import { FrameActionPayload, getAddressForFid, getFrameHtml } from "frames.js";
import { SUPPLY_LIMIT } from "../../../lib/constants";
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
import { fetchNftTokenBalance } from "../../../lib/airstack/token-balance";

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

    console.time("getAddressFromFid");
    accountAddress = await getAddressForFid({
      fid: action?.interactor.fid!,
      options: {
        fallbackToCustodyAddress: true,
        hubRequestOptions: {
          headers: { api_key: process.env.NEYNAR_API_KEY! },
        },
      },
    });
    console.timeEnd("getAddressFromFid");

    console.time("isAddressEligible");
    const { farcasterProfile, isEligible } = await isAddressEligible(
      accountAddress!
    );
    console.timeEnd("isAddressEligible");

    if (!isEligible) {
      console.error(`${accountAddress} is not eligible`);
      return new NextResponse(NOT_ELIGIBLE_RESPONSE);
    }

    const { userId: fid, profileHandle: username } = farcasterProfile!;

    console.time("supply and balance checks");
    const { balance, totalSupply } = await fetchNftTokenBalance(
      `fc_fid:${fid}`,
      process.env.NFT_CONTRACT_ADDRESS!
    );
    console.timeEnd("supply and balance checks");
    if (parseInt(totalSupply as string) >= SUPPLY_LIMIT) {
      console.error("Sold out");
      return new NextResponse(SOLD_OUT_RESPONSE);
    }

    if (parseInt(balance as string) > 0) {
      console.error("Already minted");
      return new NextResponse(SUCCESS_RESPONSE);
    }

    const svg = await generateImageSvg(fid!.toString(), username!);
    const image = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    console.time("mintTo");
    await mintTo(accountAddress!, username!, image);
    console.timeEnd("mintTo");

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
