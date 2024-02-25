import { PrismaClient, SocialProfileType } from "@prisma/client";

const prisma = new PrismaClient();

export const isUserEligible = async (username: string): Promise<boolean> => {
  // check if user is on builder.fi with his fc account
  const builderfiProfile = await prisma.socialProfile.findFirst({
    where: {
      profileName: username,
      type: SocialProfileType.FARCASTER,
    },
  });

  if (!builderfiProfile) {
    return false;
  }

  return true;
};
