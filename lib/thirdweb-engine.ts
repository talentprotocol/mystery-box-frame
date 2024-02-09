import { Engine } from "@thirdweb-dev/engine";
import { CHAIN, NFT_COLLECTION_ADDRESS } from "./constants";

const engine = new Engine({
  url: process.env.THIRDWEB_ENGINE_URL!,
  accessToken: process.env.THIRDWEB_ACCESS_TOKEN!,
});

export const mintTo = async (
  address: string,
  profileName: string,
  image: Buffer
) => {
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
        image: "IPFS_URI_HERE",
        name: `${profileName} - Farcaster Frames Frenzy 2024 - OG`,
        description: `A collection of commemorative NFTs honoring the Farcasters who were there when Farcaster first blew up big during Farcaster Frames Frenzy, Jan-Feb 2024`,
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
