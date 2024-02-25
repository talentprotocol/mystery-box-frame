import { getFrameHtml } from "frames.js";
import {
  BASE_URL,
  BUILDERFI_APP_URL,
  ERROR_IMAGE_URL,
  INVALID_CAPTCHA_IMAGE_URL,
  LETS_GO_IMAGE_URL,
  SIGN_UP_BF_IMAGE_URL,
  COLLECTION_LINK,
  SOLD_OUT_IMAGE_URL,
  SUCCESS_IMAGE_URL,
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
  buttons: [{ label: "try Again", action: "post" }],
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

export const SUCCESS_RESPONSE = getFrameHtml({
  version: "vNext",
  image: SUCCESS_IMAGE_URL,
  buttons: [{ label: "view your nft on framechain", action: "post_redirect" }],
  postUrl: COLLECTION_LINK,
});

export const SOLD_OUT_RESPONSE = getFrameHtml({
  version: "vNext",
  image: SOLD_OUT_IMAGE_URL,
  buttons: [
    {
      label: "wiew the collection on framechain",
      action: "post_redirect",
    },
  ],
  postUrl: COLLECTION_LINK,
});

export const NOT_ELIGIBLE_RESPONSE = getFrameHtml({
  version: "vNext",
  image: SIGN_UP_BF_IMAGE_URL,
  buttons: [
    {
      label: "sign up on builder.fi first! 🔷",
      action: "post_redirect",
    },
  ],
  postUrl: BUILDERFI_APP_URL,
});
