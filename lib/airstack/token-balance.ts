import { fetchQuery } from "@airstack/node";
import { NftTokenBalanceQuery } from "./types";

const query = /* GraphQL */ `
  query NFTTokenBalance($owner: Identity!, $token: Address!) {
    TokenBalances(
      input: {
        filter: { owner: { _eq: $owner }, tokenAddress: { _eq: $token } }
        blockchain: base
      }
    ) {
      TokenBalance {
        amount
      }
    }
    Tokens(input: { filter: { address: { _eq: $token } }, blockchain: base }) {
      Token {
        totalSupply
      }
    }
  }
`;

interface QueryResponse {
  data: NftTokenBalanceQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchNftTokenBalance = async (
  owner: string,
  token: string
): Promise<{ balance: string | number; totalSupply: string | number }> => {
  const { data, error }: QueryResponse = await fetchQuery(query, {
    owner,
    token,
  });
  if (error || !data) {
    throw new Error(`Error fetching token balance: ${error?.message}`);
  }
  return {
    balance: data.TokenBalances?.TokenBalance
      ? data.TokenBalances.TokenBalance[0]?.amount!
      : 0,
    totalSupply: data.Tokens?.Token ? data.Tokens.Token[0]?.totalSupply! : 0,
  };
};
