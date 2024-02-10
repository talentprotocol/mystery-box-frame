import { fetchFarcasterProfileInfo } from "./airstack/farcaster-profile";
import { fetchNonVirtualPoapsOwned } from "./airstack/virtual-poaps";
import {
  SPAM_FARCASTER_FOLLOWER_THRESHOLD,
  SPAM_VIRTUAL_POAPS_THRESHOLD,
} from "./constants";

export const checkIfAddressIsSpam = async (
  address: string
): Promise<{
  farcasterProfile?: {
    followerCount: number | null;
    userAddress: string | null;
    profileHandle: string | null;
    userId: string | null;
  } | null;
  isSpam: boolean;
}> => {
  const farcasterProfile = await fetchFarcasterProfileInfo(address);
  // If the user has no farcaster profile, they are spam
  if (!farcasterProfile) {
    return { farcasterProfile: undefined, isSpam: true };
  }
  // If the user has more than 200 followers on farcaster, they are not spam
  if (farcasterProfile?.followerCount! >= SPAM_FARCASTER_FOLLOWER_THRESHOLD) {
    return { farcasterProfile, isSpam: false };
  }
  // If the user has no IRL poaps and less than 200 followers on farcaster, they are spam
  const nonVirtualPoaps = await fetchNonVirtualPoapsOwned(address);
  return {
    farcasterProfile,
    isSpam:
      // If the user has no IRL poaps and less than 200 followers on farcaster, they are spam
      nonVirtualPoaps.length < SPAM_VIRTUAL_POAPS_THRESHOLD,
  };
};
