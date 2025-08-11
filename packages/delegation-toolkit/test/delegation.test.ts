import { stub } from 'sinon';
import { getAddress } from 'viem';
import { describe, it, expect, beforeEach } from 'vitest';

import { randomAddress } from './utils';
import {
  type DelegationStruct,
  ROOT_AUTHORITY,
  toDelegationStruct,
  createDelegation,
  createOpenDelegation,
  resolveAuthority,
  encodeDelegations,
  decodeDelegations,
  encodePermissionContexts,
  decodePermissionContexts,
  signDelegation,
} from '../src/delegation';
import type { Caveat, Delegation, DeleGatorEnvironment } from '../src/types';

const mockDelegate = '0x1234567890123456789012345678901234567890' as const;
const mockDelegator = '0x0987654321098765432109876543210987654321' as const;
const mockSignature =
  '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as const;

const erc20Scope = {
  type: 'erc20TransferAmount',
  tokenAddress: '0x1234567890123456789012345678901234567890',
  maxAmount: 100n,
} as const;

const delegatorEnvironment: DeleGatorEnvironment = {
  caveatEnforcers: {
    ValueLteEnforcer: '0x1234567890123456789012345678901234567890',
    ERC20TransferAmountEnforcer: '0x1234567890123456789012345678901234567890',
  },
} as unknown as DeleGatorEnvironment;

const erc20ScopeCaveats = [
  {
    enforcer: delegatorEnvironment.caveatEnforcers.ValueLteEnforcer,
    terms: '0x0000000000000000000000000000000000000000000000000000000000000000',
    args: '0x',
  },
  {
    enforcer: delegatorEnvironment.caveatEnforcers.ERC20TransferAmountEnforcer,
    terms:
      '0x12345678901234567890123456789012345678900000000000000000000000000000000000000000000000000000000000000064',
    args: '0x',
  },
];

// delegation encoding in @metamask/delegation-core will lowercase any Hex strings
const mockCaveat: Caveat = {
  enforcer: randomAddress('lowercase'),
  terms: '0x',
  args: '0x',
};

describe('toDelegationStruct', () => {
  it('should convert a basic delegation to struct', () => {
    // toDelegationStruct will checksum the addresses
    const delegation: Delegation = {
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [mockCaveat],
      salt: '0x123',
      signature: mockSignature,
    };

    const result = toDelegationStruct(delegation);
    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [{ ...mockCaveat, enforcer: getAddress(mockCaveat.enforcer) }],
      salt: 291n,
      signature: mockSignature,
    });
  });

  it('should handle delegations with caveats', () => {
    const delegation: Delegation = {
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [
        {
          enforcer: '0x1111111111111111111111111111111111111111',
          terms: '0x',
          args: '0x',
        },
      ],
      salt: '0x123',
      signature: mockSignature,
    };

    const result = toDelegationStruct(delegation);
    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [
        {
          enforcer: '0x1111111111111111111111111111111111111111',
          terms: '0x',
          args: '0x',
        },
      ],
      salt: 291n,
      signature: mockSignature,
    });
  });

  it('should handle delegations that are already DelegationStruct (for backwards compatibility)', () => {
    const delegationStruct: DelegationStruct = {
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [
        {
          enforcer: '0x1111111111111111111111111111111111111111',
          terms: '0x',
          args: '0x',
        },
      ],
      salt: 123n,
      signature: mockSignature,
    };

    const result = toDelegationStruct(delegationStruct as any as Delegation);
    expect(result).to.deep.equal(delegationStruct);
  });
});

describe('resolveAuthority', () => {
  it('should return ROOT_AUTHORITY when no parent delegation is provided', () => {
    expect(resolveAuthority()).to.equal(ROOT_AUTHORITY);
  });

  it('should return the hash directly when parent delegation is a hex string', () => {
    const parentHash =
      '0x1234567890123456789012345678901234567890123456789012345678901234' as const;
    expect(resolveAuthority(parentHash)).to.equal(parentHash);
  });

  it('should compute hash when parent delegation is a Delegation object', () => {
    const parentDelegation: Delegation = {
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [mockCaveat],
      salt: '0x',
      signature: '0x',
    };
    const result = resolveAuthority(parentDelegation);
    expect(result).to.not.equal(undefined);
    expect(result).to.not.equal(ROOT_AUTHORITY);
  });
});

describe('createDelegation', () => {
  it('should create a basic delegation with root authority', () => {
    const result = createDelegation({
      environment: delegatorEnvironment,
      scope: erc20Scope,
      to: mockDelegate,
      from: mockDelegator,
      caveats: [mockCaveat],
    });

    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [...erc20ScopeCaveats, mockCaveat],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should create a delegation with parent delegation authority', () => {
    const parentHash =
      '0x1234567890123456789012345678901234567890123456789012345678901234' as const;
    const result = createDelegation({
      environment: delegatorEnvironment,
      scope: erc20Scope,
      to: mockDelegate,
      from: mockDelegator,
      caveats: [mockCaveat],
      parentDelegation: parentHash,
    });

    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: parentHash,
      caveats: [...erc20ScopeCaveats, mockCaveat],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should create a delegation with caveats', () => {
    const caveats: Caveat[] = [
      {
        enforcer: '0x1111111111111111111111111111111111111111',
        terms: '0x',
        args: '0x',
      },
    ];

    const result = createDelegation({
      environment: delegatorEnvironment,
      scope: erc20Scope,
      to: mockDelegate,
      from: mockDelegator,
      caveats,
    });

    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [
        ...erc20ScopeCaveats,
        {
          enforcer: '0x1111111111111111111111111111111111111111',
          terms: '0x',
          args: '0x',
        },
      ],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should create a delegation with no additional caveats', () => {
    const result = createDelegation({
      environment: delegatorEnvironment,
      to: mockDelegate,
      from: mockDelegator,
      scope: erc20Scope,
      caveats: [],
    });

    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [...erc20ScopeCaveats],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should use the provided salt when specified', () => {
    const customSalt = '0xdeadbeef';
    const result = createDelegation({
      environment: delegatorEnvironment,
      scope: erc20Scope,
      to: mockDelegate,
      from: mockDelegator,
      caveats: [mockCaveat],
      salt: customSalt,
    });
    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [...erc20ScopeCaveats, mockCaveat],
      salt: customSalt,
      signature: '0x',
    });
  });
});

describe('createOpenDelegation', () => {
  it('should create a basic open delegation with root authority', () => {
    const result = createOpenDelegation({
      environment: delegatorEnvironment,
      scope: erc20Scope,
      from: mockDelegator,
      caveats: [mockCaveat],
    });

    expect(result).to.deep.equal({
      delegate: '0x0000000000000000000000000000000000000a11',
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [...erc20ScopeCaveats, mockCaveat],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should create an open delegation with parent delegation authority', () => {
    const parentHash =
      '0x1234567890123456789012345678901234567890123456789012345678901234' as const;
    const result = createOpenDelegation({
      environment: delegatorEnvironment,
      scope: erc20Scope,
      from: mockDelegator,
      caveats: [mockCaveat],
      parentDelegation: parentHash,
    });

    expect(result).to.deep.equal({
      delegate: '0x0000000000000000000000000000000000000a11',
      delegator: mockDelegator,
      authority: parentHash,
      caveats: [...erc20ScopeCaveats, mockCaveat],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should create an open delegation with caveats', () => {
    const caveats: Caveat[] = [
      {
        enforcer: '0x1111111111111111111111111111111111111111',
        terms: '0x',
        args: '0x',
      },
    ];

    const result = createOpenDelegation({
      environment: delegatorEnvironment,
      scope: erc20Scope,
      from: mockDelegator,
      caveats,
    });

    expect(result).to.deep.equal({
      delegate: '0x0000000000000000000000000000000000000a11',
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [
        ...erc20ScopeCaveats,
        {
          enforcer: '0x1111111111111111111111111111111111111111',
          terms: '0x',
          args: '0x',
        },
      ],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should use the provided salt when specified', () => {
    const customSalt = '0xdeadbeef';
    const result = createOpenDelegation({
      environment: delegatorEnvironment,
      scope: erc20Scope,
      from: mockDelegator,
      caveats: [mockCaveat],
      salt: customSalt,
    });
    expect(result).to.deep.equal({
      delegate: '0x0000000000000000000000000000000000000a11',
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [...erc20ScopeCaveats, mockCaveat],
      salt: customSalt,
      signature: '0x',
    });
  });
});

describe('encodeDelegations', () => {
  const mockDelegation1: Delegation = {
    delegate: mockDelegate,
    delegator: mockDelegator,
    authority: ROOT_AUTHORITY,
    caveats: [mockCaveat],
    salt: '0x123',
    signature: mockSignature,
  };

  const mockDelegation2: Delegation = {
    delegate: '0x2222222222222222222222222222222222222222',
    delegator: '0x3333333333333333333333333333333333333333',
    authority: ROOT_AUTHORITY,
    caveats: [
      {
        enforcer: '0x1111111111111111111111111111111111111111',
        terms: '0x',
        args: '0x',
      },
    ],
    salt: '0x456',
    signature: mockSignature,
  };

  it('should encode a single delegation', () => {
    const encoded = encodeDelegations([mockDelegation1]);
    const decoded = decodeDelegations(encoded);

    expect(decoded).to.have.length(1);
    expect(decoded).to.deep.equal([mockDelegation1]);
  });

  it('should encode multiple delegations', () => {
    const delegations = [mockDelegation1, mockDelegation2];
    const encoded = encodeDelegations(delegations);
    const decoded = decodeDelegations(encoded);

    expect(decoded).to.have.length(2);
    expect(decoded).to.deep.equal(delegations);
  });

  it('should handle delegations with caveats', () => {
    const delegations = [mockDelegation2];
    const encoded = encodeDelegations(delegations);
    const decoded = decodeDelegations(encoded);

    expect(decoded).to.have.length(1);
    expect(decoded).to.deep.equal([mockDelegation2]);
  });
});

describe('decodeDelegations', () => {
  const mockDelegation1: Delegation = {
    delegate: mockDelegate,
    delegator: mockDelegator,
    authority: ROOT_AUTHORITY,
    caveats: [mockCaveat],
    salt: '0x123',
    signature: mockSignature,
  };

  const mockDelegation2: Delegation = {
    delegate: '0x2222222222222222222222222222222222222222',
    delegator: '0x3333333333333333333333333333333333333333',
    authority: ROOT_AUTHORITY,
    caveats: [
      {
        enforcer: '0x1111111111111111111111111111111111111111',
        terms: '0x',
        args: '0x',
      },
    ],
    salt: '0x456',
    signature: mockSignature,
  };

  it('should decode a single delegation', () => {
    const encoded = encodeDelegations([mockDelegation1]);
    const decoded = decodeDelegations(encoded);

    expect(decoded).to.have.length(1);
    expect(decoded).to.deep.equal([mockDelegation1]);
  });

  it('should decode multiple delegations', () => {
    const delegations = [mockDelegation1, mockDelegation2];
    const encoded = encodeDelegations(delegations);
    const decoded = decodeDelegations(encoded);

    expect(decoded).to.have.length(2);
    expect(decoded).to.deep.equal(delegations);
  });

  it('should handle delegations with caveats', () => {
    const delegations = [mockDelegation2];
    const encoded = encodeDelegations(delegations);
    const decoded = decodeDelegations(encoded);

    expect(decoded).to.have.length(1);
    expect(decoded).to.deep.equal([mockDelegation2]);
  });
});

describe('encodePermissionContexts', () => {
  const mockDelegation1: Delegation = {
    delegate: mockDelegate,
    delegator: mockDelegator,
    authority: ROOT_AUTHORITY,
    caveats: [mockCaveat],
    salt: '0x123',
    signature: mockSignature,
  };

  const mockDelegation2: Delegation = {
    delegate: '0x2222222222222222222222222222222222222222',
    delegator: '0x3333333333333333333333333333333333333333',
    authority: ROOT_AUTHORITY,
    caveats: [
      {
        enforcer: '0x1111111111111111111111111111111111111111',
        terms: '0x',
        args: '0x',
      },
    ],
    salt: '0x456',
    signature: mockSignature,
  };

  it('should encode a single permission context', () => {
    const permissionContexts = [[mockDelegation1]];
    const encoded = encodePermissionContexts(permissionContexts);
    const decoded = decodePermissionContexts(encoded);

    expect(decoded).to.have.length(1);
    expect(decoded).to.deep.equal([[mockDelegation1]]);
  });

  it('should encode multiple permission contexts', () => {
    const permissionContexts = [[mockDelegation1], [mockDelegation2]];
    const encoded = encodePermissionContexts(permissionContexts);
    const decoded = decodePermissionContexts(encoded);

    expect(decoded).to.have.length(2);
    expect(decoded).to.deep.equal([[mockDelegation1], [mockDelegation2]]);
  });

  it('should handle permission contexts with multiple delegations', () => {
    const permissionContexts = [[mockDelegation1, mockDelegation2]];
    const encoded = encodePermissionContexts(permissionContexts);
    const decoded = decodePermissionContexts(encoded);

    expect(decoded).to.have.length(1);
    expect(decoded).to.deep.equal([[mockDelegation1, mockDelegation2]]);
  });

  it('should handle empty permission contexts', () => {
    const permissionContexts: Delegation[][] = [];
    const encoded = encodePermissionContexts(permissionContexts);
    const decoded = decodePermissionContexts(encoded);

    expect(decoded).to.have.length(0);
  });
});

describe('decodePermissionContexts', () => {
  const mockDelegation1: Delegation = {
    delegate: mockDelegate,
    delegator: mockDelegator,
    authority: ROOT_AUTHORITY,
    caveats: [mockCaveat],
    salt: '0x123',
    signature: mockSignature,
  };

  const mockDelegation2: Delegation = {
    delegate: '0x2222222222222222222222222222222222222222',
    delegator: '0x3333333333333333333333333333333333333333',
    authority: ROOT_AUTHORITY,
    caveats: [
      {
        enforcer: '0x1111111111111111111111111111111111111111',
        terms: '0x',
        args: '0x',
      },
    ],
    salt: '0x456',
    signature: mockSignature,
  };

  it('should decode a single permission context', () => {
    const permissionContexts = [[mockDelegation1]];
    const encoded = encodePermissionContexts(permissionContexts);
    const decoded = decodePermissionContexts(encoded);

    expect(decoded).to.have.length(1);
    expect(decoded).to.deep.equal([[mockDelegation1]]);
  });

  it('should decode multiple permission contexts', () => {
    const permissionContexts = [[mockDelegation1], [mockDelegation2]];
    const encoded = encodePermissionContexts(permissionContexts);
    const decoded = decodePermissionContexts(encoded);

    expect(decoded).to.have.length(2);
    expect(decoded).to.deep.equal([[mockDelegation1], [mockDelegation2]]);
  });

  it('should handle permission contexts with multiple delegations', () => {
    const permissionContexts = [[mockDelegation1, mockDelegation2]];
    const encoded = encodePermissionContexts(permissionContexts);
    const decoded = decodePermissionContexts(encoded);

    expect(decoded).to.have.length(1);
    expect(decoded).to.deep.equal([[mockDelegation1, mockDelegation2]]);
  });

  it('should handle empty permission contexts', () => {
    const permissionContexts: Delegation[][] = [];
    const encoded = encodePermissionContexts(permissionContexts);
    const decoded = decodePermissionContexts(encoded);

    expect(decoded).to.have.length(0);
  });
});

describe('signDelegation', () => {
  const mockSigner = {
    signTypedData: stub().resolves('mockSignature'),
    account: { address: '0xSignerAccount' },
    cacheTime: 0,
    chain: {},
    key: 'mockKey',
    name: 'mockName',
    transport: {},
  };

  const mockDelegation = {
    delegate: mockDelegate,
    delegator: mockDelegator,
    authority: ROOT_AUTHORITY as `0x${string}`,
    caveats: [mockCaveat],
    salt: '0x123' as `0x${string}`,
  };

  const delegationManager = '0xDelegationManager' as `0x${string}`;
  const chainId = 1;

  beforeEach(() => {
    mockSigner.signTypedData.resetHistory();
  });

  it('should sign a delegation successfully', async () => {
    const signature = await signDelegation({
      signer: mockSigner as any,
      delegation: mockDelegation,
      delegationManager,
      chainId,
    });

    expect(signature).to.equal('mockSignature');
    expect(mockSigner.signTypedData.calledOnce).to.equal(true);
  });

  it('should throw an error if no caveats are provided and allowInsecureUnrestrictedDelegation is false', async () => {
    const delegationWithoutCaveats = {
      ...mockDelegation,
      caveats: [],
      salt: '0x123' as `0x${string}`,
    };

    await expect(
      signDelegation({
        signer: mockSigner as any,
        delegation: delegationWithoutCaveats,
        delegationManager,
        chainId,
      }),
    ).rejects.toThrow(
      'No caveats found. If you definitely want to sign a delegation without caveats, set `allowInsecureUnrestrictedDelegation` to `true`.',
    );
  });

  it('should sign a delegation without caveats if allowInsecureUnrestrictedDelegation is true', async () => {
    const delegationWithoutCaveats = {
      ...mockDelegation,
      caveats: [],
      salt: '0x123' as `0x${string}`,
    };

    const signature = await signDelegation({
      signer: mockSigner as any,
      delegation: delegationWithoutCaveats,
      delegationManager,
      chainId,
      allowInsecureUnrestrictedDelegation: true,
    });

    expect(signature).to.equal('mockSignature');
    expect(mockSigner.signTypedData.calledOnce).to.equal(true);
  });
});
