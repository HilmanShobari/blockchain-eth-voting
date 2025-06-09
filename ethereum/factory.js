import web3 from './web3';
import VotingFactory from './build/VotingFactory.json'
require('dotenv').config();

const instance = new web3.eth.Contract(
    VotingFactory.abi,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS /*replace to your factory contract address*/ 
);

// 0x7B8885A3D7A8E43330F811eb511bC9a40C638A8A

export default instance;