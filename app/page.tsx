import {
  FrameButton,
  FrameContainer,
  FrameImage,
  NextServerPageProps,
  getPreviousFrame,
  getFrameMessage,
} from "frames.js/next/server";
import Link from "next/link";
import { BASE_URL, COVER_IMAGE_URL, REDIRECT_LINK } from "../lib/constants";

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
  return (
    <div className="p-4">
      Farcaster Frames Frenzy 2024 - Explore on{" "}
      <Link href={REDIRECT_LINK}>Airstack</Link>
    </div>
  );
}
