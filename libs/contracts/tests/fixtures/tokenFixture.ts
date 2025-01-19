import hre from "hardhat";
import { ethers } from "ethers";
import { AccessManagerV2, RewardToken, ERC2771Forwarder } from '../../typechain-types'

export interface TokenFixture {
    accessManagerV2: AccessManagerV2;
    rumsanForwarder: ERC2771Forwarder;
    rewardToken: RewardToken;
    deployer: ethers.Signer;
    signers: ethers.Signer[];
}
export const deployRahatTokenFixture = async function (): Promise<TokenFixture> {
    console.log("deploying fixtures");
    const [deployer, ...signers] = await hre.ethers.getSigners();
    const tokenAppId = hre.ethers.id('TOKEN_APP');
    const rumsanForwarder = await hre.ethers.deployContract("ERC2771Forwarder", ['rumsanForwarder']);
    const accessManagerV2 = await hre.ethers.deployContract("AccessManagerV2", []);
    const rewardToken = await hre.ethers.deployContract("RewardToken",
        [tokenAppId, "Rahat", "RTH", 0, accessManagerV2.target, rumsanForwarder.target]);
    await accessManagerV2.connect(deployer).createApp(tokenAppId, deployer.address);
    console.log('fixtures deployed')
    return {
        rumsanForwarder,
        accessManagerV2,
        rewardToken,
        deployer,
        signers
    };
}