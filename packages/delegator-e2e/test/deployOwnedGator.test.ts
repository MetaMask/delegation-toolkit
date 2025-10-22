import { beforeEach, expect, test } from 'vitest';
import { chain } from '../src/config';
import {
  publicClient,
  unsponsoredBundlerClient,
  fundAddress,
  gasPrice,
  transport,
  sponsoredBundlerClient,
  deploySmartAccount,
  randomAddress,
} from './utils/helpers';
import {
  expectCodeAt,
  expectNoCodeAt,
  expectUserOperationToSucceed,
} from './utils/assertions';

import {
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/smart-accounts-kit';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { Account, createClient, parseEther } from 'viem';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let alice: Account;
const call = { to: randomAddress() };

beforeEach(async () => {
  alice = privateKeyToAccount(generatePrivateKey());

  const client = createClient({ transport, chain });

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x',
    signer: { account: alice },
  });
});

/*
  Alice creates a DeleGatorSmartAccount for a counterfactual Hybrid delegator account.

  She then deploys it on chain using 2 different methods:
  - Sending a user operation, with gas paid by a CF balance of the SCA
  - Sending a user operation, with gas paid by a paymaster
*/

test('maincase: Deploy Hybrid DeleGator via user operation', async () => {
  const { address } = aliceSmartAccount;

  await fundAddress(address, parseEther('1'));

  await expectNoCodeAt(
    address,
    `Unexpected code found at gator address: ${address}`,
  );

  const userOpHash = await unsponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [call],
    ...gasPrice,
  });

  const receipt = await unsponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});

test('Deploy Hybrid DeleGator via user operation with paymaster', async () => {
  const { address } = aliceSmartAccount;

  // ensure that there is no balance, which would be available to pay for the useroperation
  const balance = await publicClient.getBalance({ address });
  expect(
    balance,
    `Unexpected balance found at gator address: ${address}`,
  ).toEqual(0n);

  await expectNoCodeAt(
    address,
    `Unexpected code found at gator address: ${address}`,
  );

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [call],
    ...gasPrice,
  });

  const receipt = await unsponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});

test('Send a useroperation with a SmartAccount created with the address of a deployed smart account', async () => {
  const { address } = aliceSmartAccount;
  const recipient = randomAddress();
  const value = parseEther('1');
  await fundAddress(address, value);

  await deploySmartAccount(aliceSmartAccount);

  const smartAccountWithoutDeployParams = await toMetaMaskSmartAccount({
    client: aliceSmartAccount.client,
    implementation: Implementation.Hybrid,
    address,
    signer: { account: alice },
  });

  const balanceBefore = await publicClient.getBalance({ address: recipient });

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: smartAccountWithoutDeployParams,
    calls: [
      {
        to: recipient,
        value,
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  const balanceAfter = await publicClient.getBalance({ address: recipient });

  expect(balanceAfter).toEqual(balanceBefore + value);
});

test('Attempts to send a useroperation without funding her account', async () => {
  const { address } = aliceSmartAccount;

  await expectNoCodeAt(
    address,
    `Unexpected code found at gator address: ${address}`,
  );

  await expect(() =>
    unsponsoredBundlerClient.sendUserOperation({
      account: aliceSmartAccount,
      calls: [call],
      ...gasPrice,
    }),
  ).rejects.toThrow("AA21 didn't pay prefund");

  await expectNoCodeAt(
    address,
    `Expected code to be found at gator address: ${address}`,
  );
});
