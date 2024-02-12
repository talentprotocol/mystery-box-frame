import { ThirdwebStorage } from "@thirdweb-dev/storage";

const storage = new ThirdwebStorage({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export const uploadToIPFS = async (data: {
  image: Buffer;
  name: string;
  description: string;
}) => {
  const upload = await storage.upload(data);
  console.log(upload);
  return upload;
};
