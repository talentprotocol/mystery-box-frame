import { NFT_COLLECTION_ADDRESS } from "./constants";

const fetch = require('node-fetch');

const syndicate_api_key = process.env.SYNDICATE_API_KEY;

async function mintTokens(frameTrustedData: string, addressReceiver: string, tokenId: number) {
  try {
    const res = await fetch('https://frame.syndicate.io/api/v2/sendTransaction', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${syndicate_api_key}`
      },
      body: JSON.stringify({
        frameTrustedData: frameTrustedData,
        contractAddress: NFT_COLLECTION_ADDRESS,
        functionSignature: "safeMint(address to, uint256 tokenId)",
        args: { to: addressReceiver, tokenId: tokenId },
        shouldLike: false,
        shouldRecast: false,
        shouldFollow: false
      })
    });

    const data = await res.json();
    console.log(data); 
  } catch (error) {
    console.error("Error while minting tokens:", error);
  }
}
/*
async function getBalance(frameTrustedData: string, addressReceiver: string) {
  try {
    const res = await fetch('https://frame.syndicate.io/api/v2/sendTransaction', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${syndicate_api_key}`
      },
      body: JSON.stringify({
        frameTrustedData: frameTrustedData,
        contractAddress: NFT_COLLECTION_ADDRESS,
        functionSignature: "balanceOf(address owner)",
        args: { owner: addressReceiver },
        shouldLike: false,
        shouldRecast: false,
        shouldFollow: false
      })
    });

    const data = await res.json();
    console.log(data);

  } catch (error) {
    console.error("Error while getting balance:", error);
  }
}*/