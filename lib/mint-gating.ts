import { fetchFarcasterProfileInfo } from "./airstack/farcaster-profile";
import { PrismaClient, SocialProfileType} from "@prisma/client";

const prisma = new PrismaClient();

export const isAddressEligible = async (
  address: string,
  fid: string
): Promise<{
  farcasterProfile?: {
    followerCount: number | null;
    userAddress: string | null;
    profileHandle: string | null;
    userId: string | null;
  } | null;
  isEligible: boolean;
}> => {
  console.log(address);
  const farcasterProfile = await fetchFarcasterProfileInfo(fid);
  // If the user has no farcaster profile, they are eligible for minting
  if (!farcasterProfile) {
    return { farcasterProfile: undefined, isEligible: false };
  }

  // check if user is on builder.fi with his fc account
  const builderfiProfile = await prisma.socialProfile.findFirst({
    where: { 
      profileName: farcasterProfile.profileHandle || "",
      type: SocialProfileType.FARCASTER 
    },
    include: { user: true }
  });
  
  if (!builderfiProfile) {
    return { farcasterProfile: undefined, isEligible: false };
  }

  return {
    farcasterProfile,
    isEligible: true,
  };

};