import { ethers } from 'ethers';
import provider from "./ethers";
import Voting from "./build/Voting.json";

const instance = (address) => {
  return new ethers.Contract(address, Voting.abi, provider);
};

export default instance;
