export const BASE_URL = process.env.BASE_URL
  ? process.env.BASE_URL
  : "http://localhost:3001";

export const COVER_IMAGE_URL = `${BASE_URL}/cover.jpg`;
export const ALREADY_OPENED_IMAGE_URL = `${BASE_URL}/already-opened.jpg`;
export const OPENED_IMAGE_URL = `${BASE_URL}/opened.jpg`;
export const RECAST_FOLLOW_IMAGE_URL = `${BASE_URL}/recast-follow.jpg`;

export const TALENT_PROTOCOL_FARCASTER_CHANNEL_URL =
  "https://warpcast.com/~/channel/talent";
export const TALENT_PROTOCOL_FARCASTER_PROFILE_URL =
  "https://warpcast.com/talent";
export const TALENT_PROTOCOL_SIGNUP_URL =
  "https://beta.talentprotocol.com/join/welcome";
export const TALENT_PROTOCOL_PROFILE_URL = (address: string) =>
  `https://beta.talentprotocol.com/${address}`;
export const TALENT_PROTOCOL_BET_GOAL_URL =
  "https://beta.talentprotocol.com/home";

export const TALENT_PROTOCOL_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.talentprotocol.com"
    : "https://dev.talentprotocol.com";
export const TALENT_PROTOCOL_API_KEY =
  process.env.NODE_ENV === "production"
    ? process.env.TALENT_PROTOCOL_API_KEY_PROD
    : process.env.TALENT_PROTOCOL_API_KEY_DEV;
