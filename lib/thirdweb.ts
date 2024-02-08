import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BASE_NFT_COLLECTION_ADDRESS, CHAIN } from "../lib/constants";

export const claimNFT = async (
  toAddress: string,
  profileName: string,
  image: Buffer
) => {
  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY!, CHAIN, {
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });
  console.log("minting to", toAddress);

  const contract = await sdk.getContract<"nft-collection">(
    BASE_NFT_COLLECTION_ADDRESS,
    "nft-collection"
  );

  await contract.mintTo(toAddress, {
    image,
    name: `${profileName} - Farcaster Frames Frenzy 2024 - OG`,
    external_url: `https://warpcast.com/limone.eth`,
    description: `A collection of commemorative NFTs honoring the Farcasters who were there when Farcaster first blew up big during Farcaster Frames Frenzy, Jan-Feb 2024`,
  });
};

export const alreadyClaimed = async (address: string) => {
  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY!, CHAIN, {
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });
  const contract = await sdk.getContract(
    BASE_NFT_COLLECTION_ADDRESS,
    "nft-collection"
  );
  const balance = await contract.balanceOf(address);
  return balance.toNumber() > 0;
};
