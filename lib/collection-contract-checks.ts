import { constants } from "buffer";

const { ethers } = require("ethers");
import { ERC721_ABI } from "./abis"
import { SUPPLY_LIMIT } from "./constants";
import { BigNumber } from "ethers";


async function checkNFTBalance(ownerAddress: string) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contractAddress = process.env.CONTRACT_ADDRESS;

    // Create contract instance
    const collection = new ethers.Contract(contractAddress, ERC721_ABI, provider);
    
    // Call balanceOf function to get NFT balance
    const balance = await collection.balanceOf(ownerAddress);

    // Check if balance is 0
    if (balance.eq(ethers.BigNumber.from(0))) {
      console.log("Address doesn't have NFT yet");
      return true;
    } else {
      console.log("Address already has NFT");
      return false;
    }
  } catch (error) {
    console.error("Error while checking NFT balance:", error);
    // Handle error as per your requirement
    return false;
  }
}

async function checkNFTotalSupply() {
    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
      const contractAddress = process.env.CONTRACT_ADDRESS;
  
      // Create contract instance
      const collection = new ethers.Contract(contractAddress, ERC721_ABI, provider);
      
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
      console.error("Error while checking NFT balance:", error);
      // Handle error as per your requirement
      return false;
    }
  }