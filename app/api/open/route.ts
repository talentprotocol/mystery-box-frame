import { NextRequest, NextResponse } from "next/server";
import {
  ALREADY_OPENED_RESPONSE,
  FOLLOW_RECAST_RESPONSE,
  OPENED_RESPONSE,
} from "../../../lib/frame-utils";
import {
  FrameActionPayload,
  getAddressForFid,
  getFrameMessage,
} from "frames.js";
import { validateFrameMessageWithNeynar } from "../../../lib/neynar";
import {
  TALENT_PROTOCOL_FARCASTER_CHANNEL_URL,
  TALENT_PROTOCOL_FARCASTER_PROFILE_URL,
} from "../../../lib/constants";
import { claimTalReward } from "../../../lib/talent-protocol-api";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameActionPayload = await req.json();
  const { valid: isValid, action } = await validateFrameMessageWithNeynar(
    body.trustedData.messageBytes
  );
  if (!isValid) {
    return NextResponse.json(null, { status: 400 });
  }
  const message = await getFrameMessage(body, {
    hubRequestOptions: {
      headers: { api_key: process.env.NEYNAR_API_KEY! },
    },
    fetchHubContext: true,
  });

  if (message.buttonIndex === 1) {
    // clicked "Recast and Follow to Open" or "Retry"
    if (!message.recastedCast || !message.requesterFollowsCaster) {
      return new NextResponse(FOLLOW_RECAST_RESPONSE);
    }

    const { wallet, amount } = await claimTalReward({
      trustedData: body.trustedData,
    });
    if (!amount) {
      return new NextResponse(ALREADY_OPENED_RESPONSE);
    }
    return new NextResponse(OPENED_RESPONSE(amount, wallet!));
  } else if (message.buttonIndex === 2) {
    // clicked "Follow /talent"
    return NextResponse.redirect(TALENT_PROTOCOL_FARCASTER_CHANNEL_URL, {
      status: 302,
    });
  } else if (message.buttonIndex === 3) {
    // clicked "Follow @talent"
    return NextResponse.redirect(TALENT_PROTOCOL_FARCASTER_PROFILE_URL, {
      status: 302,
    });
  }
  return NextResponse.json(null, { status: 400 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
