import { NextRequest, NextResponse } from "next/server";
import {
  FrameActionPayload,
  getAddressForFid,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";
import {
  BASE_URL,
  ERROR_IMAGE_URL,
  SUCCESS_IMAGE_URL,
} from "../../../lib/constants";
import { ClaimStatus, hasClaimed, setClaimStatus } from "../../../lib/redis";
import { generateImageSvg } from "../../../lib/svg";
import sharp from "sharp";
import { getBalanceOf, mintTo } from "../../../lib/thirdweb-engine";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined;
  try {
    const body: FrameActionPayload = await req.json();
    const { isValid } = await validateFrameMessage(body);
    if (!isValid) {
      return new NextResponse(
        getFrameHtml({
          version: "vNext",
          image: ERROR_IMAGE_URL,
          buttons: [{ label: "Try Again", action: "post" }],
          postUrl: `${BASE_URL}/api/mint`,
        })
      );
    }
    accountAddress = await getAddressForFid({
      fid: body.untrustedData.fid,
      options: { fallbackToCustodyAddress: true },
    });

    const frameMessage = await getFrameMessage(body);
    const fid = frameMessage.requesterFid;
    const username = frameMessage.requesterUserData?.username;
    // const didClaim = await hasClaimed(accountAddress!);
    console.log("getting balance of...");
    const accountBalance = await getBalanceOf(accountAddress!);
    if (parseInt(accountBalance.result!) > 0 && false) {
      console.log("already claimed", accountAddress);
      return new NextResponse(
        getFrameHtml({
          version: "vNext",
          image: SUCCESS_IMAGE_URL,
          postUrl: `${BASE_URL}/nothing`,
        })
      );
    }

    await setClaimStatus(accountAddress!, ClaimStatus.PENDING);

    const svg = await generateImageSvg(fid.toString(), username!);
    const image = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    console.log("claiming", accountAddress);
    await mintTo(accountAddress!, username!, image);
    await setClaimStatus(accountAddress!, ClaimStatus.CLAIMED);
    console.log("claimed", accountAddress);

    return new NextResponse(
      getFrameHtml({
        version: "vNext",
        image: SUCCESS_IMAGE_URL,
        buttons: [{ label: "View Your NFT", action: "post_redirect" }],
        postUrl: `https://link.airstack.xyz/frenzy`,
      })
    );
  } catch (e) {
    console.error(e);
    await setClaimStatus(accountAddress!, ClaimStatus.UNCLAIMED);
    return new NextResponse(
      getFrameHtml({
        version: "vNext",
        image: ERROR_IMAGE_URL,
        buttons: [{ label: "Try Again", action: "post" }],
        postUrl: `${BASE_URL}/api/mint`,
      })
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
