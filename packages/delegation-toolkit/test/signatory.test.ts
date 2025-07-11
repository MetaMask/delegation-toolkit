import type { Address, Hex } from 'viem';
import {
  createWalletClient,
  custom,
  recoverMessageAddress,
  recoverTypedDataAddress,
  slice,
} from 'viem';
import type { WebAuthnAccount } from 'viem/account-abstraction';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { hardhat as chain } from 'viem/chains';
import { describe, it, expect } from 'vitest';

import { OWNER_ACCOUNT } from './utils';
import { Implementation } from '../src/constants';
import { resolveSignatory } from '../src/signatory';

const typedData = {
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  types: {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
    ],
  },
  primaryType: 'Mail',
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  },
} as const;

const message = { message: 'test' };

const createMockTransport = () => {
  return custom({
    request: async () => '0x',
  });
};

describe('resolveSignatory', () => {
  it('resolves Hybrid signatory from WalletSignatoryConfig', async () => {
    const walletClient = createWalletClient({
      account: OWNER_ACCOUNT,
      chain,
      transport: createMockTransport(),
    });

    const signatory = resolveSignatory({
      implementation: Implementation.Hybrid,
      signatory: { walletClient },
    });

    const messageSignature = await signatory.signMessage(message);

    const recoveredMessageAddress = await recoverMessageAddress({
      ...message,
      signature: messageSignature,
    });
    expect(recoveredMessageAddress).to.equal(OWNER_ACCOUNT.address);

    const typedSignature = await signatory.signTypedData(typedData);

    const recoveredTypedDataAddress = await recoverTypedDataAddress({
      ...typedData,
      signature: typedSignature,
    });
    expect(recoveredTypedDataAddress).to.equal(OWNER_ACCOUNT.address);
  });

  it('resolves Hybrid signatory from AccountSignatoryConfig', async () => {
    const signatory = resolveSignatory({
      implementation: Implementation.Hybrid,
      signatory: { account: OWNER_ACCOUNT },
    });
    const messageSignature = await signatory.signMessage(message);

    const recoveredMessageAddress = await recoverMessageAddress({
      ...message,
      signature: messageSignature,
    });
    expect(recoveredMessageAddress).to.equal(OWNER_ACCOUNT.address);

    const typedSignature = await signatory.signTypedData(typedData);

    const recoveredTypedDataAddress = await recoverTypedDataAddress({
      ...typedData,
      signature: typedSignature,
    });

    expect(recoveredTypedDataAddress).to.equal(OWNER_ACCOUNT.address);
  });

  it('should resolve Hybrid signatory from WebAuthnAccount', async () => {
    // this test is quite complex, due to the nature of webauthn signature encoding.
    // the verification of this test is very minimal, but the encoding is validated
    // in the webAuthn util tests.
    const webauthn = {
      keyId:
        '0x8d39ed41281a2b1d3b61dcc5cd4a0697c6831052b9c91840c62b58caba12ce06',
      authenticatorData:
        '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000',
      challengeIndex: 23,
      clientDataJSON:
        '{"type":"webauthn.get","challenge":"a-random-challenge","origin":"https://passkey-origin","crossOrigin":false}',
      typeIndex: 1,
      userVerificationRequired: true,
    } as const;

    const rawSignature =
      '0x304502204e2fe56da5cc6f6ca66813cf57c1b6650c7f1b974d8d2a8c742655eb505e0052022100ce082e098a86ea36c6ab96cad392445961627f6b65bc684bc65c4f06117a907d' as const;

    const expectedSignature =
      '0x55608cdbde2ff4183a81e62da096fa863d8f910d29d17826124fccc9bcc11f62304502204e2fe56da5cc6f6ca66813cf57c1b6650c7f1b974d8d2a8c742655eb505e0052022100ce082e098a86ea36c6ab96cad392445961627f6b65bc684bc600000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000247b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000038222c226f726967696e223a2268747470733a2f2f706173736b65792d6f726967696e222c2263726f73734f726967696e223a66616c73657d0000000000000000';

    const expectedStubSignature =
      '0x55608cdbde2ff4183a81e62da096fa863d8f910d29d17826124fccc9bcc11f627fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a87fffffff800000007fffffffffffffffde737d56d38bcf4279dce5617e3192a800000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000253c55a232fc5832375a85c15dd44e43a8ed84e8a1eff53e743b7138bda4cc189e050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000247b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030222c226f726967696e223a22706173736b65792d646f6d61696e222c2263726f73734f726967696e223a66616c73657d00000000000000000000000000000000';
    const webAuthnAccount: WebAuthnAccount = {
      publicKey: '0x1234567890123456789012345678901234567890',
      type: 'webAuthn',
      id: '0x1234567890123456789012345678901234567890',
      signTypedData: async (_: any) => ({
        signature: rawSignature,
        webauthn,
        raw: {} as PublicKeyCredential,
      }),
      signMessage: async (_: any) => ({
        signature: rawSignature,
        webauthn,
        raw: {} as PublicKeyCredential,
      }),
      sign: async (_: any) => ({
        signature: rawSignature,
        webauthn,
        raw: {} as PublicKeyCredential,
      }),
    };

    const signatory = resolveSignatory({
      implementation: Implementation.Hybrid,
      signatory: {
        keyId: '0x1234567890123456789012345678901234567890',
        webAuthnAccount,
      },
    });

    const messageSignature = await signatory.signMessage(message);
    const typedSignature = await signatory.signTypedData(typedData);
    const stubSignature = await signatory.getStubSignature();

    expect(messageSignature).to.equal(expectedSignature);
    expect(typedSignature).to.equal(expectedSignature);
    expect(stubSignature).to.equal(expectedStubSignature);
  });

  it('resolves MultiSig signatory', async () => {
    const config = {
      implementation: Implementation.MultiSig,
      signatory: [{ account: OWNER_ACCOUNT }],
    };

    const signatory = resolveSignatory(config);

    const messageSignature = await signatory.signMessage(message);

    const recoveredMessageAddress = await recoverMessageAddress({
      ...message,
      signature: messageSignature,
    });
    expect(recoveredMessageAddress).to.equal(OWNER_ACCOUNT.address);

    const typedSignature = await signatory.signTypedData(typedData);

    const recoveredTypedDataAddress = await recoverTypedDataAddress({
      ...typedData,
      signature: typedSignature,
    });
    expect(recoveredTypedDataAddress).to.equal(OWNER_ACCOUNT.address);
  });

  it('resolves MultiSig signatory with multiple signatories', async () => {
    // at least 3 signatories, at most 10
    const numSignatories = Math.floor(Math.random() * 8) + 3;

    const signatories = Array.from({ length: numSignatories }, () => ({
      account: privateKeyToAccount(generatePrivateKey()),
    }));
    const sortedAddresses = signatories
      .map((signatory) => signatory.account.address)
      .sort((a, b) => a.localeCompare(b));

    const config = {
      implementation: Implementation.MultiSig,
      signatory: signatories,
    };

    const signatory = resolveSignatory(config);

    const validateSignature = async (
      signature: Hex,
      recoverSignerAddress: (signature: Hex) => Promise<Address>,
    ) => {
      const SIGNATURE_LENGTH = 65;
      for (let i = 0; i < signatories.length; i++) {
        const signaturePart = slice(
          signature,
          i * SIGNATURE_LENGTH,
          (i + 1) * SIGNATURE_LENGTH,
        );

        const recoveredAddress = await recoverSignerAddress(signaturePart);

        const messageToValidate = JSON.stringify({
          i,
          signaturePart,
          recoveredMessageAddress: recoveredAddress,
          signature,
        });
        expect(recoveredAddress, messageToValidate).to.equal(
          sortedAddresses[i],
        );
      }
    };

    const messageSignature = await signatory.signMessage(message);
    await validateSignature(messageSignature, async (signature: Hex) =>
      recoverMessageAddress({ signature, ...message }),
    );

    const typedSignature = await signatory.signTypedData(typedData);
    await validateSignature(typedSignature, async (signature: Hex) =>
      recoverTypedDataAddress({ signature, ...typedData }),
    );
  });

  it('resolves Stateless7702 signatory from WalletSignatoryConfig', async () => {
    const walletClient = createWalletClient({
      account: OWNER_ACCOUNT,
      chain,
      transport: createMockTransport(),
    });

    const signatory = resolveSignatory({
      implementation: Implementation.Stateless7702,
      signatory: { walletClient },
    });

    const messageSignature = await signatory.signMessage(message);

    const recoveredMessageAddress = await recoverMessageAddress({
      ...message,
      signature: messageSignature,
    });
    expect(recoveredMessageAddress).to.equal(OWNER_ACCOUNT.address);

    const typedSignature = await signatory.signTypedData(typedData);

    const recoveredTypedDataAddress = await recoverTypedDataAddress({
      ...typedData,
      signature: typedSignature,
    });
    expect(recoveredTypedDataAddress).to.equal(OWNER_ACCOUNT.address);
  });

  it('resolves Stateless7702 signatory from AccountSignatoryConfig', async () => {
    const signatory = resolveSignatory({
      implementation: Implementation.Stateless7702,
      signatory: { account: OWNER_ACCOUNT },
    });

    const messageSignature = await signatory.signMessage(message);

    const recoveredMessageAddress = await recoverMessageAddress({
      ...message,
      signature: messageSignature,
    });
    expect(recoveredMessageAddress).to.equal(OWNER_ACCOUNT.address);

    const typedSignature = await signatory.signTypedData(typedData);

    const recoveredTypedDataAddress = await recoverTypedDataAddress({
      ...typedData,
      signature: typedSignature,
    });
    expect(recoveredTypedDataAddress).to.equal(OWNER_ACCOUNT.address);
  });

  it('throws error for Stateless7702 signatory with account that does not support signMessage', async () => {
    const accountWithoutSignMessage = {
      ...OWNER_ACCOUNT,
      signMessage: undefined,
    };

    expect(() =>
      resolveSignatory({
        implementation: Implementation.Stateless7702,
        signatory: { account: accountWithoutSignMessage },
      }),
    ).to.throw('Account does not support signMessage');
  });

  it('throws error for Stateless7702 signatory with account that does not support signTypedData', async () => {
    const accountWithoutSignTypedData = {
      ...OWNER_ACCOUNT,
      signTypedData: undefined,
    };

    expect(() =>
      resolveSignatory({
        implementation: Implementation.Stateless7702,
        signatory: { account: accountWithoutSignTypedData },
      }),
    ).to.throw('Account does not support signTypedData');
  });

  it('throws error for Stateless7702 signatory with invalid config', async () => {
    expect(() =>
      resolveSignatory({
        implementation: Implementation.Stateless7702,
        signatory: {} as any,
      }),
    ).to.throw('Invalid signatory config');
  });
});
