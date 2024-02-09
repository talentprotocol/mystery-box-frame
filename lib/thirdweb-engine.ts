import { Engine } from "@thirdweb-dev/engine";
import { CHAIN, NFT_COLLECTION_ADDRESS } from "./constants";
import { storeNFT } from "./nft-storage";

const engine = new Engine({
  url: process.env.THIRDWEB_ENGINE_URL!,
  accessToken: process.env.THIRDWEB_ACCESS_TOKEN!,
});

export const mintTo = async (
  address: string,
  profileName: string,
  image: Buffer
) => {
  const name = `${profileName} - Farcaster Frames Frenzy 2024 - OG`;
  const description = `A collection of commemorative NFTs honoring the Farcasters who were there when Farcaster first blew up big during Farcaster Frames Frenzy, Jan-Feb 2024`;
  console.log("storing nft");
  const ipfsUrl = await storeNFT(image, name, description);
  console.log("nft stored");
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
      metadata: {
        image: ipfsUrl,
        name,
        description,
      },
    }
  );
};

export const getBalanceOf = async (address: string) => {
  return await engine.erc721.balanceOf(
    address,
    CHAIN.chainId.toString(),
    NFT_COLLECTION_ADDRESS
  );
};
