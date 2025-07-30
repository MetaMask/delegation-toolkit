import {
  type MetaMaskSmartAccount,
  Implementation,
} from '@metamask/delegation-toolkit';

import {
  bytesToHex,
  Client,
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  getContract,
  GetContractReturnType,
  http,
  parseEther,
  stringToHex,
  type Abi,
  type Address,
  type Hex,
} from 'viem';
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts';

import CounterMetadata from '../utils/counter/metadata.json';
import * as ERC20Token from '../../contracts/out/ERC20Token.sol/ERC20Token.json';
import {
  chain,
  nodeUrl,
  deployPk,
  bundlerUrl,
  paymasterUrl,
} from '../../src/config';
import {
  createPaymasterClient,
  createBundlerClient as createAABundlerClient,
  BundlerClient,
} from 'viem/account-abstraction';

const {
  abi: erc20TokenAbi,
  bytecode: { object: erc20TokenBytecode },
} = ERC20Token;

export const transport = http(nodeUrl);
const deployerAccount = privateKeyToAccount(deployPk);

export const gasPrice = {
  // gas price is 1n because test network.
  maxFeePerGas: 1n,
  maxPriorityFeePerGas: 1n,
};

export const publicClient = createPublicClient({ transport, chain });
export const deployerClient = createWalletClient({
  transport,
  chain,
  account: deployerAccount,
});
const paymasterClient = createPaymasterClient({
  transport: http(paymasterUrl),
});

const sendUserOperationImmediately = (client: Client) => ({
  sendUserOperation: async (
    ...args: Parameters<BundlerClient['sendUserOperation']>
  ) => {
    const result = await (client as BundlerClient).sendUserOperation(...args);
    // we request the bundler to send the bundle now, causing the useroperation to be executed immediately
    await (client as any).request({
      method: 'debug_bundler_sendBundleNow',
    });
    return result;
  },
});

export const sponsoredBundlerClient = createAABundlerClient({
  transport: http(bundlerUrl),
  paymaster: paymasterClient,
  chain,
  pollingInterval: 100,
}).extend(sendUserOperationImmediately);

export const unsponsoredBundlerClient = createAABundlerClient({
  transport: http(bundlerUrl),
  chain,
  pollingInterval: 100,
}).extend(sendUserOperationImmediately);

export const randomSalt = () => randomBytes(32);

export const randomBytes = (byteLength: number): Hex => {
  const randomBytes = new Uint8Array(byteLength).map(() =>
    Math.floor(Math.random() * 256),
  );
  return bytesToHex(randomBytes);
};

export const fundAddress = async (
  to: Address,
  value: bigint = parseEther('1'),
) => {
  const txHash = await deployerClient.sendTransaction({
    to,
    value,
  });

  await publicClient.waitForTransactionReceipt({ hash: txHash });
};

export const deploySmartAccount = async (
  account: MetaMaskSmartAccount<Implementation>,
) => {
  const { factory, factoryData } = await account.getFactoryArgs();

  const transactionHash = await deployerClient.sendTransaction({
    to: factory,
    data: factoryData,
  });

  await publicClient.waitForTransactionReceipt({ hash: transactionHash });
};

export type CounterContract = GetContractReturnType<
  typeof CounterMetadata.abi,
  Client,
  Address
>;

export const deployCounter = async (owner: Hex) => {
  // Deploy the counter contract using Viem's deployContract
  const hash = await deployerClient.deployContract({
    abi: CounterMetadata.abi as Abi,
    bytecode: CounterMetadata.bytecode.object as Hex,
  });

  // Wait for the transaction receipt to get the deployed contract address
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (!receipt.contractAddress) {
    throw new Error(
      'Failed to deploy counter contract - no contract address in receipt',
    );
  }

  const aliceCounter = getContract({
    abi: CounterMetadata.abi,
    address: receipt.contractAddress,
    client: deployerClient,
  });

  await aliceCounter.write.transferOwnership([owner]);

  return aliceCounter;
};

export const deployErc20Token = async () => {
  // Deploy the ERC20 token contract using Viem's deployContract with constructor args
  const hash = await deployerClient.deployContract({
    abi: erc20TokenAbi as Abi,
    bytecode: erc20TokenBytecode as Hex,
    args: [parseEther('1000000000')],
  });

  // Wait for the transaction receipt to get the deployed contract address
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (!receipt.contractAddress) {
    throw new Error(
      'Failed to deploy ERC20 token contract - no contract address in receipt',
    );
  }

  return receipt.contractAddress;
};

export const fundAddressWithErc20Token = async (
  to: Address,
  erc20TokenAddress: Hex,
  value: bigint = parseEther('100'),
) => {
  const data = encodeFunctionData({
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [],
      },
    ],
    functionName: 'mint',
    args: [to, value],
  });

  const txHash = await deployerClient.sendTransaction({
    to: erc20TokenAddress,
    data,
  });

  await publicClient.waitForTransactionReceipt({ hash: txHash });
};

export const getErc20Balance = async (address: Hex, erc20TokenAddress: Hex) => {
  return publicClient.readContract({
    address: erc20TokenAddress,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: [address],
  });
};

export const randomAddress = (lowerCase: boolean = false) => {
  const address = privateKeyToAddress(generatePrivateKey());
  if (!lowerCase) {
    return address;
  }

  return address.toLowerCase() as Hex;
};
