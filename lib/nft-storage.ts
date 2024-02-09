import { NFTStorage } from "nft.storage";

export const storeNFT = async (
  image: Buffer,
  name: string,
  description: string
): Promise<string> => {
  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({
    token: process.env.NFT_STORAGE_API_KEY!,
  });

  // call client.store, passing in the image & metadata
  const result = await nftstorage.store({
    image: new Blob([image], { type: "image/png" }),
    name,
    description,
  });
  console.log(result);
  return result.url;
};
