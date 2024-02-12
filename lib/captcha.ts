import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

export const generateRandomNumberInRange = (start: number, end: number) =>
  Math.floor(Math.random() * end) + start;

interface CaptchaChallenge {
  numA: number;
  numB: number;
  result: number;
}

export const storeCaptchaChallenge = async (challenge: CaptchaChallenge) => {
  const id = uuidv4();
  await kv.set(`captcha/${id}`, challenge);
  return id;
};

export const getCaptchaChallenge = async (
  id: string
): Promise<CaptchaChallenge> => {
  return (await kv.get(`captcha/${id}`)) as CaptchaChallenge;
};

export const generateCaptchaChallenge = () => {
  const numA = generateRandomNumberInRange(1, 10);
  const numB = generateRandomNumberInRange(1, 10);
  console.log(numA, numB);
  return storeCaptchaChallenge({ numA, numB, result: numA + numB });
};

export const validateCaptchaChallenge = async (id: string, result: number) => {
  const captchaChallenge = await getCaptchaChallenge(id);
  if (!captchaChallenge) {
    return false;
  }
  const { result: storedResult } = captchaChallenge;
  return result === storedResult;
};
