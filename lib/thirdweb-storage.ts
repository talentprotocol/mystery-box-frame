import { ThirdwebStorage } from "@thirdweb-dev/storage";

const storage = new ThirdwebStorage({
  secretKey: process.env.SECRET_KEY,
});

export const uploadToIPFS = async (image: Buffer) => {
  const upload = await storage.upload(image);
  console.log(upload);
  return upload[0];
};
