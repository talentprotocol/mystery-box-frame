import { ThirdwebStorage } from "@thirdweb-dev/storage";

const storage = new ThirdwebStorage({
  secretKey: process.env.SECRET_KEY,
});

export const uploadToIPFS = async (image: Buffer) => {
  const upload = await storage.upload(new Blob([image], { type: "image/png" }));
  console.log(upload);
  return upload;
};
