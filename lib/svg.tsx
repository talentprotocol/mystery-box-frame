import { join } from "path";
import satori from "satori";
import * as fs from "fs";

const interFontPath = join(process.cwd(), "Inter-SemiBold.ttf");
let interFontData = fs.readFileSync(interFontPath);

const captchaImagePath = join(process.cwd(), "public", "captcha.png");
const captchaImageData = fs.readFileSync(captchaImagePath);
const captchaImageBase64 = `data:image/png;base64,${captchaImageData.toString(
  "base64"
)}`;

export const generateCaptchaImageSvg = async (
  numA: number,
  numB: number
): Promise<string> => {
  return await satori(
    <div
      style={{
        backgroundImage: `url(${captchaImageBase64})`,
        backgroundSize: "contain", // or 'contain' depending on your needs
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFF",
          position: "absolute",
          left: 540,
          display: "flex",
          bottom: 240,
          fontSize: "96px",
          borderRadius: "8px",
          fontFamily: "Inter-SemiBold", // use the font name here
          color: "#0B6EF9", // change this to the color you want for the text
          paddingTop: "20px",
          paddingBottom: "20px",
          paddingRight: "80px",
          paddingLeft: "80px",
        }}
      >
        {numA} + {numB}
      </div>
    </div>,
    {
      width: 2400,
      height: 1260,
      fonts: [
        {
          data: interFontData,
          name: "Inter-SemiBold",
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
};
