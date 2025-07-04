import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  SINGLE_DEFAULT_MODE,
} from '@metamask/delegation-toolkit/utils';
import {
  createExecution,
  Delegation,
  Implementation,
  ROOT_AUTHORITY,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import { createCaveatBuilder } from '@metamask/delegation-toolkit/utils';
import {
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  deployCounter,
  CounterContract,
  randomBytes,
} from '../utils/helpers';
import { createClient, encodeFunctionData, Hex } from 'viem';
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

/*
  Main test case:
  
  Alice creates a DeleGatorSmartAccount for a deployed Hybrid Delegator Account, and
  deploys a counter contract.
  
  Bob creates a DeleGatorSmartAccount for a counterfactual Hybrid Delegator Account.
  
  Alice creates a delegation to Bob's delegator account, with an AllowedTargets
  caveat specifying the address of the counter contract.
  
  Bob redeems the delegation with a call to the increment() function
  on the counter contract.
*/

test('maincase: Bob redeems the delegation with an allowed target', async () => {
  const allowedTargets = [aliceCounter.address];
  const calledTarget = aliceCounter.address;

  await runTest_expectSuccess(allowedTargets, calledTarget);
});

test('Bob redeems the delegation where the delegation allows multiple targets', async () => {
  const allowedTargets = [
    randomBytes(20),
    aliceCounter.address,
    randomBytes(20),
  ];

  const calledTarget = aliceCounter.address;
  await runTest_expectSuccess(allowedTargets, calledTarget);
});

test("Bob attempts to redeem the delegation where the allowed target is not Alice's counter", async () => {
  const allowedTarget = randomBytes(20);
  const calledTarget = aliceCounter.address;

  await runTest_expectFailure(
    [allowedTarget],
    calledTarget,
    'AllowedTargetsEnforcer:target-address-not-allowed',
  );
});

const runTest_expectSuccess = async (
  allowedTargets: Hex[],
  calledTarget: Hex,
) => {
  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    authority: ROOT_AUTHORITY,
    caveats: createCaveatBuilder(aliceSmartAccount.environment)
      .addCaveat('allowedTargets', { targets: allowedTargets })
      .build(),
    salt: '0x',
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const calldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
    args: [],
  });

  const execution = createExecution({
    target: calledTarget,
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

  const countBefore = await aliceCounter.read.count();
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

  const countAfter = await aliceCounter.read.count();
  expect(countAfter, 'Expected final count to be 1n').toEqual(1n);
};

const runTest_expectFailure = async (
  allowedTargets: Hex[],
  calledTarget: Hex,
  expectedError: string,
) => {
  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    authority: ROOT_AUTHORITY,
    caveats: createCaveatBuilder(aliceSmartAccount.environment)
      .addCaveat('allowedTargets', { targets: allowedTargets })
      .build(),
    salt: '0x',
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const calldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
    args: [],
  });

  const execution = createExecution({
    target: calledTarget,
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

  const counterAfter = await aliceCounter.read.count();
  expect(counterAfter, 'Expected count to remain 0n').toEqual(0n);
};
