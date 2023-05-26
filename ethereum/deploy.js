const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/VotingFactory.json');

const provider = new HDWalletProvider(
  'swallow radio panda endless bicycle arena story winter ahead dismiss decade multiply',
  // remember to change this to your own phrase!
  'https://sepolia.infura.io/v3/e66c6786fc4e4498b85dad63f994340c'
  // "https://polygon-mumbai.g.alchemy.com/v2/vcvZrzGeIs5WzICRvEj3IqaKiVrINq96"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    compiledFactory.abi
  )
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: '3000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
    console.log('Factory abi',  JSON.stringify(compiledFactory.abi));
  provider.engine.stop();
};
deploy();

// Contract deployed to xxx (contract factory address)