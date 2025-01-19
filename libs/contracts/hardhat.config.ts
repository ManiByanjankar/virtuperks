import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config();
const chainIds = {
  ganache: 31337,
  sepolia: 11155111,
};

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './src',
    tests: './tests',
    cache: './build/cache',
    artifacts: './build/artifacts',
  },

  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
  },

  networks: {
    ganache: {
      chainId: chainIds.ganache,
      url: 'http://127.0.0.1:8545',
    },

  },
};

export default config;
