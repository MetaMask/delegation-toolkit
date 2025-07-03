import hre from 'hardhat';
import { bytesToHex } from 'viem';
import type {
  Chain,
  Hex,
  Transport,
  WalletClient,
  PublicClient,
  Account,
} from 'viem';
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts';

import { Implementation } from '../src/constants';
import { deployDeleGatorEnvironment } from '../src/delegatorEnvironment';
import type { ToMetaMaskSmartAccountParameters } from '../src/types';

export const OWNER_ACCOUNT: Account = privateKeyToAccount(generatePrivateKey());
export const DEPLOYED_ADDRESS = privateKeyToAddress(generatePrivateKey());
export const SALT = '0x12345678901234567890123456789';
export const KEY_ID = 'key_id';
export const PRIVATE_KEY_X =
  84850618693854697637529454900222230892363302307746047368140175107268835558762n;
export const PRIVATE_KEY_Y =
  3540107420755600117661092318610451508057836103782892212756062701855335759222n;
export const THRESHOLD = 1;

export const randomAddress = (lowerCase = false) => {
  const address = privateKeyToAddress(generatePrivateKey());
  if (!lowerCase) {
    return address;
  }

  return address.toLowerCase() as Hex;
};

export const randomBytes = (byteLength: number): Hex => {
  const bytes = new Uint8Array(byteLength).map(() =>
    Math.floor(Math.random() * 256),
  );
  return bytesToHex(bytes);
};

export const counterfactualAccountConfig: ToMetaMaskSmartAccountParameters<Implementation.Hybrid> =
  {
    client: {} as PublicClient,
    implementation: Implementation.Hybrid,
    deployParams: [
      OWNER_ACCOUNT.address,
      [KEY_ID],
      [PRIVATE_KEY_X],
      [PRIVATE_KEY_Y],
    ],
    signatory: { account: OWNER_ACCOUNT },
    deploySalt: SALT,
  };

export const multiSigAccountConfig: ToMetaMaskSmartAccountParameters<Implementation.MultiSig> =
  {
    client: {} as PublicClient,
    implementation: Implementation.MultiSig,
    deployParams: [[OWNER_ACCOUNT.address], 1n],
    deploySalt: SALT,
    signatory: [{ account: OWNER_ACCOUNT }],
  };

export const deployedAccountConfig: ToMetaMaskSmartAccountParameters<Implementation.Hybrid> =
  {
    client: {} as PublicClient,
    implementation: Implementation.Hybrid,
    address: DEPLOYED_ADDRESS,
    signatory: { account: OWNER_ACCOUNT },
  };

/**
 * Sets up a development environment by deploying the DeleGator infrastructure.
 *
 * @param walletClient - The wallet client used to sign and send transactions.
 * @param publicClient - The public client used to interact with the blockchain.
 * @param chain - The chain where the contracts will be deployed.
 * @returns A promise that resolves to the deployed DeleGator environment.
 */
export async function setupDevelopmentEnvironment(
  walletClient: WalletClient,
  publicClient: PublicClient,
  chain: Chain,
) {
  return await deployDeleGatorEnvironment(walletClient, publicClient, chain);
}

/**
 * Creates a custom Hardhat provider transport for Viem.
 *
 * @returns A promise that resolves to a Transport object connected to the Hardhat network.
 */
export async function createHardhatTransport(): Promise<Transport> {
  const viem = await import('viem');
  return viem.custom(hre.network.provider);
}

/**
 * Invokes a factory contract with the provided factory data to deploy a new contract.
 *
 * @param client - The wallet client used to sign and send the transaction.
 * @param chain - The chain where the transaction will be sent.
 * @param factoryAddress - The address of the factory contract to call.
 * @param factoryData - The calldata to send to the factory contract.
 * @returns A promise that resolves to the transaction hash.
 */
export async function invokeFactoryData(
  client: WalletClient,
  chain: Chain,
  factoryAddress: Hex,
  factoryData: Hex,
) {
  if (!client.account) {
    throw new Error('Client does not have an account');
  }

  const { account } = client;

  return await client.sendTransaction({
    chain,
    to: factoryAddress,
    data: factoryData,
    account,
  });
}
