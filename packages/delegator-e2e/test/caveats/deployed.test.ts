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
  getCreate2Address,
  Hex,
  hexToBigInt,
  isHex,
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

/*
  Main test case:

  Alice creates a DeleGatorSmartAccount for a deployed Hybrid Delegator Account.

  Bob creates a DeleGatorSmartAccount for a counterfactual Hybrid Delegator Account.

  Alice creates a delegation to Bob's delegator account, with a Deployed
  caveat that specifies a Counter contract to be deployed.

  Bob redeems the delegation, which deploys the Counter contract and calls
  setCount() on it.
*/

test('maincase: Bob redeems the delegation, calling setCount() on the Counter that is deployed via the caveat', async () => {
  const salt = randomBytes(32);
  const deployedAddress = getCreate2Address({
    salt,
    from: aliceSmartAccount.environment.caveatEnforcers.DeployedEnforcer!,
    bytecode: CounterMetadata.bytecode.object as Hex,
  });

  const code = await publicClient.getCode({
    address: deployedAddress,
  });

  expect(code).toBeUndefined();

  await runTest_expectSuccess(deployedAddress, salt);
});

test('Bob redeems the delegation, even though the counter is already deployed', async () => {
  const salt = randomBytes(32);
  const deployedAddress = getCreate2Address({
    salt,
    from: aliceSmartAccount.environment.caveatEnforcers.DeployedEnforcer!,
    bytecode: CounterMetadata.bytecode.object as Hex,
  });

  await runTest_expectSuccess(deployedAddress, salt);

  const code = await publicClient.getCode({
    address: deployedAddress,
  });

  expect(isHex(code), 'Counter contract should be deployed').toBeTruthy();

  // we now run the test again, but this time the counter is already deployed
  await runTest_expectSuccess(deployedAddress, salt);
});

test('Bob attempts to redeem the delegation, but provides the wrong address', async () => {
  const salt = randomBytes(32);
  const deployedAddress = randomBytes(20);

  const code = await publicClient.getCode({
    address: deployedAddress,
  });

  expect(code).toBeUndefined();

  await runTest_expectFailure(
    deployedAddress,
    salt,
    'DeployedEnforcer:deployed-address-mismatch',
  );
});

test('Bob attempts to redeem the delegation, but provides the wrong bytecode', async () => {
  const salt = randomBytes(32);
  const bytecode = randomBytes(32);
  const deployedAddress = getCreate2Address({
    salt,
    from: aliceSmartAccount.environment.caveatEnforcers.DeployedEnforcer!,
    bytecode,
  });

  const code = await publicClient.getCode({
    address: deployedAddress,
  });

  expect(code).toBeUndefined();

  await runTest_expectFailure(
    deployedAddress,
    salt,
    'DeployedEnforcer:deployed-address-mismatch',
  );
});

const runTest_expectSuccess = async (deployedAddress: Hex, salt: Hex) => {
  const newCount = hexToBigInt(randomBytes(32));

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'deployed',
      deployedAddress,
      salt,
      CounterMetadata.bytecode.object as Hex,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const calldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'setCount',
    args: [newCount],
  });

  const execution = createExecution({
    target: deployedAddress,
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

  const counterCodeAfter = await publicClient.getCode({
    address: deployedAddress,
  });

  expect(
    isHex(counterCodeAfter),
    'Counter contract should be deployed',
  ).toBeTruthy();

  const countAfter = await publicClient.readContract({
    address: deployedAddress,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });

  expect(countAfter).toEqual(newCount);
};

const runTest_expectFailure = async (
  deployedAddress: Hex,
  salt: Hex,
  expectedError: string,
) => {
  const newCount = hexToBigInt(randomBytes(32));

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'deployed',
      deployedAddress,
      salt,
      CounterMetadata.bytecode.object as Hex,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const calldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'setCount',
    args: [newCount],
  });

  const execution = createExecution({
    target: deployedAddress,
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

  const counterCodeAfter = await publicClient.getCode({
    address: deployedAddress,
  });

  expect(
    counterCodeAfter,
    'Counter contract should still not be deployed',
  ).toBeUndefined();
};
