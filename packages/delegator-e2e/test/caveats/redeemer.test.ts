import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
} from '@metamask/delegation-toolkit/utils';
import {
  createCaveatBuilder,
  createDelegation,
  createExecution,
  Implementation,
  toMetaMaskSmartAccount,
  ExecutionMode,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';

import {
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  randomBytes,
  fundAddress,
  deployCounter,
  publicClient,
} from '../utils/helpers';
import CounterMetadata from '../utils/counter/metadata.json';
import { Address, createClient, encodeFunctionData, parseEther } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { chain } from '../../src/config';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let aliceCounterAddress: Address;

beforeEach(async () => {
  const client = createClient({ transport, chain });
  const alice = privateKeyToAccount(generatePrivateKey());
  const bob = privateKeyToAccount(generatePrivateKey());

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: alice },
  });

  await deploySmartAccount(aliceSmartAccount);
  await fundAddress(aliceSmartAccount.address, parseEther('2'));

  bobSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });

  const aliceCounter = await deployCounter(aliceSmartAccount.address);
  aliceCounterAddress = aliceCounter.address;
});

test('maincase: Bob redeems the delegation as an allowed redeemer', async () => {
  const newCount = BigInt(randomBytes(32));
  await runTest_expectSuccess(newCount, [bobSmartAccount.address]);
});

test('Bob attempts to redeem the delegation as an unauthorized redeemer', async () => {
  const newCount = BigInt(randomBytes(32));
  const unauthorizedRedeemer = randomBytes(20);
  await runTest_expectFailure(
    newCount,
    [unauthorizedRedeemer],
    'RedeemerEnforcer:unauthorized-redeemer',
  );
});

test('Bob redeems the delegation with multiple allowed redeemers', async () => {
  const newCount = BigInt(randomBytes(32));
  await runTest_expectSuccess(newCount, [
    randomBytes(20),
    bobSmartAccount.address,
    randomBytes(20),
  ]);
});

const runTest_expectSuccess = async (
  newCount: bigint,
  allowedRedeemers: `0x${string}`[],
) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation = createDelegation({
    to: bobAddress,
    from: aliceAddress,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'redeemer',
      allowedRedeemers,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: aliceCounterAddress,
    callData: encodeFunctionData({
      abi: CounterMetadata.abi,
      functionName: 'setCount',
      args: [newCount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [ExecutionMode.SingleDefault],
      encodeExecutionCalldatas([[execution]]),
    ],
  });

  const countBefore = await publicClient.readContract({
    address: aliceCounterAddress,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countBefore, 'Expected initial count to be 0n').toEqual(0n);

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: bobSmartAccount,
    calls: [
      {
        to: bobSmartAccount.address,
        data: redeemData,
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  const countAfter = await publicClient.readContract({
    address: aliceCounterAddress,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countAfter, `Expected final count to be ${newCount}`).toEqual(
    newCount,
  );
};

const runTest_expectFailure = async (
  newCount: bigint,
  allowedRedeemers: `0x${string}`[],
  expectedError: string,
) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation = createDelegation({
    to: bobAddress,
    from: aliceAddress,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'redeemer',
      allowedRedeemers,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: aliceCounterAddress,
    callData: encodeFunctionData({
      abi: CounterMetadata.abi,
      functionName: 'setCount',
      args: [newCount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [ExecutionMode.SingleDefault],
      encodeExecutionCalldatas([[execution]]),
    ],
  });

  const countBefore = await publicClient.readContract({
    address: aliceCounterAddress,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countBefore, 'Expected initial count to be 0n').toEqual(0n);

  await expect(
    sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [
        {
          to: bobSmartAccount.address,
          data: redeemData,
        },
      ],
      ...gasPrice,
    }),
  ).rejects.toThrow(expectedError);

  const countAfter = await publicClient.readContract({
    address: aliceCounterAddress,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countAfter, 'Expected count to remain 0n').toEqual(0n);
};
