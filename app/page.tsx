import {
  FrameButton,
  FrameContainer,
  FrameImage,
  NextServerPageProps,
  getPreviousFrame,
  getFrameMessage,
} from "frames.js/next/server";
import Link from "next/link";

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: "https://nemes.farcaster.xyz:2281",
    fetchHubContext: true,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  // Here: do a server side side effect either sync or async (using await), such as minting an NFT if you want.
  // example: load the users credentials & check they have an NFT

  const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:3001";

  // then, when done, return next frame
  return (
    <div className="p-4">
      Farcaster Frames Frenzy 2024
      <Link href={`/debug?url=${baseUrl}`} className="underline">
        Debug
      </Link>
      <FrameContainer
        pathname="/api/mint"
        postUrl={`${baseUrl}/api/mint`}
        state={null}
        previousFrame={previousFrame}
      >
        <FrameImage src={`${baseUrl}/base-img.jpg`} />
        <FrameButton>Mint your Custom OG NFT</FrameButton>
      </FrameContainer>
    </div>
  );
}
