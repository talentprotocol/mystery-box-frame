import sharp from "sharp";
import { getCaptchaChallenge } from "../../../../lib/captcha";
import { NextResponse } from "next/server";
import { generateCaptchaImageSvg } from "../../../../lib/svg";

export const GET = async (req: Request, res: Response) => {
  const { searchParams } = new URL(req.url);
  const captchaId = searchParams.get("id");

  if (!captchaId) {
    return new NextResponse(null, { status: 404 });
  }

  const captcha = await getCaptchaChallenge(captchaId);

  if (!captcha) {
    return new NextResponse(null, { status: 404 });
  }
  const svg = await generateCaptchaImageSvg(captcha.numA, captcha.numB);

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
