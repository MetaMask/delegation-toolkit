import { concat, toHex } from 'viem';
import type { Address } from 'viem';
import { expect, describe, it } from 'vitest';

import { exactExecutionBuilder } from '../../src/caveatBuilder/exactExecutionBuilder';
import type { DeleGatorEnvironment } from '../../src/types';
import { randomAddress } from '../utils';

describe('exactExecutionBuilder()', () => {
  const environment = {
    caveatEnforcers: { ExactExecutionEnforcer: randomAddress() },
  } as any as DeleGatorEnvironment;

  const buildWithParams = (execution: {
    target: Address;
    value: bigint;
    callData: `0x${string}`;
  }) => {
    return exactExecutionBuilder(environment, execution);
  };

  describe('validation', () => {
    it('should fail with an invalid target address', () => {
      const invalidAddress = 'invalid-address' as Address;
      expect(() =>
        buildWithParams({
          target: invalidAddress,
          value: 0n,
          callData: '0x',
        }),
      ).to.throw('Invalid target: must be a valid address');
    });

    it('should fail with a negative value', () => {
      expect(() =>
        buildWithParams({
          target: randomAddress(),
          value: -1n,
          callData: '0x',
        }),
      ).to.throw('Invalid value: must be a non-negative number');
    });

    it('should fail with invalid callData format', () => {
      expect(() =>
        buildWithParams({
          target: randomAddress(),
          value: 0n,
          callData: 'invalid' as `0x${string}`,
        }),
      ).to.throw('Invalid callData: must be a hex string starting with 0x');
    });

    it('should allow valid addresses that are not checksummed', () => {
      const nonChecksummedAddress = randomAddress().toLowerCase() as Address;
      expect(() =>
        buildWithParams({
          target: nonChecksummedAddress,
          value: 0n,
          callData: '0x',
        }),
      ).to.not.throw();
    });
  });

  describe('builds a caveat', () => {
    it('should build a caveat with valid parameters', () => {
      const execution = {
        target: randomAddress(),
        value: 1000000000000000000n, // 1 ETH
        callData: '0x12345678' as const,
      };

      const caveat = buildWithParams(execution);

      expect(caveat.enforcer).to.equal(
        environment.caveatEnforcers.ExactExecutionEnforcer,
      );
      expect(caveat.args).to.equal('0x');

      // Verify terms encoding matches ExactExecutionEnforcer.sol:
      // - First 20 bytes: target address
      // - Next 32 bytes: value (uint256)
      // - Remaining bytes: calldata
      const expectedTerms = concat([
        execution.target,
        toHex(execution.value, { size: 32 }),
        execution.callData,
      ]);
      expect(caveat.terms).to.equal(expectedTerms);
    });
  });
});
