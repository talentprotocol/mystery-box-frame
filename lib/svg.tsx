import { join } from "path";
import satori from "satori";
import * as fs from "fs";

const fontPath = join(process.cwd(), "Inter-SemiBold.ttf");
let fontData = fs.readFileSync(fontPath);

const backgroundImagePath = join(process.cwd(), "public", "nft-base-img.jpg");
const backgroundImageData = fs.readFileSync(backgroundImagePath);
const backgroundImageBase64 = `data:image/jpeg;base64,${backgroundImageData.toString(
  "base64"
)}`;

export const generateImageSvg = async (
  fid: string,
  username: string
): Promise<string> => {
  return await satori(
    <div
      style={{
        backgroundImage: `url(${backgroundImageBase64})`,
        backgroundSize: "contain", // or 'contain' depending on your needs
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-around",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 24,
          display: "flex",
          bottom: 24,
          fontSize: "50px",
          fontFamily: "Inter-SemiBold", // use the font name here
          color: "#fff", // change this to the color you want for the text
          padding: "10px", // add some padding so the text isn't right against the edge
        }}
      >
        @{username}
      </div>
      <div
        style={{
          position: "absolute",
          right: 24,
          display: "flex",
          bottom: 24,
          fontSize: "50px",
          fontFamily: "Inter-SemiBold", // use the font name here
          color: "#fff", // change this to the color you want for the text
          padding: "10px", // add some padding so the text isn't right against the edge
        }}
      >
        FID {fid}
      </div>
    </div>,
    {
      width: 1024,
      height: 1024,
      fonts: [
        {
          data: fontData,
          name: "Inter-SemiBold.ttf",
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
};
