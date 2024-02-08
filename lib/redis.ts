import { kv } from '@vercel/kv';

export const setClaimed = async (address: string) => {
  return await kv.set(address, 'claimed');
};

export const hasClaimed = async (address: string) => {
  const claimed = await kv.get(address);
  console.log(claimed);
  return claimed && claimed === 'claimed';
};
