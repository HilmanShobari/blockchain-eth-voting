import { ethers } from "ethers";

// Helper function to check MetaMask status
export const checkMetaMaskStatus = () => {
  if (typeof window === 'undefined') {
    return { status: 'server', message: 'Running on server-side' };
  }
  
  if (!window.ethereum) {
    return { status: 'no-metamask', message: 'MetaMask not detected' };
  }
  
  if (!window.ethereum.isMetaMask) {
    return { status: 'not-metamask', message: 'Ethereum provider detected but not MetaMask' };
  }
  
  return { status: 'ready', message: 'MetaMask detected and ready' };
};

// Helper function to safely get signer with detailed logging
export const getSaferSigner = async () => {
  console.log('=== Getting Signer Debug Info ===');
  
  const status = checkMetaMaskStatus();
  console.log('MetaMask Status:', status);
  
  if (status.status !== 'ready') {
    throw new Error(status.message);
  }
  
  try {
    console.log('Requesting account access...');
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log('Account access granted');
    
    console.log('Creating BrowserProvider...');
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log('BrowserProvider created:', provider);
    
    console.log('Getting signer...');
    const signer = await provider.getSigner();
    console.log('Signer obtained:', signer);
    
    console.log('Getting address...');
    const address = await signer.getAddress();
    console.log('Address:', address);
    
    console.log('Getting network...');
    const network = await provider.getNetwork();
    console.log('Network:', network);
    
    return signer;
  } catch (error) {
    console.error('Error in getSaferSigner:', error);
    throw error;
  }
};

// Helper function to test contract connection
export const testContractConnection = async (contractInstance) => {
  try {
    console.log('Testing contract connection...');
    console.log('Contract instance:', contractInstance);
    
    const provider = contractInstance.runner;
    console.log('Contract provider:', provider);
    
    if (provider && provider.getNetwork) {
      const network = await provider.getNetwork();
      console.log('Contract network:', network);
    }
    
    return true;
  } catch (error) {
    console.error('Contract connection test failed:', error);
    return false;
  }
};

// Export all helpers
export default {
  checkMetaMaskStatus,
  getSaferSigner,
  testContractConnection
}; 