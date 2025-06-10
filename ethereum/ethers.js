import { ethers } from "ethers";
require('dotenv').config();

let provider;

// Helper function to safely get signer
const getSigner = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask to interact with the blockchain.");
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    // Create browser provider if not exists or recreate to ensure fresh connection
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    return await browserProvider.getSigner();
  } catch (error) {
    console.error("Error getting signer:", error);
    throw new Error("Failed to connect to wallet. Please check your MetaMask connection.");
  }
};

// Helper function to get provider
const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    // Server-side or no MetaMask - use JSON-RPC provider
    const rpcUrl = process.env.NEXT_PUBLIC_RPC || 'https://eth-mainnet.alchemyapi.io/v2/your-api-key';
    return new ethers.JsonRpcProvider(rpcUrl);
  }
};

// Initialize provider
provider = getProvider();

// Attach helper functions to provider
provider.getSigner = getSigner;
provider.getProvider = getProvider;

export default provider; 