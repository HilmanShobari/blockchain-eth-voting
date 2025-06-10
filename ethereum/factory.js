import { ethers } from 'ethers';
import provider from './ethers';
import VotingFactory from './build/VotingFactory.json'
require('dotenv').config();

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const instance = new ethers.Contract(
    contractAddress,
    VotingFactory.abi,
    provider
);

export default instance;