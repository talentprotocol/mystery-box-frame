import { NextRequest, NextResponse } from "next/server";
import {
  FrameActionPayload,
  getAddressForFid,
  getFrameHtml,
  validateFrameMessage,
} from "frames.js";
import {
  BASE_URL,
  ERROR_IMAGE_URL,
  NOT_ELIGIBLE_IMAGE_URL,
  SOLD_OUT_IMAGE_URL,
  SUCCESS_IMAGE_URL,
  SUPPLY_LIMIT,
} from "../../../lib/constants";
import { ClaimStatus, hasClaimed, setClaimStatus } from "../../../lib/redis";
import { generateImageSvg } from "../../../lib/svg";
import sharp from "sharp";
import {
  getBalanceOf,
  getTotalSupply,
  mintTo,
} from "../../../lib/thirdweb-engine";
import { isAddressEligible } from "../../../lib/mint-gating";
import { validateFrameMessageWithNeynar } from "../../../lib/neynar";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined;
  try {
    const body: FrameActionPayload = await req.json();
    const { valid: isValid } = await validateFrameMessageWithNeynar(
      body.trustedData.messageBytes
    );
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

    /*const frameMessage = await getFrameMessage(body);
    const fid = frameMessage.requesterFid;
    const username = frameMessage.requesterUserData?.username;
    console.log({ fid, username });*/
    const { farcasterProfile, isEligible } = await isAddressEligible(
      accountAddress!
    );

    console.log({ farcasterProfile, isEligible });

    if (!isEligible) {
      return new NextResponse(
        getFrameHtml({
          version: "vNext",
          image: NOT_ELIGIBLE_IMAGE_URL,
          buttons: [
            {
              label: "View the Farcaster Frenzy OG’s",
              action: "post_redirect",
            },
          ],
          postUrl: `https://link.airstack.xyz/frenzy`,
        })
      );
    }

    const { userId: fid, profileHandle: username } = farcasterProfile!;

    const totalSupply = await getTotalSupply();
    if (parseInt(totalSupply.result!) >= SUPPLY_LIMIT) {
      return new NextResponse(
        getFrameHtml({
          version: "vNext",
          image: SOLD_OUT_IMAGE_URL,
          buttons: [
            {
              label: "View the Farcaster Frenzy OG’s",
              action: "post_redirect",
            },
          ],
          postUrl: `https://link.airstack.xyz/frenzy`,
        })
      );
    }
    const accountBalance = await getBalanceOf(accountAddress!);
    if (parseInt(accountBalance.result!) > 0) {
      console.log("already claimed", accountAddress);
      return new NextResponse(
        getFrameHtml({
          version: "vNext",
          image: SUCCESS_IMAGE_URL,
          buttons: [{ label: "View Your NFT", action: "post_redirect" }],
          postUrl: `https://link.airstack.xyz/frenzy`,
        })
      );
    }

    await setClaimStatus(accountAddress!, ClaimStatus.PENDING);

    const svg = await generateImageSvg(fid!.toString(), username!);
    const image = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    await mintTo(accountAddress!, username!, image);
    await setClaimStatus(accountAddress!, ClaimStatus.CLAIMED);

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
