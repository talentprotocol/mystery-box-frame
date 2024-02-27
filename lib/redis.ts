import { kv } from "@vercel/kv";

export enum ClaimStatus {
  CLAIMED = "claimed",
  UNCLAIMED = "unclaimed",
  PENDING = "pending",
}

export const setClaimStatus = async (address: string, status: ClaimStatus) => {
  return await kv.set(address, status);
};

export const hasClaimed = async (address: string): Promise<boolean> => {
  const claimed = await kv.get(address);
  if (!claimed) return false;
  return claimed === ClaimStatus.CLAIMED || claimed === ClaimStatus.PENDING;
};

export const hasStartedClaim = async (address: string) => {
  const claimed = await kv.get(address);
  return claimed && claimed === ClaimStatus.PENDING;
};
