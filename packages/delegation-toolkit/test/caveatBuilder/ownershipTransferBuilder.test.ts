import { size, type Address } from 'viem';
import { expect, describe, it } from 'vitest';

import { ownershipTransferBuilder } from '../../src/caveatBuilder/ownershipTransferBuilder';
import type { DeleGatorEnvironment } from '../../src/types';
import { randomAddress } from '../utils';

describe('ownershipTransferBuilder()', () => {
  const EXPECTED_TERMS_LENGTH = 20; // 20 bytes for the target contract address

  const environment = {
    caveatEnforcers: { OwnershipTransferEnforcer: randomAddress() },
  } as any as DeleGatorEnvironment;

  const buildWithParams = (targetContract: Address) => {
    return ownershipTransferBuilder(environment, targetContract);
  };

  describe('builds a caveat', () => {
    it('should build a caveat with valid parameters', () => {
      const targetContract = randomAddress();

      const caveat = buildWithParams(targetContract);

      expect(caveat).to.deep.equal({
        enforcer: environment.caveatEnforcers.OwnershipTransferEnforcer,
        terms: targetContract,
        args: '0x',
      });
    });
  });

  it('should create a caveat with terms of the correct length', () => {
    const targetContract = randomAddress();

    const caveat = buildWithParams(targetContract);

    expect(size(caveat.terms)).to.equal(EXPECTED_TERMS_LENGTH);
  });
});
