import { expect } from 'chai';
import hre from 'hardhat';
import type { Account, PublicClient, WalletClient } from 'viem';
import { createPublicClient, hashTypedData, recoverAddress } from 'viem';
import { toPackedUserOperation } from 'viem/account-abstraction';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { hardhat as chain } from 'viem/chains';

import {
  createHardhatTransport,
  invokeFactoryData,
  setupDevelopmentEnvironment,
} from './utils';
import { Implementation } from '../src/constants';
import { toMetaMaskSmartAccount } from '../src/toMetaMaskSmartAccount';
import type { DeleGatorEnvironment, MetaMaskSmartAccount } from '../src/types';
import { SIGNABLE_USER_OP_TYPED_DATA } from '../src/userOp';

describe('MetaMaskSmartAccount', () => {
  let publicClient: PublicClient;
  let walletClient: WalletClient;
  let alice: Account;
  let bob: Account;
  let environment: DeleGatorEnvironment;

  beforeEach(async () => {
    const transport = await createHardhatTransport();
    publicClient = createPublicClient({ transport, chain });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    walletClient = (await hre.viem.getWalletClients())[0]!;

    environment = await setupDevelopmentEnvironment(
      walletClient,
      publicClient,
      chain,
    );

    alice = privateKeyToAccount(generatePrivateKey());
    bob = privateKeyToAccount(generatePrivateKey());
  });

  describe('toMetaMaskSmartAccount()', () => {
    it('should create a MetaMaskSmartAccount for Hybrid implementation', async () => {
      const smartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.Hybrid,
        deployParams: [alice.address, [], [], []],
        deploySalt: '0x0',
        signatory: { account: alice },
        environment,
      });

      const codeBefore = await publicClient.getCode({
        address: smartAccount.address,
      });
      expect(codeBefore).to.equal(undefined);

      const { factory, factoryData } = await smartAccount.getFactoryArgs();

      if (!factory || !factoryData) {
        throw new Error('Factory or factory data not found');
      }

      const txHash = await invokeFactoryData(
        walletClient,
        chain,
        factory,
        factoryData,
      );

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      const codeAfter = await publicClient.getCode({
        address: smartAccount.address,
      });
      expect(codeAfter).to.not.equal('0x');
    });

    it('should create a MetaMaskSmartAccount for MultiSig implementation', async () => {
      const smartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.MultiSig,
        deployParams: [[alice.address, bob.address], 2n],
        deploySalt: '0x0',
        signatory: [{ account: alice }],
        environment,
      });

      const codeBefore = await publicClient.getCode({
        address: smartAccount.address,
      });
      expect(codeBefore).to.equal(undefined);

      const { factory, factoryData } = await smartAccount.getFactoryArgs();

      if (!factory || !factoryData) {
        throw new Error('Factory or factory data not found');
      }

      const txHash = await invokeFactoryData(
        walletClient,
        chain,
        factory,
        factoryData,
      );

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      const codeAfter = await publicClient.getCode({
        address: smartAccount.address,
      });
      expect(codeAfter).to.not.equal('0x');
    });

    it('should create a MetaMaskSmartAccount for Stateless7702 implementation with existing address', async () => {
      const smartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.Stateless7702,
        address: alice.address,
        signatory: { account: alice },
        environment,
      });

      expect(smartAccount.address).to.equal(alice.address);

      // Verify the smart account has the correct ABI and functions
      expect(smartAccount).to.have.property('signUserOperation');
      expect(smartAccount).to.have.property('signDelegation');
      expect(smartAccount).to.have.property('getAddress');
      expect(smartAccount).to.have.property('getNonce');
      expect(smartAccount).to.have.property('encodeCalls');
    });

    it('should throw error when creating Stateless7702 without address (counterfactual not supported)', async () => {
      await expect(
        toMetaMaskSmartAccount({
          client: publicClient,
          implementation: Implementation.Stateless7702,
          signatory: { account: alice },
          environment,
        } as any),
      ).to.be.rejectedWith(
        'Stateless7702 does not support counterfactual accounts',
      );
    });

    it('should throw an error for unsupported implementation', async () => {
      await expect(
        toMetaMaskSmartAccount({
          client: publicClient,
          implementation: 99 as any as Implementation,
          deployParams: [alice.address, [], [], []],
          deploySalt: '0x0',
          signatory: { account: alice },
          environment,
        }),
      ).to.be.rejectedWith("Implementation type '99' not supported");
    });

    it('should have a default for MetaMaskSmartAccount generic TImplementation parameter', async () => {
      // MetaMaskSmartAccount requires a generic parameter, and defaults to `Implementation` which covers all implementations
      const smartAccount: MetaMaskSmartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.MultiSig,
        deployParams: [[alice.address, bob.address], 2n],
        deploySalt: '0x0',
        signatory: [{ account: alice }],
        environment,
      });

      expect(smartAccount).to.be.instanceOf(Object);
    });
  });

  describe('signUserOperation()', () => {
    // this is a special case test, because as of Framework 1.2, user operations are signed via typed data
    it('should sign a user operation', async () => {
      const smartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.MultiSig,
        deployParams: [[alice.address, bob.address], 2n],
        deploySalt: '0x0',
        signatory: [{ account: alice }],
        environment,
      });

      const userOperation = {
        callData: '0x',
        sender: alice.address,
        nonce: 0n,
        callGasLimit: 1000000n,
        preVerificationGas: 1000000n,
        verificationGasLimit: 1000000n,
        maxFeePerGas: 1000000000000000000n,
        maxPriorityFeePerGas: 1000000000000000000n,
        signature: '0x',
      } as const;

      const signature = await smartAccount.signUserOperation(userOperation);

      const packedUserOp = toPackedUserOperation(userOperation);

      const hash = hashTypedData({
        domain: {
          chainId: chain.id,
          name: 'MultiSigDeleGator',
          version: '1',
          verifyingContract: smartAccount.address,
        },
        types: SIGNABLE_USER_OP_TYPED_DATA,
        primaryType: 'PackedUserOperation',
        message: { ...packedUserOp, entryPoint: environment.EntryPoint },
      });

      const recovered = await recoverAddress({
        hash,
        signature,
      });

      expect(recovered).to.equal(alice.address);
    });

    it('should sign a user operation for Stateless7702 implementation', async () => {
      const smartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.Stateless7702,
        address: alice.address,
        signatory: { account: alice },
        environment,
      });

      const userOperation = {
        callData: '0x',
        sender: alice.address,
        nonce: 0n,
        callGasLimit: 1000000n,
        preVerificationGas: 1000000n,
        verificationGasLimit: 1000000n,
        maxFeePerGas: 1000000000000000000n,
        maxPriorityFeePerGas: 1000000000000000000n,
        signature: '0x',
      } as const;

      const signature = await smartAccount.signUserOperation(userOperation);

      const packedUserOp = toPackedUserOperation(userOperation);

      const hash = hashTypedData({
        domain: {
          chainId: chain.id,
          name: 'EIP7702StatelessDeleGator',
          version: '1',
          verifyingContract: smartAccount.address,
        },
        types: SIGNABLE_USER_OP_TYPED_DATA,
        primaryType: 'PackedUserOperation',
        message: { ...packedUserOp, entryPoint: environment.EntryPoint },
      });

      const recovered = await recoverAddress({
        hash,
        signature,
      });

      expect(recovered).to.equal(alice.address);
    });
  });
});
