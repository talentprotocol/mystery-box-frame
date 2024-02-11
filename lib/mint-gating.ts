import { fetchFarcasterProfileInfo } from "./airstack/farcaster-profile";
import { fetchNonVirtualPoapsOwned } from "./airstack/virtual-poaps";
import { MINTING_ELIGIBILITY_CRITERIA } from "./constants";

export const isAddressEligible = async (
  address: string
): Promise<{
  farcasterProfile?: {
    followerCount: number | null;
    userAddress: string | null;
    profileHandle: string | null;
    userId: string | null;
  } | null;
  isEligible: boolean;
}> => {
  const farcasterProfile = await fetchFarcasterProfileInfo(address);
  // If the user has no farcaster profile, they are eligible for minting
  if (!farcasterProfile) {
    return { farcasterProfile: undefined, isEligible: false };
  }
  // If the user has more than 200 followers on farcaster, they are eligible
  if (
    farcasterProfile?.followerCount! >=
    MINTING_ELIGIBILITY_CRITERIA.farcasterFollowersThreshold
  ) {
    return { farcasterProfile, isEligible: true };
  }
  // If the user has at least one IRL poap, they are eligible
  const nonVirtualPoaps = await fetchNonVirtualPoapsOwned(address);
  return {
    farcasterProfile,
    isEligible:
      nonVirtualPoaps.length >=
      MINTING_ELIGIBILITY_CRITERIA.virtualPoapsThreshold,
  };
};
