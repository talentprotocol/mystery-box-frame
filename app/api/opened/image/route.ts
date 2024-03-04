import sharp from "sharp";
import { NextResponse } from "next/server";
import { generateImageSvg } from "../../../../lib/svg";

export const GET = async (req: Request, res: Response) => {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get("amount");
  const address = searchParams.get("address");

  if (!amount || !address) {
    console.error("Missing amount or address");
    return new NextResponse(null, { status: 404 });
  }

  console.log(amount, address);

  const svg = await generateImageSvg(amount, address);

  // Convert SVG to PNG using Sharp
  const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

  // Set the content type to PNG and send the response
  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "max-age=10",
    },
  });
};

export const dynamic = "force-dynamic";
