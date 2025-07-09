import { size } from 'viem';
import { expect, describe, it } from 'vitest';

import { nativeTokenStreamingBuilder } from '../../src/caveatBuilder/nativeTokenStreamingBuilder';
import { TIMESTAMP_UPPER_BOUND_SECONDS } from '../../src/caveatBuilder/shared';
import type { DeleGatorEnvironment } from '../../src/types';

describe('nativeTokenStreamingBuilder()', () => {
  const EXPECTED_TERMS_LENGTH = 128; // 128 bytes for the allowance (4 uint256 values)

  const environment = {
    caveatEnforcers: {
      NativeTokenStreamingEnforcer:
        '0x1234567890123456789012345678901234567890',
    },
  } as any as DeleGatorEnvironment;

  const buildWithParams = (
    initialAmount: bigint,
    maxAmount: bigint,
    amountPerSecond: bigint,
    startTime: number,
  ) => {
    const config = { initialAmount, maxAmount, amountPerSecond, startTime };
    return nativeTokenStreamingBuilder(environment, config);
  };

  describe('validation', () => {
    it('should fail with a negative initial amount', () => {
      expect(() => buildWithParams(-1n, 1000n, 1n, 1)).to.throw(
        'Invalid initialAmount: must be greater than zero',
      );
    });

    it('should fail with a non-positive max amount', () => {
      expect(() => buildWithParams(1000n, 0n, 1n, 1)).to.throw(
        'Invalid maxAmount: must be a positive number',
      );
      expect(() => buildWithParams(1000n, -1n, 1n, 1)).to.throw(
        'Invalid maxAmount: must be a positive number',
      );
    });

    it('should fail when max amount is less than initial amount', () => {
      expect(() => buildWithParams(1000n, 500n, 1n, 1)).to.throw(
        'Invalid maxAmount: must be greater than initialAmount',
      );
    });

    it('should fail with a non-positive amount per second', () => {
      expect(() => buildWithParams(1000n, 1000n, 0n, 1)).to.throw(
        'Invalid amountPerSecond: must be a positive number',
      );
      expect(() => buildWithParams(1000n, 1000n, -1n, 1)).to.throw(
        'Invalid amountPerSecond: must be a positive number',
      );
    });

    it('should fail with a non-positive start time', () => {
      expect(() => buildWithParams(1000n, 1000n, 1n, 0)).to.throw(
        'Invalid startTime: must be a positive number',
      );
      expect(() => buildWithParams(1000n, 1000n, 1n, -1)).to.throw(
        'Invalid startTime: must be a positive number',
      );
    });

    it('should fail when start time is greater than the upper bound', () => {
      expect(() =>
        buildWithParams(1000n, 1000n, 1n, TIMESTAMP_UPPER_BOUND_SECONDS + 1),
      ).to.throw(
        'Invalid startTime: must be less than or equal to 253402300799',
      );
    });

    it('should build terms of the correct length', () => {
      const { terms } = buildWithParams(1000n, 2000n, 1n, 1);

      expect(size(terms)).to.equal(EXPECTED_TERMS_LENGTH);
    });

    it('should use the correct enforcer address', () => {
      const { enforcer } = buildWithParams(1000n, 2000n, 1n, 1);

      expect(enforcer).to.equal(
        environment.caveatEnforcers.NativeTokenStreamingEnforcer,
      );
    });
  });
});
