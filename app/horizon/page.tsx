import {
  FrameButton,
  FrameContainer,
  FrameImage,
  NextServerPageProps,
  getPreviousFrame,
  getFrameMessage,
} from "frames.js/next/server";
import Link from "next/link";
import { BASE_URL, COVER_IMAGE_URL, REDIRECT_LINK } from "../../lib/constants";

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubRequestOptions: {
      headers: { api_key: process.env.NEYNAR_API_KEY! },
    },
    fetchHubContext: true,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  // Here: do a server side side effect either sync or async (using await), such as minting an NFT if you want.
  // example: load the users credentials & check they have an NFT

  // then, when done, return next frame
  return (
    <div className="p-4">
      Farcaster Frames Frenzy 2024 - Explore on{" "}
      <Link href={REDIRECT_LINK}>Airstack</Link>
      {process.env.NODE_ENV !== "production" && (
        <Link href={`/debug?url=${BASE_URL}`} className="underline">
          Debug
        </Link>
      )}
      <FrameContainer
        pathname={`${BASE_URL}/api/captcha`}
        postUrl={`${BASE_URL}/api/captcha`}
        state={null}
        previousFrame={previousFrame}
      >
        <FrameImage src={COVER_IMAGE_URL} />
        <FrameButton>Mint your Custom OG NFT!</FrameButton>
      </FrameContainer>
    </div>
  );
}
