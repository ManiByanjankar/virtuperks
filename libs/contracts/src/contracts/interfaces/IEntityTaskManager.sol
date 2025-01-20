// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IEntityTaskManager {
  enum TaskStatus {
    OPEN,
    CLOSED
  }

  enum STATUS {
    UNACCEPTED,
    ACCEPTED,
    COMPLETED,
    VERIFIED
  }

  struct Task {
    string detailsUrl;
    address rewardToken;
    uint256 rewardAmount;
    address[] allowedWallets; //who can participate
    uint256 maxParticipants;
    uint256 expiryDate;
    address owner;
    bool isActive;
  }

  struct TaskAssignment {
    address participant;
    STATUS status;
  }

  event TaskCreated(string indexed id, address indexed createdBy);
  event TaskAccepted(string indexed id);
  event ParticiantApplied(string indexed id, address indexed participant);
  event TaskCompleted(string indexed id, address indexed participant);
  event TaskApproved(string indexed id, address indexed approver);

  function createTask(Task memory task) external;

  function participate(string memory taskId) external;

  function acceptParticipant(
    string memory taskId,
    address participant
  ) external;

  function completeTask(string memory taskId) external;

  //verify completely new task
  //transfer tokens to the participant
  function verifyCompletion(string memory taskId) external;

  function taskAssignments(
    string memory taskId,
    address participant
  ) external view returns (STATUS status);
}
