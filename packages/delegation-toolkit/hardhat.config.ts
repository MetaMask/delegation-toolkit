import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import 'tsconfig-paths/register';
import type { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  gasReporter: {
    enabled: false,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.21',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
            details: {
              yul: false,
            },
          },
        },
      },
    ],
  },
};

export default config;
