import { ThirdwebStorage } from "@thirdweb-dev/storage";

const storage = new ThirdwebStorage({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export const uploadToIPFS = async (image: Buffer) => {
  const upload = await storage.upload(image);
  console.log(upload);
  return upload;
};
