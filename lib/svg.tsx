import { join } from "path";
import satori from "satori";
import * as fs from "fs";

const monaRegularFontPath = join(process.cwd(), "Mona-Sans-Regular.ttf");
let monaRegularFontData = fs.readFileSync(monaRegularFontPath);

const monaExtraBoldFontPath = join(process.cwd(), "Mona-Sans-ExtraBold.ttf");
let monaExtraBoldFontData = fs.readFileSync(monaExtraBoldFontPath);

const imagePath = join(process.cwd(), "public", "opened.jpg");
const imageData = fs.readFileSync(imagePath);
const imageBase64 = `data:image/jpeg;base64,${imageData.toString("base64")}`;

export const generateImageSvg = async (
  amount: string,
  address: string
): Promise<string> => {
  return await satori(
    <div
      style={{
        backgroundImage: `url(${imageBase64})`,
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
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          marginTop: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "136px",
          fontFamily: "Mona-ExtraBold", // use the font name here
          color: "#FFF", // change this to the color you want for the text
        }}
      >
        {amount} $TAL
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px",
          fontFamily: "Mona-Regular", // use the font name here
          color: "#D6D6D6", // change this to the color you want for the text
        }}
      >
        {address}
      </div>
    </div>,
    {
      width: 1200,
      height: 1200,
      fonts: [
        {
          data: monaExtraBoldFontData,
          name: "Mona-Extrabold",
        },
        {
          data: monaRegularFontData,
          name: "Mona-Regular",
        },
      ],
    }
  );
};
