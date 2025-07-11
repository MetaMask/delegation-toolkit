import { beforeEach, expect, test } from 'vitest';
import {
  publicClient,
  deployCounter,
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  stringToUnprefixedHex,
} from './utils/helpers';
import { expectCodeAt, expectUserOperationToSucceed } from './utils/assertions';

import {
  createExecution,
  createDelegation,
  ExecutionMode,
  Implementation,
  toMetaMaskSmartAccount,
  signDelegation,
  aggregateSignature,
  type MetaMaskSmartAccount,
  type PartialSignature,
} from '@metamask/delegation-toolkit';
import {
  createCaveatBuilder,
  encodePermissionContexts,
  encodeExecutionCalldatas,
} from '@metamask/delegation-toolkit/utils';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import {
  createClient,
  encodeFunctionData,
  getContract,
  Address,
  createWalletClient,
} from 'viem';
import { chain } from '../src/config';
import CounterMetadata from './utils/counter/metadata.json';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let aliceCounterContractAddress: Address;

beforeEach(async () => {
  const alice = privateKeyToAccount(generatePrivateKey());
  const bob = privateKeyToAccount(generatePrivateKey());

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x',
    signatory: { account: alice },
  });
  await deploySmartAccount(aliceSmartAccount);

  bobSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x',
    signatory: { account: bob },
  });

  const aliceCounter = await deployCounter(aliceSmartAccount.address);
  aliceCounterContractAddress = aliceCounter.address;
});

/*
  Alice creates a DeleGatorSmartAccount for a counterfactual Hybrid delegator account.

  A Counter contract is deployed, with Alice's delegator account
  as the owner.

  Bob creates a DeleGatorSmartAccount for a counterfactual Hybrid Delegator Account.
  
  Alice creates a delegation to Bob's delegator account, permitting him to increment
  the counter.

  Bob submits a User Operation, using the delegation, which deploys his delegator
  account and increment's Alice's counter.
*/

test('maincase: Bob increments the counter with a delegation from Alice', async () => {
  const counterContract = getContract({
    address: aliceCounterContractAddress,
    abi: CounterMetadata.abi,
    client: publicClient,
  });

  const countBefore = await counterContract.read.count();

  expect(countBefore, 'Expected initial count to be 0n').toEqual(0n);

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment)
      .addCaveat('allowedTargets', {
        targets: [aliceCounterContractAddress],
      })
      .addCaveat('allowedMethods', { selectors: ['increment()'] }),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: aliceCounterContractAddress,
    callData: encodeFunctionData({
      abi: CounterMetadata.abi,
      functionName: 'increment',
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

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: bobSmartAccount,
    calls: [
      {
        to: bobSmartAccount.address,
        value: 0n,
        data: redeemData,
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  await expectCodeAt(
    bobSmartAccount.address,
    `Expected code to be deployed to Bob's gator address: ${bobSmartAccount.address}`,
  );

  const countAfter = await counterContract.read.count();

  expect(countAfter, 'Expected final count to have incremented').toEqual(1n);
});

test('Bob attempts to increment the counter without a delegation', async () => {
  const counterContract = getContract({
    address: aliceCounterContractAddress,
    abi: CounterMetadata.abi,
    client: publicClient,
  });

  const countBefore = await counterContract.read.count();
  expect(countBefore, 'Expected initial count to be 0n').toEqual(0n);

  const incrementData = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const expectedError = 'Ownable: caller is not the owner';

  await expect(
    sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [
        {
          to: aliceCounterContractAddress,
          value: 0n,
          data: incrementData,
        },
      ],
      ...gasPrice,
    }),
  ).rejects.toThrow(stringToUnprefixedHex(expectedError));

  const countAfter = await counterContract.read.count();
  expect(countAfter, 'Expected final count to be 0n').toEqual(0n);
});

test("Bob attempts to increment the counter with a delegation from Alice that doesn't allow calls to `increment()`", async () => {
  const counterContract = getContract({
    address: aliceCounterContractAddress,
    abi: CounterMetadata.abi,
    client: publicClient,
  });

  const countBefore = await counterContract.read.count();
  expect(countBefore, 'Expected initial count to be 0n').toEqual(0n);

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment)
      .addCaveat('allowedTargets', {
        targets: [aliceCounterContractAddress],
      })
      .addCaveat('allowedMethods', { selectors: ['notTheRightFunction()'] }),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: aliceCounterContractAddress,
    callData: encodeFunctionData({
      abi: CounterMetadata.abi,
      functionName: 'increment',
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

  const expectedError = 'AllowedMethodsEnforcer:method-not-allowed';

  await expect(
    sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [
        {
          to: bobSmartAccount.address,
          value: 0n,
          data: redeemData,
        },
      ],
      ...gasPrice,
    }),
  ).rejects.toThrow(stringToUnprefixedHex(expectedError));

  const countAfter = await counterContract.read.count();
  expect(countAfter, 'Expected final count to be 0n').toEqual(0n);
});

test('Bob increments the counter with a delegation from a multisig account', async () => {
  const signers = [
    privateKeyToAccount(generatePrivateKey()),
    privateKeyToAccount(generatePrivateKey()),
    privateKeyToAccount(generatePrivateKey()),
  ];
  // take all but the first signer as the signatory
  const signatory = signers.slice(1).map((account) => ({
    account,
  }));

  const multisigSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.MultiSig,
    deployParams: [signers.map((account) => account.address), 2n],
    deploySalt: '0x',
    signatory,
  });
  await deploySmartAccount(multisigSmartAccount);

  const counterContract = await deployCounter(multisigSmartAccount.address);

  const countBefore = await counterContract.read.count();
  expect(countBefore, 'Expected initial count to be 0n').toEqual(0n);

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: multisigSmartAccount.address,
    caveats: createCaveatBuilder(multisigSmartAccount.environment)
      .addCaveat('allowedTargets', {
        targets: [counterContract.address],
      })
      .addCaveat('allowedMethods', { selectors: ['increment()'] }),
  });

  // Get signatures from each signer
  const signatures: PartialSignature[] = await Promise.all(
    signers.slice(1).map(async (signer) => {
      const wallet = createWalletClient({ account: signer, transport, chain });
      const signature = await signDelegation({
        signer: wallet,
        delegation,
        delegationManager: multisigSmartAccount.environment.DelegationManager,
        chainId: chain.id,
      });

      return {
        signature,
        signer: signer.address,
        type: 'ECDSA',
      };
    }),
  );

  // Combine signatures into a single signature
  const signature = aggregateSignature({ signatures });

  const signedDelegation = {
    ...delegation,
    signature,
  };

  const execution = createExecution({
    target: counterContract.address,
    callData: encodeFunctionData({
      abi: CounterMetadata.abi,
      functionName: 'increment',
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

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: bobSmartAccount,
    calls: [
      {
        to: bobSmartAccount.address,
        value: 0n,
        data: redeemData,
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  await expectCodeAt(
    bobSmartAccount.address,
    `Expected code to be deployed to Bob's gator address: ${bobSmartAccount.address}`,
  );

  const countAfter = await counterContract.read.count();
  expect(countAfter, 'Expected final count to have incremented').toEqual(1n);
});
