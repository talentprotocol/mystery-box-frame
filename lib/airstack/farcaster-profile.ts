import { fetchQuery, init } from "@airstack/node";
import { FarcasterFollowersQuery } from "./types";

init(process.env.AIRSTACK_API_KEY!);

const query = /* GraphQL */ `
  query FarcasterFollowers($fid: String!) {
    Socials(
      input: {
        filter: { dappName: { _eq: farcaster }, userId: { _eq: $fid } }
        blockchain: ethereum
        limit: 200
      }
    ) {
      Social {
        userAssociatedAddresses
        followerCount
        userAddress
        profileHandle
        userId
      }
    }
  }
`;

interface QueryResponse {
  data: FarcasterFollowersQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchFarcasterProfileInfo = async (fid: string) => {
  const { data, error }: QueryResponse = await fetchQuery(query, {
    fid,
  });
  if (error || !data || !data.Socials?.Social) {
    return null;
  }
  return data.Socials.Social[0];
};
