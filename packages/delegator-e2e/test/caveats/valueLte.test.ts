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
  fundAddress,
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
} from '../utils/helpers';
import { createClient, encodeFunctionData, parseEther } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { chain } from '../../src/config';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;

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

  await fundAddress(await aliceSmartAccount.address, parseEther('2'));
});

/*
  Main test case:

  Alice creates a DeleGatorSmartAccount for a deployed Hybrid Delegator Account.
  Bob creates a DeleGatorSmartAccount for a counterfactual Hybrid Delegator Account.

  Alice creates a delegation to Bob's delegator account, with a ValueLte
  caveat that limits the maximum value of native tokens Bob can spend.

  Bob redeems the delegation by sending a transaction with a value within
  the specified limit.
*/

test('maincase: Bob redeems the delegation with a value within the specified limit', async () => {
  const maxValue = parseEther('1'); // 1 ETH
  const executionValue = parseEther('0.5'); // 0.5 ETH

  await runTest_expectSuccess(maxValue, executionValue);
});

test('Bob redeems the delegation with the maximum allowed value', async () => {
  const maxValue = parseEther('1'); // 1 ETH
  const executionValue = parseEther('1'); // 1 ETH

  await runTest_expectSuccess(maxValue, executionValue);
});

test('Bob redeems the delegation with a very small value', async () => {
  const maxValue = parseEther('1'); // 1 ETH
  const executionValue = parseEther('0.000001'); // 0.000001 ETH

  await runTest_expectSuccess(maxValue, executionValue);
});

test('Bob attempts to redeem the delegation with a value exceeding the specified limit', async () => {
  const maxValue = parseEther('1'); // 1 ETH
  const executionValue = parseEther('1.5'); // 1.5 ETH

  await runTest_expectFailure(
    maxValue,
    executionValue,
    'ValueLteEnforcer:value-too-high',
  );
});

test('Bob attempts to redeem the delegation where the value is 0', async () => {
  const maxValue = 0n;
  const executionValue = 1n;

  await runTest_expectFailure(
    maxValue,
    executionValue,
    'ValueLteEnforcer:value-too-high',
  );
});

const submitUserOperationForTest = async (
  maxValue: bigint,
  executionValue: bigint,
) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation: Delegation = {
    delegate: bobAddress,
    delegator: aliceAddress,
    authority: ROOT_AUTHORITY,
    caveats: createCaveatBuilder(aliceSmartAccount.environment)
      .addCaveat('valueLte', { maxValue })
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

  const execution = createExecution({
    target: bobAddress,
    value: executionValue,
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

  return sponsoredBundlerClient.sendUserOperation({
    account: bobSmartAccount,
    calls: [
      {
        to: bobSmartAccount.address,
        data: redeemData,
      },
    ],
    ...gasPrice,
  });
};

const runTest_expectSuccess = async (
  maxValue: bigint,
  executionValue: bigint,
) => {
  const useroperationHash = await submitUserOperationForTest(
    maxValue,
    executionValue,
  );

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: useroperationHash,
  });

  expectUserOperationToSucceed(receipt);
};

const runTest_expectFailure = async (
  maxValue: bigint,
  executionValue: bigint,
  expectedError: string,
) => {
  await expect(
    submitUserOperationForTest(maxValue, executionValue),
  ).rejects.toThrow(expectedError);
};
