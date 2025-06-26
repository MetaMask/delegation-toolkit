import { expect } from 'chai';
import { concat, size, toHex } from 'viem';

import { valueLteBuilder } from '../../src/caveatBuilder/valueLteBuilder';
import type { DeleGatorEnvironment } from '../../src/types';
import { randomAddress } from '../utils';

describe('valueLteEnforcerBuilder()', () => {
  const EXPECTED_TERMS_LENGTH = 32; // 32 bytes for the max value

  const environment = {
    caveatEnforcers: { ValueLteEnforcer: randomAddress() },
  } as any as DeleGatorEnvironment;

  const buildWithMaxValue = (maxValue: bigint) => {
    return valueLteBuilder(environment, maxValue);
  };

  describe('validation', () => {
    it('should fail with negative max value', () => {
      expect(() => buildWithMaxValue(-1n)).to.throw(
        'Invalid maxValue: must be greater than or equal to zero',
      );
    });

    it('should allow positive max value', () => {
      expect(() => buildWithMaxValue(0n)).to.not.throw();
      expect(() => buildWithMaxValue(1000000000000000000n)).to.not.throw();
    });
  });

  describe('builds a caveat', () => {
    it('should build a caveat with a max value of zero', () => {
      const maxValue = 0n;
      const caveat = buildWithMaxValue(maxValue);
      const terms = concat([toHex(maxValue, { size: 32 })]);

      expect(caveat).to.deep.equal({
        enforcer: environment.caveatEnforcers.ValueLteEnforcer,
        terms,
        args: '0x',
      });
    });

    it('should build a caveat with a valid max value', () => {
      const maxValue = 1000000000000000000n;
      const caveat = buildWithMaxValue(maxValue);
      const terms = concat([toHex(maxValue, { size: 32 })]);

      expect(caveat).to.deep.equal({
        enforcer: environment.caveatEnforcers.ValueLteEnforcer,
        terms,
        args: '0x',
      });
    });
  });

  it('should create a caveat with terms length matching number of targets', () => {
    const maxValue = 1000000000000000000n;
    const caveat = buildWithMaxValue(maxValue);

    expect(size(caveat.terms)).to.equal(EXPECTED_TERMS_LENGTH);
  });
});
