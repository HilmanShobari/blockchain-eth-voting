import web3 from './web3';
import VotingFactory from './build/VotingFactory.json'
require('dotenv').config();

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const instance = new web3.eth.Contract(
    VotingFactory.abi,
    contractAddress
);

export default instance;