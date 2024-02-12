import { fetchAllPagesQuery } from ".";
import { PoaPsOwnedQuery, Poap } from "./types";

const query = /* GraphQL */ `
  query POAPsOwned($address: Identity!) {
    Poaps(
      input: {
        filter: { owner: { _eq: $address } }
        blockchain: ALL
        limit: 200
      }
    ) {
      Poap {
        mintOrder
        mintHash
        poapEvent {
          isVirtualEvent
        }
        owner {
          addresses
        }
      }
      pageInfo {
        nextCursor
        prevCursor
      }
    }
  }
`;

export const fetchNonVirtualPoapsOwned = async (address: string) => {
  const response = await fetchAllPagesQuery<PoaPsOwnedQuery>(query, {
    address,
  });
  console.log(response);
  if (response.length === 0) {
    return [];
  }
  return response
    .flatMap((r) => r.Poaps?.Poap)
    .filter(Boolean)
    .filter((poap) => !poap?.poapEvent?.isVirtualEvent)
    .filter(Boolean);
};
