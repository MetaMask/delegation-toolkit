import { describe, it, expect } from 'vitest';

import { createOwnershipCaveatBuilder } from '../../../src/caveatBuilder/scope/ownershipScope';
import type { OwnershipScopeConfig } from '../../../src/caveatBuilder/scope/ownershipScope';
import type { DeleGatorEnvironment } from '../../../src/types';
import { randomAddress } from '../../utils';

describe('createOwnershipTransferCaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      OwnershipTransferEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates an Ownership Transfer CaveatBuilder', () => {
    const config: OwnershipScopeConfig = {
      type: 'ownership',
      contractAddress: randomAddress(),
    };

    const caveatBuilder = createOwnershipCaveatBuilder(environment, config);

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.OwnershipTransferEnforcer,
        args: '0x',
        terms: config.contractAddress,
      },
    ]);
  });

  it('throws an error for invalid configuration', () => {
    const config = { type: 'ownership' } as unknown as OwnershipScopeConfig;

    expect(() => createOwnershipCaveatBuilder(environment, config)).to.throw(
      'Invalid ownership transfer configuration',
    );
  });
});
