import { randomBytes } from 'crypto';
import { uuidV4 } from 'ethers';
import * as dotenv from 'dotenv';
import { commonLib } from './_common';

import { ethers } from 'ethers';

dotenv.config();

interface DeployedContract {
  address: string;
  startBlock: number;
}

class SeedProject extends commonLib {
  contracts: Record<string, DeployedContract>;

  constructor() {
    super();
    this.contracts = {};
  }

  static getUUID() {
    return uuidV4(randomBytes(16));
  }

  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // public async deployAccessManagerContract() {
  //   const AccessManager = await this.deployContract('AccessManagerV2', []);

  //   this.contracts['RahatToken'] = {
  //     address: AccessManager.contract.target as string,

  //     startBlock: AccessManager.blockNumber,
  //   };
  //   console.log(
  //     this.contracts.RahatToken.address,
  //     'AccessManagercontractAddress'
  //   );
  // }

  // public async deployRewardSystemContract() {
  //   const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  //   const appId = ethers.encodeBytes32String('myAppId');

  //   console.log(appId, 'appId');
  //   const RewardSystem = await this.deployContract('RewardSystem', [
  //     address,
  //     appId,
  //   ]);

  //   this.contracts['RahatToken'] = {
  //     address: RewardSystem.contract.target as string,
  //     startBlock: RewardSystem.blockNumber,
  //   };
  // }

  public async deployRewardToken() {
    // const appId = ethers.id('RewardTokenId');
    const appId =
      '0xa1fc19c2993ca75efe2fe53553345fe836c6ba997a4c9a694ac03793180eb23f';
    const name = 'RewardToken';
    const symbol = 'RTK';
    const decimals = 18;
    //my contract address
    const accessManager = '0x127359CD56487f76307b186651ddbf684B9c2dFE';
    const forwarder = '0x127359CD56487f76307b186651ddbf684B9c2dFE';
    const RewardToken = await this.deployContract('RewardToken', [
      appId,
      name,
      symbol,
      decimals,
      accessManager,
      forwarder,
    ]);

    this.contracts['RahatToken'] = {
      address: RewardToken.contract.target as string,
      startBlock: RewardToken.blockNumber,
    };
    console.log(this.contracts.RahatToken.address, 'RewardTokencontractAddress');
  }
}

async function main() {
  const seedProject = new SeedProject();
  // await seedProject.deployAccessManagerContract();
  //await seedProject.deployRewardToknen();
  await seedProject.deployRewardToken();
  //console.log(seedProject.contracts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
