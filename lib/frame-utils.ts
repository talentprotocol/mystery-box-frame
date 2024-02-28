import { getFrameHtml } from "frames.js";
import {
  BASE_URL,
  ERROR_IMAGE_URL,
  INVALID_CAPTCHA_IMAGE_URL,
  LETS_GO_IMAGE_URL,
  SIGN_UP_BF_IMAGE_URL,
  SOLD_OUT_IMAGE_URL,
  SUCCESS_IMAGE_URL,
  EXPLORER_TX_LINK,
  BUILDERFI_APP_URL,
} from "./constants";

export const START_RESPONSE = (captchaId: string) =>
  getFrameHtml({
    version: "vNext",
    image: `${BASE_URL}/api/captcha/image?id=${captchaId}`,
    inputText: "enter answer here",
    buttons: [{ label: "enter", action: "post" }],
    postUrl: `${BASE_URL}/api/captcha/validate?id=${captchaId}`,
  });

export const INVALID_CAPTCHA_RESPONSE = getFrameHtml({
  version: "vNext",
  image: INVALID_CAPTCHA_IMAGE_URL,
  buttons: [{ label: "try again", action: "post" }],
  postUrl: `${BASE_URL}/api/captcha`,
});

export const TRY_AGAIN_RESPONSE = getFrameHtml({
  version: "vNext",
  image: ERROR_IMAGE_URL,
  buttons: [{ label: "try again", action: "post" }],
  postUrl: `${BASE_URL}/api/captcha`,
});

export const REQUEST_MINT_RESPONSE = (captchaId: string, result: string) =>
  getFrameHtml({
    version: "vNext",
    image: LETS_GO_IMAGE_URL,
    buttons: [{ label: "request mint", action: "post" }],
    postUrl: `${BASE_URL}/api/mint?id=${captchaId}&result=${result}`,
  });

export const SUCCESS_RESPONSE = (data: {
  transactionHash?: string;
  address?: string;
}) =>
  getFrameHtml({
    version: "vNext",
    image: SUCCESS_IMAGE_URL,
    buttons: [
      { label: "view your nft on framechain", action: "post_redirect" },
    ],
    postUrl: `${BASE_URL}/api/completed/redirect?${
      data.transactionHash
        ? `txHash=${data.transactionHash}`
        : `address=${data.address}`
    }`,
  });

export const SOLD_OUT_RESPONSE = getFrameHtml({
  version: "vNext",
  image: SOLD_OUT_IMAGE_URL,
  buttons: [
    {
      label: "but you can still register to builder.fi! 🔷",
      action: "post_redirect",
    },
  ],
  postUrl: `${BASE_URL}/api/sign-up`,
});

export const NOT_ELIGIBLE_RESPONSE = getFrameHtml({
  version: "vNext",
  image: SIGN_UP_BF_IMAGE_URL,
  buttons: [
    {
      label: "sign up on builder.fi first! 🔷",
      action: "post_redirect",
    },
    {
      label: "refresh and try again",
      action: "post",
    },
  ],
  postUrl: `${BASE_URL}/api/sign-up`,
});
