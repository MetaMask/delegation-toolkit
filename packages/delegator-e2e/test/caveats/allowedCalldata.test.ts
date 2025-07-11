import { beforeEach, test, expect } from 'vitest';
import {
  createCaveatBuilder,
  createDelegation,
  createExecution,
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  SINGLE_DEFAULT_MODE,
} from '@metamask/delegation-toolkit/utils';
import {
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  deployCounter,
  CounterContract,
  randomBytes,
} from '../utils/helpers';
import {
  createClient,
  encodeFunctionData,
  Hex,
  hexToBigInt,
  slice,
  stringToHex,
} from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { chain } from '../../src/config';

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

/*
  Main test case:

  Alice creates a DeleGatorSmartAccount for a deployed Hybrid Delegator Account, and
  deploys a counter contract.

  Bob creates a DeleGatorSmartAccount for a counterfactual Hybrid Delegator Account.

  Alice creates a delegation to Bob's delegator account, with an AllowedCalldata
  caveat.

  Bob redeems the delegation calling setCount() on the counter contract.
*/

test('maincase: Bob redeems the delegation with the exact calldata', async () => {
  const calldata = randomBytes(32);
  const newCount = hexToBigInt(calldata);

  await runTest_expectSuccess(newCount, [{ from: 4, calldata }]);
});

test('Bob redeems the delegation where the delegation requires a substring of the calldata', async () => {
  const calldata = randomBytes(32);
  const newCount = hexToBigInt(calldata);

  const requiredCalldata = slice(calldata, 0, 34);

  await runTest_expectSuccess(newCount, [
    { from: 4, calldata: requiredCalldata },
  ]);
});

test('Bob redeems the delegation where the calldata matches multiple caveats', async () => {
  const calldata = randomBytes(32);
  const newCount = hexToBigInt(calldata);

  const firstSlice = slice(calldata, 0, 34);
  const secondSlice = slice(calldata, 20);

  await runTest_expectSuccess(newCount, [
    { from: 4, calldata: firstSlice },
    { from: 24, calldata: secondSlice },
  ]);
});

test('Bob attempts to redeem the delegation with incorrect calldata', async () => {
  const newCount = 1n;

  const executedCalldata = encodeFunctionData({
    abi: aliceCounter.abi,
    functionName: 'setCount',
    args: [newCount],
  });

  await runTest_expectFailure(
    executedCalldata,
    [{ from: 0, calldata: randomBytes(32) }],
    'AllowedCalldataEnforcer:invalid-calldata',
  );
});

test('Bob attempts to redeem the delegation with no calldata', async () => {
  const executedCalldata = '0x';

  await runTest_expectFailure(
    executedCalldata,
    [{ from: 0, calldata: randomBytes(32) }],
    'AllowedCalldataEnforcer:invalid-calldata',
  );
});

const runTest_expectSuccess = async (
  newCount: bigint,
  caveats: { from: number; calldata: Hex }[],
) => {
  const { environment } = aliceSmartAccount;

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: caveats.reduce((builder, caveat) => {
      builder.addCaveat('allowedCalldata', caveat.from, caveat.calldata);
      return builder;
    }, createCaveatBuilder(environment)),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const executedCalldata = encodeFunctionData({
    abi: aliceCounter.abi,
    functionName: 'setCount',
    args: [newCount],
  });

  const execution = createExecution({
    target: aliceCounter.address,
    callData: executedCalldata,
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

  const countBefore = await aliceCounter.read.count?.();
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

  const countAfter = await aliceCounter.read.count?.();
  expect(countAfter, `Expected final count to be ${newCount}`).toEqual(
    newCount,
  );
};

const runTest_expectFailure = async (
  executedCalldata: Hex,
  caveats: { from: number; calldata: Hex }[],
  expectedError: string,
) => {
  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: caveats.reduce((builder, caveat) => {
      builder.addCaveat('allowedCalldata', caveat.from, caveat.calldata);
      return builder;
    }, createCaveatBuilder(aliceSmartAccount.environment)),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: aliceCounter.address,
    callData: executedCalldata,
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
  ).rejects.toThrow(stringToHex(expectedError));

  const counterAfter = await aliceCounter.read.count?.();
  expect(counterAfter, 'Expected count to remain 0n').toEqual(0n);
};
