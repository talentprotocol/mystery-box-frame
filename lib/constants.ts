import { Sepolia, Base } from "@thirdweb-dev/chains";

export const BASE_NFT_COLLECTION_ADDRESS =
  process.env.NODE_ENV === "production"
    ? "0x2a5cda192582889AB11A08e9C39e82F579816E7f"
    : "0xb5e17d0BC5446a8a75cC3A16706e71137b8A2809";

export const CHAIN = process.env.NODE_ENV === "production" ? Base : Sepolia;

export const BASE_URL = process.env.NEXT_PUBLIC_HOST || "http://localhost:3001";
export const ERROR_IMAGE_URL = `${BASE_URL}/error-img.jpg`;
export const SUCCESS_IMAGE_URL = `${BASE_URL}/success-img.jpg`;
