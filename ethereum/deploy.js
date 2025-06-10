require('dotenv').config();
const { ethers } = require('ethers');
const compiledFactory = require('./build/VotingFactory.json');

const deploy = async () => {
  try {
    // Create provider
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC);
    
    // Create wallet from mnemonic
    const wallet = ethers.Wallet.fromPhrase(process.env.NEXT_PUBLIC_MNEMONIC_PHRASE);
    const signer = wallet.connect(provider);

    console.log('Attempting to deploy from account', await signer.getAddress());

    // Create contract factory
    const contractFactory = new ethers.ContractFactory(
      compiledFactory.abi,
      compiledFactory.evm.bytecode.object,
      signer
    );

    // Deploy contract
    const contract = await contractFactory.deploy({
      maxPriorityFeePerGas: ethers.parseUnits('25', 'gwei'),
      maxFeePerGas: ethers.parseUnits('30', 'gwei')
    });

    // Wait for deployment
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log('Contract deployed to', contractAddress);
  } catch (error) {
    console.log('error:', error);
  }
};

deploy();

// Contract deployed to xxx (contract factory address)
