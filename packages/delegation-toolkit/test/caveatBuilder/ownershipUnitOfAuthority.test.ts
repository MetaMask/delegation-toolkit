import { expect } from 'chai';
import { createOwnershipTransferCaveatBuilder } from '../../src/caveatBuilder/ownershipUnitOfAuthority';
import type { OwnershipUnitOfAuthorityConfig } from '../../src/caveatBuilder/ownershipUnitOfAuthority';
import { randomAddress } from '../utils';
import { DeleGatorEnvironment } from 'src';

describe('createOwnershipTransferCaveatBuilder', () => {
  const environment = {
    caveatEnforcers: {
      OwnershipTransferEnforcer: randomAddress(),
    },
  } as unknown as DeleGatorEnvironment;

  it('creates an Ownership Transfer CaveatBuilder', () => {
    const config: OwnershipUnitOfAuthorityConfig = {
      targetContract: randomAddress(),
    };

    const caveatBuilder = createOwnershipTransferCaveatBuilder(
      environment,
      config,
    );

    const caveats = caveatBuilder.build();

    expect(caveats).to.deep.equal([
      {
        enforcer: environment.caveatEnforcers.OwnershipTransferEnforcer,
        args: '0x',
        terms: config.targetContract,
      },
    ]);
  });

  it('throws an error for invalid configuration', () => {
    const config: any = {};

    expect(() =>
      createOwnershipTransferCaveatBuilder(environment, config),
    ).to.throw('Invalid ownership transfer configuration');
  });
});
