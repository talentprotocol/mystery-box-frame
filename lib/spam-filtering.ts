import { fetchFarcasterProfileInfo } from "./airstack/farcaster-profile";
import { fetchNonVirtualPoapsOwned } from "./airstack/virtual-poaps";
import {
  SPAM_FARCASTER_FOLLOWER_THRESHOLD,
  SPAM_VIRTUAL_POAPS_THRESHOLD,
} from "./constants";

export const checkIfAddressIsSpam = async (address: string) => {
  const farcasterProfile = await fetchFarcasterProfileInfo(address);
  if (!farcasterProfile) {
    return { farcasterProfile: null, passSpamCheck: false };
  }
  const nonVirtualPoaps = await fetchNonVirtualPoapsOwned(address);
  return {
    farcasterProfile,
    isSpam:
      // If the user has no IRL poaps and less than 200 followers on farcaster, they are spam
      nonVirtualPoaps.length < SPAM_VIRTUAL_POAPS_THRESHOLD &&
      farcasterProfile?.followerCount! < SPAM_FARCASTER_FOLLOWER_THRESHOLD,
  };
};
