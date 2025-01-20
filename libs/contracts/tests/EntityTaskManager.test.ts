import { expect } from "chai";
import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { deployTaskManagementFixture, TaskManagementFixture, taskDetails1 } from "./fixtures";
// import {AccessManager} from '../typechain-types'
//function to get the unixtimestamp 
function getUnixTimeStamp() {
    return Math.floor(new Date().getTime() / 1000);
}

describe('------ Task Management Tests ------', function () {

    describe("Deployment", function () {
        let tmf: TaskManagementFixture;
        // let provider: EthereumProvider;
        before(async function () {
            tmf = await loadFixture(deployTaskManagementFixture);
        });
        it("should deploy contracts with expected initial values", async function () {
            expect(await tmf.rewardToken.name()).to.equal('Rahat');
            expect(await tmf.rewardToken.symbol()).to.equal('RTH');
            expect(await tmf.rewardToken.decimals()).to.equal(0n);
            expect(await tmf.rewardToken.totalSupply()).to.equal(1000n);
        });

        it('should deploy entities with expected initial values', async function () {
            expect(await tmf.redEntity.appId()).to.equal(hre.ethers.id('RedCafe'));
            expect(await tmf.blueEntity.appId()).to.equal(hre.ethers.id('BlueCafe'));
            expect(await tmf.redEntity.acl()).to.equal(tmf.accessManagerV2.target);
            expect(await tmf.blueEntity.acl()).to.equal(tmf.accessManagerV2.target);
        });
    });

    describe("Happy Path: Red Task Management", function () {
        let tmf: TaskManagementFixture;
        before(async function () {
            tmf = await loadFixture(deployTaskManagementFixture);
        });

        it("should create a task", async function () {
            await tmf.redEntity.connect(tmf.redCakeTaskOwner).createTask({
                detailsUrl: taskDetails1,
                rewardToken: tmf.rewardToken.target,
                rewardAmount: 10,
                allowedWallets: [tmf.participant1.address, tmf.participant2.address],
                maxParticipants: 2,
                expiryDate: getUnixTimeStamp() + 86400,
                owner: tmf.redCakeTaskOwner.address,
                isActive: true
            });
            const task = await tmf.redEntity.tasks(taskDetails1);
            expect(task.detailsUrl).to.equal(taskDetails1);
            expect(task.rewardToken).to.equal(tmf.rewardToken.target);
            expect(task.rewardAmount).to.equal(10);
            expect(task.isActive).to.equal(true);
            expect(task.owner).to.equal(tmf.redCakeTaskOwner.address);
        });

        it('should participate in a task', async function () {
            await tmf.redEntity.connect(tmf.participant1).participate(taskDetails1);
            const taskAssignmentStatus = await tmf.redEntity.taskAssignments(taskDetails1, tmf.participant1.address);
            expect(taskAssignmentStatus).to.equal(0);//UNACCEPTED
        });

        it('should accept participation in a task', async function () {
            await tmf.redEntity.connect(tmf.redCakeTaskOwner).acceptParticipant(taskDetails1, tmf.participant1.address);
            const taskAssignmentStatus = await tmf.redEntity.taskAssignments(taskDetails1, tmf.participant1.address);
            expect(taskAssignmentStatus).to.equal(1);//ACCEPTED
        });

        it('should complete a task', async function () {
            await tmf.redEntity.connect(tmf.participant1).completeTask(taskDetails1);
            const taskAssignmentStatus = await tmf.redEntity.taskAssignments(taskDetails1, tmf.participant1.address);
            expect(taskAssignmentStatus).to.equal(2);//COMPLETED
        });

        it('should verify a task', async function () {
            await tmf.redEntity.connect(tmf.redCakeTaskOwner).verifyCompletion(taskDetails1);
            const task = await tmf.redEntity.tasks(taskDetails1);
            const taskAssignmentStatus = await tmf.redEntity.taskAssignments(taskDetails1, tmf.participant1.address);
            expect(task.isActive).to.equal(false);
            expect(taskAssignmentStatus).to.equal(3);//VERIFIED
            expect(await tmf.rewardToken.balanceOf(tmf.participant1.address)).to.equal(10);
        });

    });

});