import { NextRequest, NextResponse } from "next/server";
import { FrameActionPayload, getFrameMessage } from "frames.js";
import {
  TALENT_PROTOCOL_BET_GOAL_URL,
  TALENT_PROTOCOL_PROFILE_URL,
  TALENT_PROTOCOL_SIGNUP_URL,
} from "../../../lib/constants";
import { validateFrameMessageWithAirstack } from "../../../lib/airstack";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameActionPayload = await req.json();
  const { isValid } = await validateFrameMessageWithAirstack(body);
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
    // clicked "Sign Up"
    return NextResponse.redirect(TALENT_PROTOCOL_SIGNUP_URL, {
      status: 302,
    });
  } else if (message.buttonIndex === 2) {
    // clicked "View My Tokens"
    // TODO: fetch correct address
    return NextResponse.redirect(TALENT_PROTOCOL_PROFILE_URL("0x"), {
      status: 302,
    });
  } else if (message.buttonIndex === 3) {
    // clicked "Bet on a Goal"
    return NextResponse.redirect(TALENT_PROTOCOL_BET_GOAL_URL, {
      status: 302,
    });
  }
  return NextResponse.json(null, { status: 400 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
