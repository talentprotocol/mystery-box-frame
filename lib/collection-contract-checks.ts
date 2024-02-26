import { ERC721_ABI } from "./abis";
import { NFT_COLLECTION_ADDRESS, RPC_URL, SUPPLY_LIMIT } from "./constants";
import { BigNumber, ethers } from "ethers";

export async function checkNFTTotalSupply() {
  try {
    console.log(RPC_URL);
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    // Create contract instance
    const collection = new ethers.Contract(
      NFT_COLLECTION_ADDRESS,
      ERC721_ABI,
      provider
    );

    // Call balanceOf function to get NFT balance
    const supply = await collection.totalSupply();

    // Check if balance is 0
    if (supply.lt(BigNumber.from(SUPPLY_LIMIT))) {
      console.log("Can still mint the collection supply");
      return true;
    } else {
      console.log("Max Supply reached");
      return false;
    }
  } catch (error) {
    console.error("Error while checking NFT total supply:", error);
    // Handle error as per your requirement
    return false;
  }
}
