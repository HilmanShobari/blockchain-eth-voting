import web3 from './web3';
import VotingFactory from './build/VotingFactory.json'

const instance = new web3.eth.Contract(
    VotingFactory.abi,
    "0x85460623F2543F2c4b57a8fe8341749148FBa790" /*replace to your factory contract address*/ 
);

// 0x7B8885A3D7A8E43330F811eb511bC9a40C638A8A

export default instance;