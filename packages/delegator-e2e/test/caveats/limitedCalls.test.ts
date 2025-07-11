import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  SINGLE_DEFAULT_MODE,
} from '@metamask/delegation-toolkit/utils';
import {
  createCaveatBuilder,
  createDelegation,
  createExecution,
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';

import {
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  deployCounter,
  CounterContract,
  publicClient,
  randomBytes,
} from '../utils/helpers';
import {
  createClient,
  encodeFunctionData,
  hexToBigInt,
  stringToHex,
} from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { chain } from '../../src/config';
import CounterMetadata from '../utils/counter/metadata.json';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let aliceCounter: CounterContract;

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

  bobSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });

  aliceCounter = await deployCounter(aliceSmartAccount.address);
});

test('maincase: Bob redeems the delegation the allowed number of calls', async () => {
  const limit = 3;

  await runTest_expectSuccess(limit, limit);
});

test('Bob redeems the delegation less than the allowed number of calls', async () => {
  const limit = 3;

  await runTest_expectSuccess(limit, limit - 1);
});

test('Bob attempts to redeem the delegation more than the allowed limit', async () => {
  const limit = 3;
  const runs = limit + 1;

  await runTest_expectFailure(
    limit,
    runs,
    'LimitedCallsEnforcer:limit-exceeded',
  );
});

const runTest_expectSuccess = async (limit: number, runs: number) => {
  return runTest(limit, runs);
};

const runTest_expectFailure = async (
  limit: number,
  runs: number,
  expectedError: string,
) => {
  await expect(runTest(limit, runs)).rejects.toThrow(
    stringToHex(expectedError),
  );
};

const runTest = async (limit: number, runs: number) => {
  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'limitedCalls',
      limit,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  for (let i = 0; i < runs; i++) {
    const newCount = hexToBigInt(randomBytes(32));
    const calldata = encodeFunctionData({
      abi: CounterMetadata.abi,
      functionName: 'setCount',
      args: [newCount],
    });

    const execution = createExecution({
      target: aliceCounter.address,
      callData: calldata,
    });

    const redeemData = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        encodePermissionContexts([[signedDelegation]]),
        [SINGLE_DEFAULT_MODE],
        encodeExecutionCalldatas([[execution]]),
      ],
    });

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
      address: aliceCounter.address,
      abi: CounterMetadata.abi,
      functionName: 'count',
    });

    expect(countAfter).toEqual(newCount);
  }
};
