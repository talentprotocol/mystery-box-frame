import { NFT_COLLECTION_ADDRESS, SYNDICATE_API_KEY } from "./constants";

export const mintTokens = async (
  frameTrustedData: string,
  addressReceiver: string,
  tokenId: number
): Promise<{
  transactionId: string;
  userAddress: string;
}> => {
  console.log(
    JSON.stringify(
      {
        frameTrustedData: frameTrustedData,
        contractAddress: NFT_COLLECTION_ADDRESS,
        functionSignature: "safeMint(address to, uint256 tokenId)",
        args: { to: addressReceiver, tokenId: tokenId },
        shouldLike: false,
        shouldRecast: false,
        shouldFollow: false,
      },
      null,
      2
    )
  );
  const res = await fetch("https://frame.syndicate.io/api/v2/sendTransaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SYNDICATE_API_KEY}`,
    },
    body: JSON.stringify({
      frameTrustedData: frameTrustedData,
      contractAddress: NFT_COLLECTION_ADDRESS,
      functionSignature: "safeMint(address to, uint256 tokenId)",
      args: { to: addressReceiver, tokenId: tokenId },
      shouldLike: false,
      shouldRecast: false,
      shouldFollow: false,
    }),
  });

  const data = await res.json();
  console.log("data", tokenId, data);
  if (!data || data?.success === false) {
    throw new Error("Error while minting tokens");
  }
  return data.data;
};

export const getTxHash = async (transactionId: string): Promise<string> => {
  const res = await fetch(
    `https://frame.syndicate.io/api/v2/transaction/${transactionId}/hash`,
    {
      headers: {
        Authorization: `Bearer ${SYNDICATE_API_KEY}`,
      },
    }
  );
  const data = await res.json();
  if (!data || data?.success === false) {
    throw new Error("Error while fetching transaction details");
  }
  return data.transactionHash;
};
