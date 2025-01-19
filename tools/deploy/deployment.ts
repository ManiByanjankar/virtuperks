import { randomBytes } from 'crypto';
import { Addressable, uuidV4 } from 'ethers';
import * as dotenv from 'dotenv';
import { commonLib } from './_common';

import { ethers } from 'ethers';

dotenv.config();

interface DeployedContract {
  address: Addressable | string;
  startBlock: number;
}

class SeedProject extends commonLib {
  contracts: Record<string, DeployedContract>;

  constructor() {
    super();
    this.contracts = {};
  }

  async deployCommonContracts(appId: string) {
    const rumsanForwarder = await this.deployContract('ERC2771Forwarder', ['rumsanForwarder']);
    this.contracts['rumsanForwarder'] = {
      address: rumsanForwarder.contract.target,
      startBlock: rumsanForwarder.blockNumber,
    };
    console.log('Forwarder deployed', rumsanForwarder.contract.target);
    const accessManagerV2 = await this.deployContract('AccessManagerV2', []);
    this.contracts['accessManagerV2'] = {
      address: accessManagerV2.contract.target,
      startBlock: accessManagerV2.blockNumber,
    };
    console.log('Access Manager deployed', accessManagerV2.contract.target);
    const rewardToken = await this.deployContract('RewardToken', [
      appId,
      'Rahat',
      'RTH',
      0,
      accessManagerV2.contract.target,
      rumsanForwarder.contract.target
    ]);
    this.contracts['rewardToken'] = {
      address: rewardToken.contract.target,
      startBlock: rewardToken.blockNumber,
    };
    console.log('Reward Token deployed', rewardToken.contract.target);

    return { rumsanForwarder, accessManagerV2, rewardToken };
  }

  async deployEntityContract(accessManagerContract: Addressable | string, appId: string) {
    const entity = await this.deployContract('EntityTaskManager', [accessManagerContract, appId]);
    this.contracts['entity'] = {
      address: entity.contract.target,
      startBlock: entity.blockNumber,
    };
    console.log('Entity Contract deployed', entity.contract.target);
    return { entity };
  }
}

async function main() {
  const seedProject = new SeedProject();
  const RUMSAN_APP_ID = ethers.id('RUMSAN_APP');
  const { accessManagerV2 } = await seedProject.deployCommonContracts(RUMSAN_APP_ID);
  console.log('Common contracts deployed');
  await seedProject.deployEntityContract(accessManagerV2.contract.target, ethers.id('RUMSAN_ENTITY'));
  await seedProject.writeToDeploymentFile('contracts', seedProject.contracts);

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
