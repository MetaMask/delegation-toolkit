import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  createCaveatBuilder,
} from '@metamask/delegation-toolkit/utils';
import {
  createDelegation,
  Implementation,
  toMetaMaskSmartAccount,
  ExecutionMode,
  type ExecutionStruct,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import { encodeFunctionData, type Hex, parseEther } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

import {
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  deployCounter,
  CounterContract,
  deployErc20Token,
  getErc20Balance,
  fundAddressWithErc20Token,
  stringToUnprefixedHex,
  publicClient,
} from '../utils/helpers';
import { expectUserOperationToSucceed } from '../utils/assertions';
import CounterMetadata from '../utils/counter/metadata.json';
import * as ERC20Token from '../../contracts/out/ERC20Token.sol/ERC20Token.json';
const { abi: erc20TokenAbi } = ERC20Token;

let aliceSmartAccount: MetaMaskSmartAccount;
let bobSmartAccount: MetaMaskSmartAccount;
let aliceCounter: CounterContract;
let erc20TokenAddress: Hex;

/**
 * These tests verify the specific action ERC20 transfer batch caveat functionality.
 *
 * The specific action ERC20 transfer batch caveat ensures that:
 * 1. The first transaction matches exactly with the specified target, method and calldata
 * 2. The second transaction is an ERC20 transfer with specific parameters (token, recipient, amount)
 * 3. The delegation can only be executed once
 *
 * Alice creates a delegation to Bob with a specific action ERC20 transfer batch caveat.
 * Bob redeems the delegation with a batch of two transactions that must match exactly.
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

  aliceCounter = await deployCounter(aliceSmartAccount.address);
  erc20TokenAddress = await deployErc20Token();
  await fundAddressWithErc20Token(
    aliceSmartAccount.address,
    erc20TokenAddress,
    parseEther('10'),
  );
});

const runTest_expectSuccess = async (
  delegate: Hex,
  delegator: MetaMaskSmartAccount<Implementation>,
  tokenAddress: Hex,
  recipient: Hex,
  amount: bigint,
  target: Hex,
  calldata: Hex,
  executions: ExecutionStruct[],
) => {
  const { environment } = aliceSmartAccount;

  const delegation = createDelegation({
    to: delegate,
    from: delegator.address,
    caveats: createCaveatBuilder(environment).addCaveat(
      'specificActionERC20TransferBatch',
      {
        tokenAddress,
        recipient,
        amount,
        target,
        calldata,
      },
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [ExecutionMode.BatchDefault],
      encodeExecutionCalldatas([executions]),
    ],
  });

  const recipientBalanceBefore = await getErc20Balance(recipient, tokenAddress);

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

  await expectUserOperationToSucceed(receipt);

  const recipientBalanceAfter = await getErc20Balance(recipient, tokenAddress);
  expect(recipientBalanceAfter - recipientBalanceBefore).toBe(amount);
};

const runTest_expectFailure = async (
  delegate: Hex,
  delegator: MetaMaskSmartAccount<Implementation>,
  tokenAddress: Hex,
  recipient: Hex,
  amount: bigint,
  target: Hex,
  calldata: Hex,
  executions: {
    target: Hex;
    value: bigint;
    callData: Hex;
  }[],
  expectedError: string,
) => {
  const { environment } = aliceSmartAccount;

  const delegation = createDelegation({
    to: delegate,
    from: delegator.address,
    caveats: createCaveatBuilder(environment).addCaveat(
      'specificActionERC20TransferBatch',
      {
        tokenAddress,
        recipient,
        amount,
        target,
        calldata,
      },
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [ExecutionMode.BatchDefault],
      encodeExecutionCalldatas([executions]),
    ],
  });

  const recipientBalanceBefore = await getErc20Balance(recipient, tokenAddress);

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

  const recipientBalanceAfter = await getErc20Balance(recipient, tokenAddress);
  expect(recipientBalanceAfter - recipientBalanceBefore).toBe(0n);
};

test('maincase: Bob redeems the delegation with matching batch executions', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const transferAmount = parseEther('5');

  const executions = [
    {
      target: aliceCounter.address,
      value: 0n,
      callData: incrementCalldata,
    },
    {
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [bobSmartAccount.address, transferAmount],
      }),
    },
  ];

  await runTest_expectSuccess(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
  );
});

test('Bob attempts to redeem the delegation with mismatched first target', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const transferAmount = parseEther('5');

  const executions = [
    {
      target: erc20TokenAddress, // Wrong target
      value: 0n,
      callData: incrementCalldata,
    },
    {
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [bobSmartAccount.address, transferAmount],
      }),
    },
  ];

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
    'SpecificActionERC20TransferBatchEnforcer:invalid-first-transaction',
  );
});

test('Bob attempts to redeem the delegation with mismatched first calldata', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const wrongCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'setCount',
    args: [42n],
  });

  const transferAmount = parseEther('5');

  const executions = [
    {
      target: aliceCounter.address,
      value: 0n,
      callData: wrongCalldata, // Wrong calldata
    },
    {
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [bobSmartAccount.address, transferAmount],
      }),
    },
  ];

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
    'SpecificActionERC20TransferBatchEnforcer:invalid-first-transaction',
  );
});

test('Bob attempts to redeem the delegation with mismatched token address', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const transferAmount = parseEther('5');
  const wrongTokenAddress = aliceCounter.address as Hex; // Using counter as wrong token

  const executions = [
    {
      target: aliceCounter.address,
      value: 0n,
      callData: incrementCalldata,
    },
    {
      target: wrongTokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [bobSmartAccount.address, transferAmount],
      }),
    },
  ];

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
    'SpecificActionERC20TransferBatchEnforcer:invalid-second-transaction',
  );
});

test('Bob attempts to redeem the delegation with mismatched recipient', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const transferAmount = parseEther('5');
  const wrongRecipient = aliceSmartAccount.address; // Using Alice as wrong recipient

  const executions = [
    {
      target: aliceCounter.address,
      value: 0n,
      callData: incrementCalldata,
    },
    {
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [wrongRecipient, transferAmount],
      }),
    },
  ];

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
    'SpecificActionERC20TransferBatchEnforcer:invalid-second-transaction',
  );
});

test('Bob attempts to redeem the delegation with mismatched amount', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const transferAmount = parseEther('5');
  const wrongAmount = parseEther('6'); // Different amount

  const executions = [
    {
      target: aliceCounter.address,
      value: 0n,
      callData: incrementCalldata,
    },
    {
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [bobSmartAccount.address, wrongAmount],
      }),
    },
  ];

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
    'SpecificActionERC20TransferBatchEnforcer:invalid-second-transaction',
  );
});

test('Bob attempts to redeem the delegation with wrong number of executions', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const transferAmount = parseEther('5');

  const executions = [
    {
      target: aliceCounter.address,
      value: 0n,
      callData: incrementCalldata,
    },
    {
      target: aliceCounter.address,
      value: 0n,
      callData: incrementCalldata,
    },
    {
      target: aliceCounter.address,
      value: 0n,
      callData: incrementCalldata,
    },
  ];

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
    'SpecificActionERC20TransferBatchEnforcer:invalid-batch-size',
  );
});

test('Bob attempts to redeem the delegation twice', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const transferAmount = parseEther('5');

  const executions = [
    {
      target: aliceCounter.address,
      value: 0n,
      callData: incrementCalldata,
    },
    {
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [bobSmartAccount.address, transferAmount],
      }),
    },
  ];

  // First redemption should succeed
  await runTest_expectSuccess(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
  );

  // Second redemption should fail
  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    erc20TokenAddress,
    bobSmartAccount.address,
    transferAmount,
    aliceCounter.address,
    incrementCalldata,
    executions,
    'SpecificActionERC20TransferBatchEnforcer:delegation-already-used',
  );
});
