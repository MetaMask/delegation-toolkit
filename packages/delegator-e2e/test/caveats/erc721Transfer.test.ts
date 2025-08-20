import { beforeEach, test, expect } from 'vitest';
import {
  createExecution,
  Implementation,
  toMetaMaskSmartAccount,
  ExecutionMode,
  ROOT_AUTHORITY,
  createDelegation,
} from '@metamask/delegation-toolkit';
import type {
  MetaMaskSmartAccount,
  Delegation,
} from '@metamask/delegation-toolkit';
import {
  createCaveatBuilder,
  encodeExecutionCalldatas,
  encodePermissionContexts,
} from '@metamask/delegation-toolkit/utils';

import {
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  publicClient,
  randomAddress,
  deployErc721Token,
  mintErc721Token,
  getErc721Balance,
  getErc721Owner,
  stringToUnprefixedHex,
} from '../utils/helpers';
import { encodeFunctionData } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

let aliceSmartAccount: MetaMaskSmartAccount;
let bobSmartAccount: MetaMaskSmartAccount;
let erc721TokenAddress: `0x${string}`;
let tokenId: bigint;

/**
 * These tests verify the ERC721 transfer caveat functionality.
 *
 * The ERC721 transfer caveat ensures that:
 * 1. Only the specified ERC721 token can be transferred
 * 2. Only the specified token ID can be transferred
 *
 * Alice creates a delegation to Bob with an ERC721 transfer caveat.
 * Bob redeems the delegation with ERC721 transfers that must respect the token constraints.
 */

beforeEach(async () => {
  const alice = privateKeyToAccount(generatePrivateKey());
  const bob = privateKeyToAccount(generatePrivateKey());

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: alice },
  });

  await deploySmartAccount(aliceSmartAccount);

  bobSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });

  erc721TokenAddress = (await deployErc721Token()) as `0x${string}`;

  // Mint a token to Alice's smart account
  tokenId = (await mintErc721Token(
    aliceSmartAccount.address,
    erc721TokenAddress,
  )) as bigint;
});

const runTest_expectSuccess = async (
  delegator: MetaMaskSmartAccount,
  delegate: `0x${string}`,
  tokenAddress: `0x${string}`,
  tokenId: bigint,
  recipient: `0x${string}`,
) => {
  const { environment } = delegator;

  const delegation: Delegation = {
    delegate,
    delegator: delegator.address,
    authority: ROOT_AUTHORITY,
    salt: '0x0',
    caveats: createCaveatBuilder(environment)
      .addCaveat('erc721Transfer', {
        tokenAddress,
        tokenId,
      })
      .build(),
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: tokenAddress,
    value: 0n,
    callData: encodeFunctionData({
      abi: [
        {
          type: 'function',
          name: 'transferFrom',
          inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'transferFrom',
      args: [delegator.address, recipient, tokenId],
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

  const recipientBalanceBefore = await getErc721Balance(
    recipient,
    tokenAddress,
  );

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

  const recipientBalanceAfter = await getErc721Balance(recipient, tokenAddress);

  const tokenOwner = await getErc721Owner(tokenId, tokenAddress);

  expect(
    recipientBalanceAfter,
    'Expected recipient balance to increase by 1',
  ).toEqual(recipientBalanceBefore + 1n);

  expect(tokenOwner, 'Expected token to be owned by recipient').toEqual(
    recipient,
  );
};

const runTest_expectFailure = async (
  delegator: MetaMaskSmartAccount,
  delegate: `0x${string}`,
  tokenAddress: `0x${string}`,
  allowedTokenId: bigint,
  actualTokenId: bigint,
  recipient: `0x${string}`,
  expectedError: string,
) => {
  const { environment } = delegator;

  const delegation: Delegation = {
    delegate,
    delegator: delegator.address,
    authority: ROOT_AUTHORITY,
    salt: '0x0',
    caveats: createCaveatBuilder(environment)
      .addCaveat('erc721Transfer', {
        tokenAddress,
        tokenId: allowedTokenId,
      })
      .build(),
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: tokenAddress,
    value: 0n,
    callData: encodeFunctionData({
      abi: [
        {
          type: 'function',
          name: 'transferFrom',
          inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'transferFrom',
      args: [delegator.address, recipient, actualTokenId],
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

  const recipientBalanceBefore = await getErc721Balance(
    recipient,
    tokenAddress,
  );

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
  ).rejects.toThrow(stringToUnprefixedHex(expectedError));

  const recipientBalanceAfter = await getErc721Balance(recipient, tokenAddress);

  expect(
    recipientBalanceAfter,
    'Expected recipient balance to remain unchanged',
  ).toEqual(recipientBalanceBefore);
};

test('maincase: Bob redeems the delegation and transfers the allowed ERC721 token', async () => {
  const recipient = randomAddress() as `0x${string}`;

  await runTest_expectSuccess(
    aliceSmartAccount,
    bobSmartAccount.address,
    erc721TokenAddress,
    tokenId,
    recipient,
  );
});

test('Bob attempts to redeem the delegation with wrong token ID', async () => {
  const recipient = randomAddress() as `0x${string}`;
  const wrongTokenId = tokenId + 1n;

  // Mint the wrong token ID so it exists
  await mintErc721Token(
    aliceSmartAccount.address,
    erc721TokenAddress,
    wrongTokenId,
  );

  await runTest_expectFailure(
    aliceSmartAccount,
    bobSmartAccount.address,
    erc721TokenAddress,
    tokenId, // allowed token ID
    wrongTokenId, // actual token ID being transferred
    recipient,
    'ERC721TransferEnforcer:unauthorized-token',
  );
});

test('Scope: Bob redeems the delegation with an allowed ERC721 transfer using erc721Transfer scope', async () => {
  const recipient = randomAddress();

  await runScopeTest_expectSuccess(tokenId, recipient);
});

test('Scope: Bob attempts to redeem the delegation with wrong token ID using erc721Transfer scope', async () => {
  const recipient = randomAddress();
  const wrongTokenId = tokenId + 1n;

  // Mint the wrong token ID so it exists
  await mintErc721Token(
    aliceSmartAccount.address,
    erc721TokenAddress,
    wrongTokenId,
  );

  await runScopeTest_expectFailure(
    tokenId, // allowed token ID
    wrongTokenId, // actual token ID being transferred
    recipient,
    'ERC721TransferEnforcer:unauthorized-token',
  );
});

const runScopeTest_expectSuccess = async (
  tokenId: bigint,
  recipient: string,
) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation = createDelegation({
    environment: aliceSmartAccount.environment,
    to: bobAddress,
    from: aliceAddress,
    scope: {
      type: 'erc721Transfer',
      tokenAddress: erc721TokenAddress,
      tokenId,
    },
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc721TokenAddress,
    value: 0n,
    callData: encodeFunctionData({
      abi: [
        {
          type: 'function',
          name: 'transferFrom',
          inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'transferFrom',
      args: [aliceAddress, recipient as `0x${string}`, tokenId],
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

  const recipientBalanceBefore = await getErc721Balance(
    recipient as `0x${string}`,
    erc721TokenAddress,
  );

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

  const recipientBalanceAfter = await getErc721Balance(
    recipient as `0x${string}`,
    erc721TokenAddress,
  );

  const tokenOwner = await getErc721Owner(tokenId, erc721TokenAddress);

  expect(
    recipientBalanceAfter,
    'Expected recipient balance to increase by 1',
  ).toEqual(recipientBalanceBefore + 1n);

  expect(tokenOwner, 'Expected token to be owned by recipient').toEqual(
    recipient as `0x${string}`,
  );
};

const runScopeTest_expectFailure = async (
  allowedTokenId: bigint,
  actualTokenId: bigint,
  recipient: string,
  expectedError: string,
) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation = createDelegation({
    environment: aliceSmartAccount.environment,
    to: bobAddress,
    from: aliceAddress,
    scope: {
      type: 'erc721Transfer',
      tokenAddress: erc721TokenAddress,
      tokenId: allowedTokenId,
    },
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc721TokenAddress,
    value: 0n,
    callData: encodeFunctionData({
      abi: [
        {
          type: 'function',
          name: 'transferFrom',
          inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'transferFrom',
      args: [aliceAddress, recipient as `0x${string}`, actualTokenId],
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

  const recipientBalanceBefore = await getErc721Balance(
    recipient as `0x${string}`,
    erc721TokenAddress,
  );

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
  ).rejects.toThrow(stringToUnprefixedHex(expectedError));

  const recipientBalanceAfter = await getErc721Balance(
    recipient as `0x${string}`,
    erc721TokenAddress,
  );

  expect(
    recipientBalanceAfter,
    'Expected recipient balance to remain unchanged',
  ).toEqual(recipientBalanceBefore);
};
