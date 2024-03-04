import { getFrameHtml } from "frames.js";
import { BASE_URL } from "./constants";

export const FOLLOW_RECAST_RESPONSE = getFrameHtml({
  version: "vNext",
  image: `${BASE_URL}/follow-recast.jpg`,
  imageAspectRatio: "1:1",
  buttons: [
    { label: "Retry", action: "post" },
    {
      label: "Follow /talent",
      action: "post_redirect",
    },
    { label: "Follow @talent", action: "post_redirect" },
  ],
  postUrl: `${BASE_URL}/api/open`,
});

export const ALREADY_OPENED_RESPONSE = getFrameHtml({
  version: "vNext",
  image: `${BASE_URL}/already-opened.jpg`,
  imageAspectRatio: "1:1",
  buttons: [
    { label: "Sign Up", action: "post_redirect" },
    {
      label: "View My Tokens",
      action: "post_redirect",
    },
    {
      label: "Bet on a Goal",
      action: "post_redirect",
    },
  ],
  postUrl: `${BASE_URL}/api/opened`,
});

export const OPENED_RESPONSE = (amount: number, address: string) =>
  getFrameHtml({
    version: "vNext",
    image: `${BASE_URL}/api/opened/image?amount=${amount}&address=${address}`,
    imageAspectRatio: "1:1",
    buttons: [
      { label: "Sign Up", action: "post_redirect" },
      {
        label: "View My Tokens",
        action: "post_redirect",
      },
      {
        label: "Bet on a Goal",
        action: "post_redirect",
      },
    ],
    postUrl: `${BASE_URL}/api/opened`,
  });
