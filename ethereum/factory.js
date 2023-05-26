import web3 from './web3';
import VotingFactory from './build/VotingFactory.json'

const instance = new web3.eth.Contract(
    VotingFactory.abi,
    "0x128cF3694f1cd69Da2b6639fEDD98B752aAd9656" /*replace to your factory contract address*/ 
);

// 0x7B8885A3D7A8E43330F811eb511bC9a40C638A8A

export default instance;