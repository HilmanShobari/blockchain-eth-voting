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

  // Create timestamps for voting period
  const startTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
  const endTime = Math.floor(Date.now() / 1000) - 60; // 1 minute ago (already ended)

  await factory.methods.createVoting(2, startTime, endTime).send({
    from: accounts[0],
    gas: "3000000"
  });

  [votingAddress] = await factory.methods.getDeployedVotings().call();
  voting = await new web3.eth.Contract(
    compiledVoting.abi,
    votingAddress
  );
});

describe("Optimized Voting", () => {
  it("deploys a factory and a voting", () => {
    assert.ok(factory.options.address);
    assert.ok(voting.options.address);
  });

  it("marks caller as the voting manager", async () => {
    const manager = await voting.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows manager to add voters", async () => {
    await voting.methods.addVoter(accounts[1]).send({
      from: accounts[0],
      gas: "100000"
    });
    
    const isAllowed = await voting.methods.allowedVoters(accounts[1]).call();
    assert(isAllowed);
  });

  it("can complete vote after voting period ends", async () => {
    const totalVoters = await voting.methods.totalVotersVoted().call();
    
    await voting.methods.complete().send({
      from: accounts[0],
      gas: "100000"
    });
    
    const completed = await voting.methods.completed().call();

    console.log("Total voters:", totalVoters);
    console.log("Completed:", completed);
    
    assert(completed);
  });
});
