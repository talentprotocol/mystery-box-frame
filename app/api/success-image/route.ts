import sharp from "sharp";
import { generateImageSvg } from "../../../lib/svg";

export const GET = async (req: Request, res: Response) => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") ?? undefined;
  const fid = searchParams.get("fid") ?? undefined;

  const svg = await generateImageSvg(fid!, username!);

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
