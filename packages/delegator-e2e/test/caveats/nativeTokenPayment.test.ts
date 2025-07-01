import { beforeEach, test, expect } from 'vitest';
import {
  encodeDelegations,
  encodeExecutionCalldatas,
  encodePermissionContexts,
  getDelegationHashOffchain,
  SINGLE_DEFAULT_MODE,
} from '@metamask/delegation-toolkit/utils';
import {
  createCaveatBuilder,
  createDelegation,
  createExecution,
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
  type Delegation,
} from '@metamask/delegation-toolkit';
import {
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  publicClient,
  randomAddress,
  fundAddress,
} from '../utils/helpers';
import {
  Address,
  concat,
  createClient,
  encodeFunctionData,
  Hex,
  parseEther,
  zeroAddress,
} from 'viem';
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

  await fundAddress(bobSmartAccount.address, parseEther('2'));
});

/*
  Main test cases:

  Alice creates a DeleGatorSmartAccount for a deployed Hybrid Delegator Account.
  Bob creates a DeleGatorSmartAccount for a counterfactual Hybrid Delegator Account.

  Alice creates a delegation to Bob's delegator account, with a NativeTokenPayment
  caveat that specifies a recipient and a required value for native token payments.

  Bob redeems the delegation with a valid permissions context allowing payment.
*/

test('maincase: Bob redeems the delegation with a permissions context allowing payment', async () => {
  const recipient = randomAddress();
  const requiredValue = parseEther('1');

  const delegationRequiringNativeTokenPayment = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'nativeTokenPayment',
      recipient,
      requiredValue,
    ),
  });

  const delegationHash = getDelegationHashOffchain(
    delegationRequiringNativeTokenPayment,
  );

  const args = concat([delegationHash, bobSmartAccount.address]);

  const paymentDelegation = createDelegation({
    to: bobSmartAccount.environment.caveatEnforcers.NativeTokenPaymentEnforcer!,
    from: bobSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'argsEqualityCheck',
      args,
    ),
  });

  const signedPaymentDelegation = {
    ...paymentDelegation,
    signature: await bobSmartAccount.signDelegation({
      delegation: paymentDelegation,
    }),
  };

  const permissionsContext = encodeDelegations([signedPaymentDelegation]);

  await runTest_expectSuccess(
    delegationRequiringNativeTokenPayment,
    permissionsContext,
    recipient,
    requiredValue,
  );
});

test('Bob attempts to redeem the delegation without an argsEqualityCheckEnforcer', async () => {
  const recipient = randomAddress();
  const requiredValue = parseEther('1');

  const delegationRequiringNativeTokenPayment = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'nativeTokenPayment',
      recipient,
      requiredValue,
    ),
  });

  const paymentDelegation = createDelegation({
    to: bobSmartAccount.environment.caveatEnforcers.NativeTokenPaymentEnforcer!,
    from: bobSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment, {
      allowEmptyCaveats: true,
    }),
  });

  const signedPaymentDelegation = {
    ...paymentDelegation,
    signature: await bobSmartAccount.signDelegation({
      delegation: paymentDelegation,
    }),
  };

  const permissionsContext = encodeDelegations([signedPaymentDelegation]);

  await runTest_expectFailure(
    delegationRequiringNativeTokenPayment,
    permissionsContext,
    recipient,
    'NativeTokenPaymentEnforcer:missing-argsEqualityCheckEnforcer',
  );
});

test('Bob attempts to redeem the delegation without providing a valid permissions context', async () => {
  const recipient = randomAddress();
  const requiredValue = parseEther('1');

  const delegationRequiringNativeTokenPayment = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'nativeTokenPayment',
      recipient,
      requiredValue,
    ),
  });

  const permissionsContext = '0x' as const;

  await runTest_expectFailure(
    delegationRequiringNativeTokenPayment,
    permissionsContext,
    recipient,
    undefined, // The NativeTokenPaymentEnforcer rejects when it fails to decode the permissions context
  );
});

test('Bob attempts to redeem with invalid terms length', async () => {
  const recipient = randomAddress();
  const requiredValue = parseEther('1');
  const { environment } = aliceSmartAccount;

  const caveats = createCaveatBuilder(environment)
    .addCaveat('nativeTokenPayment', recipient, requiredValue)
    .build();

  // Create invalid terms length by appending an empty byte
  caveats[0].terms = concat([caveats[0].terms, '0x00']);

  const delegationRequiringNativeTokenPayment = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats,
  });

  const delegationHash = getDelegationHashOffchain(
    delegationRequiringNativeTokenPayment,
  );

  const args = concat([delegationHash, bobSmartAccount.address]);

  const paymentDelegation = createDelegation({
    to: bobSmartAccount.environment.caveatEnforcers.NativeTokenPaymentEnforcer!,
    from: bobSmartAccount.address,
    caveats: createCaveatBuilder(environment).addCaveat(
      'argsEqualityCheck',
      args,
    ),
  });

  const signedPaymentDelegation = {
    ...paymentDelegation,
    signature: await bobSmartAccount.signDelegation({
      delegation: paymentDelegation,
    }),
  };

  const permissionsContext = encodeDelegations([signedPaymentDelegation]);

  await runTest_expectFailure(
    delegationRequiringNativeTokenPayment,
    permissionsContext,
    recipient,
    'NativeTokenPaymentEnforcer:invalid-terms-length',
  );
});

test('Bob attempts to redeem with empty allowance delegations', async () => {
  const recipient = randomAddress();
  const requiredValue = parseEther('1');
  const { environment } = aliceSmartAccount;

  const delegationRequiringNativeTokenPayment = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(environment).addCaveat(
      'nativeTokenPayment',
      recipient,
      requiredValue,
    ),
  });

  // Create empty allowance delegations array
  const permissionsContext = encodeDelegations([]);

  await runTest_expectFailure(
    delegationRequiringNativeTokenPayment,
    permissionsContext,
    recipient,
    'NativeTokenPaymentEnforcer:invalid-allowance-delegations-length',
  );
});

const runTest_expectSuccess = async (
  delegation: Delegation,
  permissionsContext: Hex,
  recipient: Address,
  requiredValue: bigint,
) => {
  const balanceBefore = await publicClient.getBalance({
    address: recipient,
  });

  const userOpHash = await submitUserOpForTest(delegation, permissionsContext);

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  await expectUserOperationToSucceed(receipt);

  const balanceAfter = await publicClient.getBalance({
    address: recipient,
  });

  expect(
    balanceAfter,
    'Expected balance to be increased by the specified amount',
  ).toEqual(balanceBefore + requiredValue);
};

const runTest_expectFailure = async (
  delegation: Delegation,
  permissionsContext: Hex,
  recipient: Address,
  expectedError: string | undefined,
) => {
  const balanceBefore = await publicClient.getBalance({
    address: recipient,
  });

  const rejects = expect(
    submitUserOpForTest(delegation, permissionsContext),
  ).rejects;

  if (expectedError) {
    await rejects.toThrow(expectedError);
  } else {
    await rejects.toThrow();
  }

  const balanceAfter = await publicClient.getBalance({
    address: recipient,
  });

  expect(balanceAfter, 'Expected balance to remain unchanged').toEqual(
    balanceBefore,
  );
};

const submitUserOpForTest = async (
  delegation: Delegation,
  permissionsContext: Hex,
) => {
  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({ delegation }),
  };

  // we need to assign the permissions context to the caveat in order for it to process the payment
  // here we assume that the first caveat is the nativeTokenPayment caveat
  signedDelegation.caveats[0].args = permissionsContext;

  const execution = createExecution({
    target: zeroAddress,
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
