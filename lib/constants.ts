import { Sepolia, Base } from "@thirdweb-dev/chains";

export const NFT_COLLECTION_ADDRESS =
  process.env.NODE_ENV === "production"
    ? "0x97927D9b00e870A69D165858E2CeC9FeE3A83471"
    : "0xb5e17d0BC5446a8a75cC3A16706e71137b8A2809";

export const CHAIN = process.env.NODE_ENV === "production" ? Base : Sepolia;

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://frenzy.airstack.xyz"
    : "http://localhost:3001";
export const ERROR_IMAGE_URL = `${BASE_URL}/error-img.png`;
export const SUCCESS_IMAGE_URL = `${BASE_URL}/success-img.jpg`;
