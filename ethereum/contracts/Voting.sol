// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract VotingFactory {
    address[] public deployedVotings;

    function createVoting(
        string memory title,
        string[] memory choiceNames,
        uint32 fromDate,
        uint32 endDate
    ) external {
        deployedVotings.push(
            address(
                new Voting(title, choiceNames, fromDate, endDate, msg.sender)
            )
        );
    }

    function getDeployedVotings() external view returns (address[] memory) {
        return deployedVotings;
    }
}

contract Voting {
    // Storage slot 1: address (20 bytes) + uint8 (1 byte) + bool (1 byte) = 22 bytes (fits in 32)
    address public manager;
    uint8 public totalChoices;
    bool public completed;

    // Storage slot 2: uint32 (4 bytes) + uint32 (4 bytes) + uint32 (4 bytes) + uint32 (4 bytes) = 16 bytes (fits in 32)
    uint32 public fromDate;
    uint32 public endDate;
    uint32 public totalVotersVoted;
    uint32 public totalAllowedVoters;

    // New fields for title and choice names
    string public title;
    string[] public choiceNames;

    // Mappings (each entry uses 1 storage slot)
    mapping(address => bool) public votedVoters;
    mapping(address => bool) public allowedVoters;
    mapping(uint8 => uint32) public choiceVotes;

    // Events for logging (cheaper than storage)
    event VoterAdded(address voter);
    event VoteCast(address voter, uint8 choice);
    event VotingCompleted();

    modifier onlyManager() {
        require(msg.sender == manager, "Not manager");
        _;
    }

    constructor(
        string memory _title,
        string[] memory _choiceNames,
        uint32 _fromDate,
        uint32 _endDate,
        address _manager
    ) {
        manager = _manager;
        title = _title;
        choiceNames = _choiceNames;
        totalChoices = uint8(_choiceNames.length);
        fromDate = _fromDate;
        endDate = _endDate;
        // Other variables default to 0/false (saves gas)
    }

    function addVoter(address voter) external onlyManager {
        require(!allowedVoters[voter], "Already added");
        allowedVoters[voter] = true;
        unchecked {
            totalAllowedVoters++;
        }
        emit VoterAdded(voter);
    }

    function vote(uint8 choice) external {
        require(allowedVoters[msg.sender], "Not allowed");
        require(!votedVoters[msg.sender], "Already voted");
        require(!completed, "Completed");
        require(
            block.timestamp >= fromDate && block.timestamp <= endDate,
            "Invalid time"
        );
        require(choice < totalChoices, "Invalid choice");

        votedVoters[msg.sender] = true;
        unchecked {
            choiceVotes[choice]++;
            totalVotersVoted++;
        }
        emit VoteCast(msg.sender, choice);
    }

    function complete() external onlyManager {
        require(!completed, "Already completed");
        require(block.timestamp > endDate, "Not ended");
        completed = true;
        emit VotingCompleted();
    }

    function getVotes(uint8 choice) external view returns (uint32) {
        return choiceVotes[choice];
    }

    function getChoiceName(uint8 choice) external view returns (string memory) {
        require(choice < totalChoices, "Invalid choice");
        return choiceNames[choice];
    }

    function getAllChoiceNames() external view returns (string[] memory) {
        return choiceNames;
    }

    function getStatus()
        external
        view
        returns (address, uint8, uint32, uint32, bool, uint32, string memory)
    {
        return (
            manager,
            totalChoices,
            fromDate,
            endDate,
            completed,
            totalVotersVoted,
            title
        );
    }
}
