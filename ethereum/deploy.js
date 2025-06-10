require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledFactory = require('./build/VotingFactory.json');

const provider = new HDWalletProvider(
  process.env.NEXT_PUBLIC_MNEMONIC_PHRASE,
  // remember to change this to your own phrase!
  process.env.NEXT_PUBLIC_RPC
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi).deploy({ data: compiledFactory.evm.bytecode.object }).send({ from: accounts[0], maxPriorityFeePerGas: web3.utils.toWei('25', 'gwei'), maxFeePerGas: web3.utils.toWei('30', 'gwei') });

    console.log('Contract deployed to', result.options.address);
    // console.log('Factory abi', JSON.stringify(compiledFactory.abi));
    provider.engine.stop();
  } catch (error) {
    console.log('error:', error);
  }
};
deploy();

// Contract deployed to xxx (contract factory address)
