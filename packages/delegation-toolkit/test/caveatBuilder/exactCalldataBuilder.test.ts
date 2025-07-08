import { expect, describe, it } from 'vitest';

import { exactCalldataBuilder } from '../../src/caveatBuilder/exactCalldataBuilder';
import type { DeleGatorEnvironment } from '../../src/types';
import { randomAddress } from '../utils';

describe('exactCalldataBuilder()', () => {
  const environment = {
    caveatEnforcers: { ExactCalldataEnforcer: randomAddress() },
  } as any as DeleGatorEnvironment;

  const buildWithParams = (callData: `0x${string}`) => {
    return exactCalldataBuilder(environment, callData);
  };

  describe('validation', () => {
    it('should fail with invalid callData format', () => {
      expect(() => buildWithParams('invalid' as `0x${string}`)).to.throw(
        'Invalid callData: must be a hex string starting with 0x',
      );
    });
  });

  describe('builds a caveat', () => {
    it('should build a caveat with valid parameters', () => {
      const callData = '0x1234567890abcdef' as const;

      const caveat = buildWithParams(callData);

      expect(caveat.enforcer).to.equal(
        environment.caveatEnforcers.ExactCalldataEnforcer,
      );
      expect(caveat.args).to.equal('0x');
      expect(caveat.terms).to.equal(callData);
    });
  });
});
