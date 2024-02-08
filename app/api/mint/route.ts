import { NextRequest, NextResponse } from "next/server";
import {
  FrameActionPayload,
  getAddressForFid,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";
import { alreadyClaimed, claimNFT } from "../../../lib/thirdweb";
import { BASE_URL } from "../../../lib/constants";
import { setClaimed } from "../../../lib/redis";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameActionPayload = await req.json();
  const { isValid, message } = await validateFrameMessage(body);
  if (!isValid) {
    return new NextResponse("Invalid message", { status: 400 });
  }
  const accountAddress = await getAddressForFid({
    fid: body.untrustedData.fid,
    options: { fallbackToCustodyAddress: true },
  });

  const frameMessage = await getFrameMessage(body);
  const fid = frameMessage.requesterFid;
  const username = frameMessage.requesterUserData?.username;
  const didClaim = await alreadyClaimed(accountAddress);
  if (didClaim) {
    console.log("already claimed", accountAddress);
    return new NextResponse(
      getFrameHtml({
        version: "vNext",
        image: SUCCESS_IMAGE_URL,
        postUrl: `${BASE_URL}/nothing`,
      })
    );
  }

  console.log("claiming", accountAddress);
  await claimNFT(accountAddress!, username!, image);
  await setClaimed(accountAddress);
  console.log("claimed", accountAddress);
  return new NextResponse(
    getFrameHtml({
      version: "vNext",
      image: SUCCESS_IMAGE_URL,
      buttons: [{ label: "View Your NFT", action: "post_redirect" }],
      postUrl: `link.airstack.xyz/frenzy`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
