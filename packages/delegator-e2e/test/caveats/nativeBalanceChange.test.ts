import { beforeEach, test, expect } from 'vitest';
import {
  createExecution,
  BalanceChangeType,
  Delegation,
  Implementation,
  ROOT_AUTHORITY,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import { createCaveatBuilder } from '@metamask/delegation-toolkit/utils';
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
  publicClient,
  randomAddress,
  fundAddress,
} from '../utils/helpers';
import { concat, createClient, encodeFunctionData, parseEther } from 'viem';
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
  await fundAddress(aliceSmartAccount.address, parseEther('2'));

  bobSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });
});

test('maincase: Bob redeems the delegation with the required balance increase', async () => {
  const requiredIncrease = parseEther('1');
  const recipient = randomAddress();
  await testRun_expectSuccess(
    recipient,
    requiredIncrease,
    requiredIncrease,
    BalanceChangeType.Increase,
  );
});

test('Bob redeems the delegation with a greater balance increase', async () => {
  const requiredIncrease = parseEther('1');
  const actualIncrease = parseEther('1.5');
  const recipient = randomAddress();
  await testRun_expectSuccess(
    recipient,
    requiredIncrease,
    actualIncrease,
    BalanceChangeType.Increase,
  );
});

test('Bob redeems the delegation with the required balance decrease', async () => {
  const requiredDecrease = parseEther('1');
  const recipient = randomAddress();

  await testRun_expectSuccess(
    recipient,
    requiredDecrease,
    requiredDecrease,
    BalanceChangeType.Decrease,
  );
});

test('Bob attempts to redeem the delegation without the increase', async () => {
  const requiredIncrease = parseEther('1');
  const recipient = randomAddress();

  await testRun_expectFailure(
    recipient,
    requiredIncrease,
    0n,
    BalanceChangeType.Increase,
    'NativeBalanceChangeEnforcer:insufficient-balance-increase',
  );
});

test('Bob attempts to redeem the delegation where the decrease exceeds the allowed decrease', async () => {
  const allowedDecrease = parseEther('1');
  const actualDecrease = parseEther('1.5');
  const recipient = randomAddress();

  await testRun_expectFailure(
    recipient,
    allowedDecrease,
    actualDecrease,
    BalanceChangeType.Decrease,
    'NativeBalanceChangeEnforcer:exceeded-balance-decrease',
  );
});

test('Bob attempts to redeem with invalid terms length', async () => {
  const requiredIncrease = parseEther('1');
  const recipient = randomAddress();
  const { environment } = aliceSmartAccount;

  const caveats = createCaveatBuilder(environment)
    .addCaveat('nativeBalanceChange', {
      recipient,
      balance: requiredIncrease,
      changeType: BalanceChangeType.Increase,
    })
    .build();

  // Create invalid terms length by appending an empty byte
  caveats[0].terms = concat([caveats[0].terms, '0x00']);

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    authority: ROOT_AUTHORITY,
    caveats,
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
    target: recipient,
    value: requiredIncrease,
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
  ).rejects.toThrow('NativeBalanceChangeEnforcer:invalid-terms-length');
});

const testRun_expectSuccess = async (
  recipient: `0x${string}`,
  requiredChange: bigint,
  actualChange: bigint,
  changeType: BalanceChangeType,
) => {
  // if the caveat is for an increase, the target is the recipient
  // if the caveat is for a decrease, the target is the smart account
  // because the smart account is the one that is making the transfer
  const target =
    changeType === BalanceChangeType.Increase
      ? recipient
      : aliceSmartAccount.address;

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    authority: ROOT_AUTHORITY,
    caveats: createCaveatBuilder(aliceSmartAccount.environment)
      .addCaveat('nativeBalanceChange', {
        recipient: target,
        balance: requiredChange,
        changeType,
      })
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
    target: recipient,
    value: actualChange,
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

  const balanceBefore = await publicClient.getBalance({
    address: target,
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

  const balanceAfter = await publicClient.getBalance({
    address: target,
  });

  if (changeType === BalanceChangeType.Increase) {
    expect(
      balanceAfter,
      'Expected balance to be increased by the specified amount',
    ).toEqual(balanceBefore + actualChange);
  } else {
    expect(
      balanceAfter,
      'Expected balance to be decreased by the specified amount',
    ).toEqual(balanceBefore - actualChange);
  }
};

const testRun_expectFailure = async (
  recipient: `0x${string}`,
  requiredChange: bigint,
  actualChange: bigint,
  changeType: BalanceChangeType,
  expectedError: string,
) => {
  // if the caveat is for an increase, the target is the recipient
  // if the caveat is for a decrease, the target is the smart account
  // because the smart account is the one that is making the transfer
  const target =
    changeType === BalanceChangeType.Increase
      ? recipient
      : aliceSmartAccount.address;

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    authority: ROOT_AUTHORITY,
    caveats: createCaveatBuilder(aliceSmartAccount.environment)
      .addCaveat('nativeBalanceChange', {
        recipient: target,
        balance: requiredChange,
        changeType,
      })
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
    target: recipient,
    value: actualChange,
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
};
