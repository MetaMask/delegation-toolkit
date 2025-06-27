import { expect } from 'chai';
import { stub } from 'sinon';

import { resolveCaveats } from '../src/caveatBuilder';
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
} from '../src/delegation';
import type { Caveat, Delegation } from '../src/types';

const mockDelegate = '0x1234567890123456789012345678901234567890' as const;
const mockDelegator = '0x0987654321098765432109876543210987654321' as const;
const mockSignature =
  '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as const;

describe('toDelegationStruct', () => {
  it('should convert a basic delegation to struct', () => {
    const delegation: Delegation = {
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [],
      salt: '0x123',
      signature: mockSignature,
    };

    const result = toDelegationStruct(delegation);
    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [],
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
      caveats: [],
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
      to: mockDelegate,
      from: mockDelegator,
      caveats: [],
    });

    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should create a delegation with parent delegation authority', () => {
    const parentHash =
      '0x1234567890123456789012345678901234567890123456789012345678901234' as const;
    const result = createDelegation({
      to: mockDelegate,
      from: mockDelegator,
      caveats: [],
      parentDelegation: parentHash,
    });

    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: parentHash,
      caveats: [],
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
      to: mockDelegate,
      from: mockDelegator,
      caveats,
    });

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
      salt: '0x',
      signature: '0x',
    });
  });

  it('should use the provided salt when specified', () => {
    const customSalt = '0xdeadbeef';
    const result = createDelegation({
      to: mockDelegate,
      from: mockDelegator,
      caveats: [],
      salt: customSalt,
    });
    expect(result).to.deep.equal({
      delegate: mockDelegate,
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [],
      salt: customSalt,
      signature: '0x',
    });
  });
});

describe('createOpenDelegation', () => {
  it('should create a basic open delegation with root authority', () => {
    const result = createOpenDelegation({
      from: mockDelegator,
      caveats: [],
    });

    expect(result).to.deep.equal({
      delegate: '0x0000000000000000000000000000000000000a11',
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [],
      salt: '0x',
      signature: '0x',
    });
  });

  it('should create an open delegation with parent delegation authority', () => {
    const parentHash =
      '0x1234567890123456789012345678901234567890123456789012345678901234' as const;
    const result = createOpenDelegation({
      from: mockDelegator,
      caveats: [],
      parentDelegation: parentHash,
    });

    expect(result).to.deep.equal({
      delegate: '0x0000000000000000000000000000000000000a11',
      delegator: mockDelegator,
      authority: parentHash,
      caveats: [],
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
      from: mockDelegator,
      caveats,
    });

    expect(result).to.deep.equal({
      delegate: '0x0000000000000000000000000000000000000a11',
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [
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
      from: mockDelegator,
      caveats: [],
      salt: customSalt,
    });
    expect(result).to.deep.equal({
      delegate: '0x0000000000000000000000000000000000000a11',
      delegator: mockDelegator,
      authority: ROOT_AUTHORITY,
      caveats: [],
      salt: customSalt,
      signature: '0x',
    });
  });
});

describe('resolveCaveats', () => {
  it('should return the same array when given a Caveat array', () => {
    const caveats: Caveat[] = [
      {
        enforcer: '0x1111111111111111111111111111111111111111',
        terms: '0x',
        args: '0x',
      },
    ];

    const result = resolveCaveats(caveats);
    expect(result).to.equal(caveats);
    expect(result).to.deep.equal(caveats);
  });

  it('should call build() and return result when given a CaveatBuilder', () => {
    const mockCaveats: Caveat[] = [
      {
        enforcer: '0x1111111111111111111111111111111111111111',
        terms: '0x',
        args: '0x',
      },
    ];

    const mockBuilder = {
      build: stub().returns(mockCaveats),
    };

    const result = resolveCaveats(mockBuilder as any);

    expect(mockBuilder.build.calledOnce).to.equal(true);
    expect(result).to.deep.equal(mockCaveats);
  });

  it('should handle build() throwing an error', () => {
    const mockBuilder = {
      build: stub().throws(new Error('Build failed')),
    };

    expect(() => resolveCaveats(mockBuilder as any)).to.throw('Build failed');
    expect(mockBuilder.build.calledOnce).to.equal(true);
  });
});

describe('encodeDelegations', () => {
  const mockDelegation1: Delegation = {
    delegate: mockDelegate,
    delegator: mockDelegator,
    authority: ROOT_AUTHORITY,
    caveats: [],
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
    caveats: [],
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
    caveats: [],
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
    caveats: [],
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
