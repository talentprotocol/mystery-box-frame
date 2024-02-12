import { BaseSepoliaTestnet, Base } from "@thirdweb-dev/chains";

export const NFT_COLLECTION_ADDRESS =
  process.env.NODE_ENV === "production"
    ? "0x4c17fF12D9A925A0DeC822a8cBF06F46c626855c"
    : "0x51eF9B78658Dd74512AE834C49Edc6a6f8CD245c";

export const CHAIN =
  process.env.NODE_ENV === "production" ? Base : BaseSepoliaTestnet;

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://frames.airstack.xyz"
    : "http://localhost:3001";

export const COVER_IMAGE_URL = `${BASE_URL}/cover.png`;
export const ERROR_IMAGE_URL = `${BASE_URL}/error.png`;
export const SUCCESS_IMAGE_URL = `${BASE_URL}/success.png`;
export const SOLD_OUT_IMAGE_URL = `${BASE_URL}/sold-out.png`;
export const NOT_ELIGIBLE_IMAGE_URL = `${BASE_URL}/not-eligible.png`;
export const CAPTCHA_IMAGE_URL = `${BASE_URL}/captcha.png`;
export const LETS_GO_IMAGE_URL = `${BASE_URL}/lets-go.png`;

export const REDIRECT_LINK = "https://link.airstack.xyz/horizon";

export const SUPPLY_LIMIT = 10000;
export const MINTING_ELIGIBILITY_CRITERIA = {
  farcasterFollowersThreshold: 200,
  virtualPoapsThreshold: 1,
};
