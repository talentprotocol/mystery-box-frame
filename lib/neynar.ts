import { NeynarAPIClient } from '@neynar/nodejs-sdk';

export const validateFrameMessageWithNeynar = async (messageBytesInHex: string) => {
  const sdk = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);
  const data = await sdk.validateFrameAction(messageBytesInHex);
  return data;
};
