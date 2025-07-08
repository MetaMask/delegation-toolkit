import type { Address } from 'viem';
import { size } from 'viem';
import { expect, describe, it } from 'vitest';

import { erc20StreamingBuilder } from '../../src/caveatBuilder/erc20StreamingBuilder';
import { TIMESTAMP_UPPER_BOUND_SECONDS } from '../../src/caveatBuilder/shared';
import type { DeleGatorEnvironment } from '../../src/types';
import { randomAddress } from '../utils';

describe('erc20StreamingBuilder()', () => {
  const EXPECTED_TERMS_LENGTH = 148; // 148 bytes for the allowance

  const environment = {
    caveatEnforcers: { ERC20StreamingEnforcer: randomAddress() },
  } as any as DeleGatorEnvironment;

  const buildWithParams = (
    tokenAddress: Address,
    initialAmount: bigint,
    maxAmount: bigint,
    amountPerSecond: bigint,
    startTime: number,
  ) => {
    return erc20StreamingBuilder(
      environment,
      tokenAddress,
      initialAmount,
      maxAmount,
      amountPerSecond,
      startTime,
    );
  };

  describe('validation', () => {
    it('should fail with an invalid token address', () => {
      const invalidAddress = 'invalid-address' as Address;
      expect(() =>
        buildWithParams(invalidAddress, 1000n, 1000n, 1n, 1),
      ).to.throw('Invalid tokenAddress: must be a valid address');
    });

    it('should fail with a non-positive initial amount', () => {
      const validAddress = randomAddress();

      expect(() => buildWithParams(validAddress, -1n, 1000n, 1n, 1)).to.throw(
        'Invalid initialAmount: must be greater than zero',
      );
    });

    it('should fail with a non-positive max amount', () => {
      const validAddress = randomAddress();
      expect(() => buildWithParams(validAddress, 1000n, 0n, 1n, 1)).to.throw(
        'Invalid maxAmount: must be a positive number',
      );
      expect(() => buildWithParams(validAddress, 1000n, -1n, 1n, 1)).to.throw(
        'Invalid maxAmount: must be a positive number',
      );
    });

    it('should fail with a non-positive amount per second', () => {
      const validAddress = randomAddress();
      expect(() => buildWithParams(validAddress, 1000n, 1000n, 0n, 1)).to.throw(
        'Invalid amountPerSecond: must be a positive number',
      );
      expect(() =>
        buildWithParams(validAddress, 1000n, 1000n, -1n, 1),
      ).to.throw('Invalid amountPerSecond: must be a positive number');
    });

    it('should fail with a non-positive start time', () => {
      const validAddress = randomAddress();
      expect(() => buildWithParams(validAddress, 1000n, 1000n, 1n, 0)).to.throw(
        'Invalid startTime: must be a positive number',
      );
      expect(() =>
        buildWithParams(validAddress, 1000n, 1000n, 1n, -1),
      ).to.throw('Invalid startTime: must be a positive number');
    });

    it('should fail when start time is greater than the upper bound', () => {
      expect(() =>
        buildWithParams(
          randomAddress(),
          1000n,
          1000n,
          1n,
          TIMESTAMP_UPPER_BOUND_SECONDS + 1,
        ),
      ).to.throw(
        'Invalid startTime: must be less than or equal to 253402300799',
      );
    });

    it('should build terms of the correct length', () => {
      const { terms } = buildWithParams(randomAddress(), 1000n, 1000n, 1n, 1);

      expect(size(terms)).to.equal(EXPECTED_TERMS_LENGTH);
    });
  });
});
