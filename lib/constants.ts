export const BASE_NFT_COLLECTION_ADDRESS =
  process.env.NODE_ENV === "production"
    ? "0xc52421dF5a3A1914Cb75CAFcFdAd66DC86570A2D"
    : "0xC0de81408E2F9c97f4d6f8Cae8EcB1823B23a536";

export const CHAIN =
  process.env.NODE_ENV === "production" ? "base" : "base-goerli";

export const BASE_URL = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
