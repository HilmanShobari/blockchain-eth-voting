const assert = require("assert");
const { ethers } = require("ethers");

const compiledFactory = require("../ethereum/build/VotingFactory.json");
const compiledVoting = require("../ethereum/build/Voting.json");

let provider;
let signers;
let factory;
let votingAddress;
let voting;

beforeEach(async () => {
  // Create a local provider for testing
  provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  signers = await ethers.getSigners();

  // Deploy factory contract
  const factoryFactory = new ethers.ContractFactory(
    compiledFactory.abi,
    compiledFactory.evm.bytecode.object,
    signers[0]
  );
  
  factory = await factoryFactory.deploy();
  await factory.waitForDeployment();

  // Create timestamps for voting period
  const startTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
  const endTime = Math.floor(Date.now() / 1000) - 60; // 1 minute ago (already ended)

  // Create voting with title and choices
  const title = "Test Voting";
  const choices = ["Option A", "Option B"];
  
  await factory.createVoting(title, choices, startTime, endTime);

  const deployedVotings = await factory.getDeployedVotings();
  votingAddress = deployedVotings[0];
  
  voting = new ethers.Contract(
    votingAddress,
    compiledVoting.abi,
    signers[0]
  );
});

describe("Optimized Voting", () => {
  it("deploys a factory and a voting", async () => {
    const factoryAddress = await factory.getAddress();
    const votingAddr = await voting.getAddress();
    assert.ok(factoryAddress);
    assert.ok(votingAddr);
  });

  it("marks caller as the voting manager", async () => {
    const manager = await voting.manager();
    const signerAddress = await signers[0].getAddress();
    assert.equal(signerAddress, manager);
  });

  it("allows manager to add voters", async () => {
    const voterAddress = await signers[1].getAddress();
    await voting.addVoter(voterAddress);
    
    const isAllowed = await voting.allowedVoters(voterAddress);
    assert(isAllowed);
  });

  it("can complete vote after voting period ends", async () => {
    const totalVoters = await voting.totalVotersVoted();
    
    await voting.complete();
    
    const completed = await voting.completed();

    console.log("Total voters:", totalVoters.toString());
    console.log("Completed:", completed);
    
    assert(completed);
  });
});
