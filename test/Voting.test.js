const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/VotingFactory.json");
const compiledVoting = require("../ethereum/build/Voting.json");

let accounts;
let factory;
let votingAddress;
let voting;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "3000000" });

  // const value = web3.utils.toWei('0.02', 'ether');

  await factory.methods.createVoting("2", "1684223786", "1684337856").send({
    from: accounts[0],
    gas: "1800000",
    value: "2100000000000000000"
  });

  [votingAddress] = await factory.methods.getDeployedVotings().call();
    voting = await new web3.eth.Contract(
    compiledVoting.abi,
    votingAddress
  );
});

describe("Voting", () => {
  it("deploys a factory and a voting", () => {
    assert.ok(factory.options.address);
    assert.ok(voting.options.address);
  });

  it("marks caller as the voting manager", async () => {
    const manager = await voting.methods.manager().call();
    assert.equal(accounts[0], manager);
  });


  it("completed vote", async () => {
    await voting.methods.pickChoice(0).send({
      from: accounts[1],
      gas: "1000000"
    });
    
    totalVoters = await voting.methods.totalVoters().call();
    
    await voting.methods.completedVoteThenTransfer().send({
      from: accounts[0],
      gas: "1400000"
    })
    
    luckyVoter = await voting.methods.luckyVoter().call();

    let votingAddress = voting.options.address;
    let balanceContract = await web3.eth.getBalance(votingAddress);
    balanceContract = web3.utils.fromWei(balanceContract, "ether");
    balanceContract = parseFloat(balanceContract);

    console.log(totalVoters);
    console.log(accounts[1]);
    console.log(luckyVoter);
    console.log(balanceContract);
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    console.log(balance);
    
    assert(totalVoters > 0);
  });


});
