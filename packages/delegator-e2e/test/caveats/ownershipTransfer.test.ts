import { beforeEach, test, expect, describe } from 'vitest';
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
  publicClient,
  fundAddress,
  deployerClient,
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
    aliceSmartAccount = await toMetaMaskSmartAccount({
      client: publicClient,
      implementation: Implementation.Hybrid,
      deployParams: [aliceAccount.address, [], [], []],
      deploySalt: '0x1',
      signatory: { account: aliceAccount },
    });
    await deploySmartAccount(aliceSmartAccount);
    await fundAddress(aliceSmartAccount.address, BigInt(10 ** 18)); // 1 ETH

    // Create Bob's smart account
    const bobPrivateKey = generatePrivateKey();
    const bobAccount = privateKeyToAccount(bobPrivateKey);
    bobSmartAccount = await toMetaMaskSmartAccount({
      client: publicClient,
      implementation: Implementation.Hybrid,
      deployParams: [bobAccount.address, [], [], []],
      deploySalt: '0x2',
      signatory: { account: bobAccount },
    });

    // Deploy an ERC721 contract that Alice will own (and can transfer ownership of)
    contractAddress = (await deployErc721Token(
      'TestNFT',
      'TNFT',
    )) as `0x${string}`;

    // Transfer ownership from deployer to Alice's smart account
    const transferOwnershipCallData = transferContractOwnership(
      aliceSmartAccount.address,
    );
    const transferTxHash = await deployerClient.sendTransaction({
      to: contractAddress,
      data: transferOwnershipCallData,
    });

    await publicClient.waitForTransactionReceipt({ hash: transferTxHash });

    // Verify Alice owns the contract now
    const initialOwner = await getContractOwner(contractAddress);
    expect(initialOwner).toBe(aliceSmartAccount.address);
  });

  const runTest_expectSuccess = async (
    delegator: MetaMaskSmartAccount,
    delegate: `0x${string}`,
    contractAddress: `0x${string}`,
    newOwner: `0x${string}`,
  ) => {
    const environment = delegator.environment;
    const delegatorAddress = delegator.address;

    const delegation = createDelegation({
      to: delegate,
      from: delegatorAddress,
      environment,
      scope: {
        type: 'ownershipTransfer',
        contractAddress,
      },
      caveats: [],
    });

    // Sign the delegation
    const signedDelegation = {
      ...delegation,
      signature: await delegator.signDelegation({ delegation }),
    };

    const executions = createExecution({
      target: contractAddress,
      value: 0n,
      callData: transferContractOwnership(newOwner),
    });

    const executionCallData = encodeExecutionCalldatas([[executions]]);
    const permissionContexts = encodePermissionContexts([[signedDelegation]]);

    const userOpCalldata = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        permissionContexts,
        [ExecutionMode.SingleDefault],
        executionCallData,
      ],
    });

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [
        {
          to: bobSmartAccount.address,
          data: userOpCalldata,
        },
      ],
      ...gasPrice,
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
  ) => {
    const environment = delegator.environment;
    const delegatorAddress = delegator.address;

    const delegation = createDelegation({
      to: delegate,
      from: delegatorAddress,
      environment,
      scope: {
        type: 'ownershipTransfer',
        contractAddress, // Only allows this specific contract
      },
      caveats: [],
    });

    // Sign the delegation
    const signedDelegation = {
      ...delegation,
      signature: await delegator.signDelegation({ delegation }),
    };

    const executions = createExecution({
      target: targetContract, // Try to transfer ownership of different contract
      value: 0n,
      callData: transferContractOwnership(newOwner),
    });

    const executionCallData = encodeExecutionCalldatas([[executions]]);
    const permissionContexts = encodePermissionContexts([[signedDelegation]]);

    const userOpCalldata = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        permissionContexts,
        [ExecutionMode.SingleDefault],
        executionCallData,
      ],
    });

    // Expect the user operation to fail during simulation due to invalid contract
    await expect(
      sponsoredBundlerClient.sendUserOperation({
        account: bobSmartAccount,
        calls: [
          {
            to: bobSmartAccount.address,
            data: userOpCalldata,
          },
        ],
        ...gasPrice,
      }),
    ).rejects.toThrow();
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

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({ delegation }),
    };

    const executions = createExecution({
      target: contractAddress,
      value: 0n,
      callData: transferContractOwnership(newOwner),
    });

    const executionCallData = encodeExecutionCalldatas([[executions]]);
    const permissionContexts = encodePermissionContexts([[signedDelegation]]);

    const userOpCalldata = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        permissionContexts,
        [ExecutionMode.SingleDefault],
        executionCallData,
      ],
    });

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [
        {
          to: bobSmartAccount.address,
          data: userOpCalldata,
        },
      ],
      ...gasPrice,
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

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({ delegation }),
    };

    const executions = createExecution({
      target: targetContract, // Try to transfer ownership of different contract
      value: 0n,
      callData: transferContractOwnership(newOwner),
    });

    const executionCallData = encodeExecutionCalldatas([[executions]]);
    const permissionContexts = encodePermissionContexts([[signedDelegation]]);

    const userOpCalldata = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        permissionContexts,
        [ExecutionMode.SingleDefault],
        executionCallData,
      ],
    });

    // Expect the user operation to fail during simulation due to invalid contract
    await expect(
      sponsoredBundlerClient.sendUserOperation({
        account: bobSmartAccount,
        calls: [
          {
            to: bobSmartAccount.address,
            data: userOpCalldata,
          },
        ],
        ...gasPrice,
      }),
    ).rejects.toThrow();
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
    );
  });
});
