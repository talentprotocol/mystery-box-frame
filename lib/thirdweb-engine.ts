import { Engine } from "@thirdweb-dev/engine";
import { CHAIN, NFT_COLLECTION_ADDRESS } from "./constants";
import { uploadToIPFS } from "./thirdweb-storage";

const engine = new Engine({
  url: process.env.THIRDWEB_ENGINE_URL!,
  accessToken: process.env.THIRDWEB_ACCESS_TOKEN!,
});

export const mintTo = async (
  address: string,
  profileName: string,
  image: Buffer
) => {
  const name = `${profileName} - Farcaster Horizon - OG`;
  const description = `Celebrate Farcaster's growth to 100K MAU with your personalized Farcaster Horizon OG NFT. Each NFT in the collection contains the unique FID and username of the minter.`;
  const ipfsUrl = await uploadToIPFS({
    image,
    name,
    description,
  });
  await engine.erc721.mintTo(
    // chain
    CHAIN.chainId.toString(),
    // contract address
    NFT_COLLECTION_ADDRESS,
    // backend wallet address
    process.env.THIRDWEB_ENGINE_WALLET!,
    // args matching the API reference
    {
      receiver: address,
      metadata: ipfsUrl,
    }
  );
};

export const getTotalSupply = async () => {
  return await engine.erc721.totalCount(
    CHAIN.chainId.toString(),
    NFT_COLLECTION_ADDRESS
  );
};

export const getBalanceOf = async (address: string) => {
  return await engine.erc721.balanceOf(
    address,
    CHAIN.chainId.toString(),
    NFT_COLLECTION_ADDRESS
  );
};
