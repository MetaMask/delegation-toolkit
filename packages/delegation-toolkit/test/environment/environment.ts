import type { Abi, Chain, Hex, PublicClient, WalletClient } from 'viem';

import type { DeployedContract } from '../../src/smartAccountsEnvironment';
import type { ContractMetaData } from '../../src/types';
import { deployContract } from '../../src/write';
import {
  abi as counterAbi,
  bytecode as counterBytecode,
} from './metadata/counter/metadata.json';

const Counter: ContractMetaData = {
  abi: counterAbi as Abi,
  bytecode: counterBytecode.object as Hex,
};

/**
 * Deploys a Counter contract for testing purposes.
 *
 * @param walletClient - The wallet client used to sign and send the deployment transaction.
 * @param publicClient - The public client used to interact with the blockchain.
 * @param chain - The chain where the contract will be deployed.
 * @returns A promise that resolves to the deployed contract object with its name and address.
 */
export async function deployCounter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  chain: Chain,
): Promise<DeployedContract> {
  const counter = await deployContract(
    walletClient,
    publicClient,
    chain,
    Counter,
  );

  return { name: 'counter', ...counter };
}
