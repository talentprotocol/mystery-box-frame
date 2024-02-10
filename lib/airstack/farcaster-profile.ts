import { fetchQuery, init } from "@airstack/node";
import { FarcasterFollowersQuery } from "./types";

init(process.env.AIRSTACK_API_KEY!);

const query = /* GraphQL */ `
  query FarcasterFollowers($address: Identity!) {
    Socials(
      input: {
        filter: {
          followerCount: { _gt: 200 }
          dappName: { _eq: farcaster }
          identity: { _eq: $address }
        }
        blockchain: ethereum
        limit: 200
      }
    ) {
      Social {
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

export const fetchFarcasterProfileInfo = async (address: string) => {
  const { data, error }: QueryResponse = await fetchQuery(query, {
    address,
  });
  if (error || !data || !data.Socials?.Social) {
    return null;
  }
  return data.Socials.Social[0];
};
