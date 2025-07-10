import { createPublicClient, http } from 'viem';

import { DELEGATOR_CONTRACTS } from '../src/index';
import { compareVersions } from 'compare-versions';
import {
  chains,
  rpcUrlOverrides,
} from '../script/validate-contract-deployments';
/*
  This test validates that the DeleGator contracts are deployed on the specified chains, 
  as specified in the @metamask-private/delegation-deployments package.

  It does this by getting the DeleGatorEnvironment for each chain and then ensuring that 
  code is found at the expected address for each contract.
*/

const latestVersion = Object.keys(DELEGATOR_CONTRACTS).reduce(
  (acc, version) => {
    if (compareVersions(version, acc) === 1) {
      return version;
    }
    return acc;
  },
  '0.0.0',
);

const latestContracts = DELEGATOR_CONTRACTS[latestVersion];

const chainIds = Object.keys(latestContracts);

let hasFailed = false;

const allChainValidations = chainIds.map(async (chainIdAsString) => {
  const chainId = parseInt(chainIdAsString);
  const contracts = latestContracts[chainIdAsString];

  const transport = http(rpcUrlOverrides[chainId]);
  const chain = Object.values(chains).find((c) => c.id === chainId);

  if (!chain) {
    throw new Error(`Chain ${chainId} not found`);
  }

  const publicClient = createPublicClient({
    chain,
    transport,
  });

  const contractNames = Object.keys(contracts);

  const allContracts = contractNames.map(async (contractName) => {
    const contractAddress = contracts[contractName];

    const code = await publicClient.getCode({ address: contractAddress });

    if (code === '0x') {
      console.error(
        `${chain.name}: ${contractName} is not deployed at ${contractAddress}`,
      );
      hasFailed = true;
    }
  });

  await Promise.all(allContracts);

  console.log(`${chain.name} succeeded`);
});

Promise.all(allChainValidations).then(() => {
  if (hasFailed) {
    process.exitCode = 1;
    console.error('Failed to validate contract deployments');
  } else {
    console.log('Successfully validated contract deployments');
  }
});
