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
  randomAddress,
  deployErc721Token,
  getContractOwner,
  transferContractOwnership,
} from '../utils/helpers';
import { encodeFunctionData, type Hex } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

describe('Ownership Transfer Caveat', () => {
  let aliceSmartAccount: MetaMaskSmartAccount;
  let bobSmartAccount: MetaMaskSmartAccount;
  let contractAddress: `0x${string}`;

  beforeEach(async () => {
    // Create Alice's smart account
    const alicePrivateKey = generatePrivateKey();
    const aliceAccount = privateKeyToAccount(alicePrivateKey);
    aliceSmartAccount = await deploySmartAccount(
      aliceAccount,
      Implementation.Hybrid,
    );

    // Create Bob's smart account
    const bobPrivateKey = generatePrivateKey();
    const bobAccount = privateKeyToAccount(bobPrivateKey);
    bobSmartAccount = await deploySmartAccount(
      bobAccount,
      Implementation.Hybrid,
    );

    // Deploy an ERC721 contract that Alice will own (and can transfer ownership of)
    contractAddress = (await deployErc721Token(
      'TestNFT',
      'TNFT',
    )) as `0x${string}`;

    // Verify Alice owns the contract initially
    const initialOwner = await getContractOwner(contractAddress);
    expect(initialOwner).toBe(aliceSmartAccount.account.address);
  });

  const runTest_expectSuccess = async (
    delegator: MetaMaskSmartAccount,
    delegate: `0x${string}`,
    contractAddress: `0x${string}`,
    newOwner: `0x${string}`,
  ) => {
    const environment = delegator.environment;
    const delegatorAddress = delegator.account.address;

    const delegation: Delegation = {
      delegate,
      delegator: delegatorAddress,
      authority: ROOT_AUTHORITY,
      salt: '0x0',
      caveats: createCaveatBuilder(environment)
        .addCaveat('ownershipTransfer', {
          contractAddress,
        })
        .build(),
    };

    const delegations = [delegation];

    const executions = [
      createExecution({
        target: contractAddress,
        value: 0n,
        callData: transferContractOwnership(newOwner),
      }),
    ];

    const executionCallData = encodeExecutionCalldatas(executions);
    const permissionContexts = encodePermissionContexts([delegations]);

    const userOpCalldata = encodeFunctionData({
      abi: [
        {
          name: 'redeemDelegations',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'permissionContexts', type: 'bytes[]' },
            { name: 'executionCalldata', type: 'bytes[]' },
            { name: 'executionMode', type: 'bytes32' },
          ],
          outputs: [],
        },
      ],
      functionName: 'redeemDelegations',
      args: [
        permissionContexts,
        executionCallData,
        ExecutionMode.SingleDefault,
      ],
    });

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: toMetaMaskSmartAccount(bobSmartAccount),
      calls: [
        {
          to: bobSmartAccount.address,
          data: userOpCalldata,
        },
      ],
      gasPrice,
    });

    await expectUserOperationToSucceed(userOpHash);

    // Verify ownership was transferred
    const finalOwner = await getContractOwner(contractAddress);
    expect(finalOwner).toBe(newOwner);
  };

  const runTest_expectFailure = async (
    delegator: MetaMaskSmartAccount,
    delegate: `0x${string}`,
    contractAddress: `0x${string}`,
    targetContract: `0x${string}`,
    newOwner: `0x${string}`,
    expectedError: string,
  ) => {
    const environment = delegator.environment;
    const delegatorAddress = delegator.account.address;

    const delegation: Delegation = {
      delegate,
      delegator: delegatorAddress,
      authority: ROOT_AUTHORITY,
      salt: '0x0',
      caveats: createCaveatBuilder(environment)
        .addCaveat('ownershipTransfer', {
          contractAddress, // Only allows this specific contract
        })
        .build(),
    };

    const delegations = [delegation];

    const executions = [
      createExecution({
        target: targetContract, // Try to transfer ownership of different contract
        value: 0n,
        callData: transferContractOwnership(newOwner),
      }),
    ];

    const executionCallData = encodeExecutionCalldatas(executions);
    const permissionContexts = encodePermissionContexts([delegations]);

    const userOpCalldata = encodeFunctionData({
      abi: [
        {
          name: 'redeemDelegations',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'permissionContexts', type: 'bytes[]' },
            { name: 'executionCalldata', type: 'bytes[]' },
            { name: 'executionMode', type: 'bytes32' },
          ],
          outputs: [],
        },
      ],
      functionName: 'redeemDelegations',
      args: [
        permissionContexts,
        executionCallData,
        ExecutionMode.SingleDefault,
      ],
    });

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: toMetaMaskSmartAccount(bobSmartAccount),
      calls: [
        {
          to: bobSmartAccount.address,
          data: userOpCalldata,
        },
      ],
      gasPrice,
    });

    await expect(expectUserOperationToSucceed(userOpHash)).rejects.toThrow(
      expectedError,
    );
  };

  test('maincase: Bob redeems the delegation to transfer ownership', async () => {
    const newOwner = randomAddress();

    await runTest_expectSuccess(
      aliceSmartAccount,
      bobSmartAccount.address,
      contractAddress,
      newOwner as `0x${string}`,
    );
  });

  test('Bob attempts to transfer ownership of unauthorized contract', async () => {
    // Deploy a second contract that's not allowed
    const unauthorizedContract = (await deployErc721Token(
      'Unauthorized',
      'UNAUTH',
    )) as `0x${string}`;
    const newOwner = randomAddress();

    await runTest_expectFailure(
      aliceSmartAccount,
      bobSmartAccount.address,
      contractAddress, // Delegation only allows this contract
      unauthorizedContract, // But we try to transfer this one
      newOwner as `0x${string}`,
      'OwnershipTransferEnforcer:unauthorized-contract',
    );
  });

  // Scope Tests using createDelegation
  const runScopeTest_expectSuccess = async (
    contractAddress: `0x${string}`,
    newOwner: `0x${string}`,
  ) => {
    const delegation = createDelegation({
      environment: aliceSmartAccount.environment,
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      scope: {
        type: 'ownershipTransfer',
        contractAddress,
      },
      caveats: [],
    });

    const delegations = [delegation];

    const executions = [
      createExecution({
        target: contractAddress,
        value: 0n,
        callData: transferContractOwnership(newOwner),
      }),
    ];

    const executionCallData = encodeExecutionCalldatas(executions);
    const permissionContexts = encodePermissionContexts([delegations]);

    const userOpCalldata = encodeFunctionData({
      abi: [
        {
          name: 'redeemDelegations',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'permissionContexts', type: 'bytes[]' },
            { name: 'executionCalldata', type: 'bytes[]' },
            { name: 'executionMode', type: 'bytes32' },
          ],
          outputs: [],
        },
      ],
      functionName: 'redeemDelegations',
      args: [
        permissionContexts,
        executionCallData,
        ExecutionMode.SingleDefault,
      ],
    });

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: toMetaMaskSmartAccount(bobSmartAccount),
      calls: [
        {
          to: bobSmartAccount.address,
          data: userOpCalldata,
        },
      ],
      gasPrice,
    });

    await expectUserOperationToSucceed(userOpHash);

    // Verify ownership was transferred
    const finalOwner = await getContractOwner(contractAddress);
    expect(finalOwner).toBe(newOwner);
  };

  const runScopeTest_expectFailure = async (
    contractAddress: `0x${string}`,
    targetContract: `0x${string}`,
    newOwner: `0x${string}`,
    expectedError: string,
  ) => {
    const delegation = createDelegation({
      environment: aliceSmartAccount.environment,
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      scope: {
        type: 'ownershipTransfer',
        contractAddress, // Only allows this specific contract
      },
      caveats: [],
    });

    const delegations = [delegation];

    const executions = [
      createExecution({
        target: targetContract, // Try to transfer ownership of different contract
        value: 0n,
        callData: transferContractOwnership(newOwner),
      }),
    ];

    const executionCallData = encodeExecutionCalldatas(executions);
    const permissionContexts = encodePermissionContexts([delegations]);

    const userOpCalldata = encodeFunctionData({
      abi: [
        {
          name: 'redeemDelegations',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'permissionContexts', type: 'bytes[]' },
            { name: 'executionCalldata', type: 'bytes[]' },
            { name: 'executionMode', type: 'bytes32' },
          ],
          outputs: [],
        },
      ],
      functionName: 'redeemDelegations',
      args: [
        permissionContexts,
        executionCallData,
        ExecutionMode.SingleDefault,
      ],
    });

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: toMetaMaskSmartAccount(bobSmartAccount),
      calls: [
        {
          to: bobSmartAccount.address,
          data: userOpCalldata,
        },
      ],
      gasPrice,
    });

    await expect(expectUserOperationToSucceed(userOpHash)).rejects.toThrow(
      expectedError,
    );
  };

  test('Scope: Bob redeems the delegation to transfer ownership using ownershipTransfer scope', async () => {
    const newOwner = randomAddress();

    await runScopeTest_expectSuccess(
      contractAddress,
      newOwner as `0x${string}`,
    );
  });

  test('Scope: Bob attempts to transfer ownership of unauthorized contract using ownershipTransfer scope', async () => {
    // Deploy a second contract that's not allowed
    const unauthorizedContract = (await deployErc721Token(
      'Unauthorized',
      'UNAUTH',
    )) as `0x${string}`;
    const newOwner = randomAddress();

    await runScopeTest_expectFailure(
      contractAddress, // Delegation only allows this contract
      unauthorizedContract, // But we try to transfer this one
      newOwner as `0x${string}`,
      'OwnershipTransferEnforcer:unauthorized-contract',
    );
  });
});
