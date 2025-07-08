import { concat, size, toHex } from 'viem';
import { expect, describe, it } from 'vitest';

import { blockNumberBuilder } from '../../src/caveatBuilder/blockNumberBuilder';
import type { DeleGatorEnvironment } from '../../src/types';
import { randomAddress } from '../utils';

describe('blockNumberBuilder()', () => {
  const EXPECTED_TERMS_LENGTH = 32; // 16 bytes for blockAfterThreshold + 16 bytes for blockBeforeThreshold

  const environment = {
    caveatEnforcers: { BlockNumberEnforcer: randomAddress() },
  } as any as DeleGatorEnvironment;

  const buildWithThresholds = (
    blockAfterThreshold: bigint,
    blockBeforeThreshold: bigint,
  ) => {
    return blockNumberBuilder(
      environment,
      blockAfterThreshold,
      blockBeforeThreshold,
    );
  };

  describe('validation', () => {
    it('should fail when both thresholds are zero', () => {
      expect(() => buildWithThresholds(0n, 0n)).to.throw(
        'Invalid thresholds: At least one of blockAfterThreshold or blockBeforeThreshold must be specified',
      );
    });

    it('should fail when blockAfterThreshold is greater than or equal to blockBeforeThreshold', () => {
      expect(() => buildWithThresholds(10n, 5n)).to.throw(
        'Invalid thresholds: blockAfterThreshold must be less than blockBeforeThreshold if both are specified',
      );
      expect(() => buildWithThresholds(10n, 10n)).to.throw(
        'Invalid thresholds: blockAfterThreshold must be less than blockBeforeThreshold if both are specified',
      );
    });
  });

  describe('builds a caveat', () => {
    it('should build a caveat with valid thresholds', () => {
      const blockAfterThreshold = 5n;
      const blockBeforeThreshold = 10n;

      const caveat = buildWithThresholds(
        blockAfterThreshold,
        blockBeforeThreshold,
      );

      const terms = concat([
        toHex(blockAfterThreshold, {
          size: 16,
        }),
        toHex(blockBeforeThreshold, {
          size: 16,
        }),
      ]);

      expect(caveat).to.deep.equal({
        enforcer: environment.caveatEnforcers.BlockNumberEnforcer,
        terms,
        args: '0x',
      });
    });

    it('should build a caveat with only blockAfterThreshold', () => {
      const blockAfterThreshold = 5n;
      const blockBeforeThreshold = 0n;

      const caveat = buildWithThresholds(
        blockAfterThreshold,
        blockBeforeThreshold,
      );
      const terms = concat([
        toHex(blockAfterThreshold, {
          size: 16,
        }),
        toHex(blockBeforeThreshold, {
          size: 16,
        }),
      ]);

      expect(caveat).to.deep.equal({
        enforcer: environment.caveatEnforcers.BlockNumberEnforcer,
        terms,
        args: '0x',
      });
    });

    it('should build a caveat with only blockBeforeThreshold', () => {
      const blockAfterThreshold = 0n;
      const blockBeforeThreshold = 10n;

      const caveat = buildWithThresholds(
        blockAfterThreshold,
        blockBeforeThreshold,
      );
      const terms = concat([
        toHex(blockAfterThreshold, {
          size: 16,
        }),
        toHex(blockBeforeThreshold, {
          size: 16,
        }),
      ]);

      expect(caveat).to.deep.equal({
        enforcer: environment.caveatEnforcers.BlockNumberEnforcer,
        terms,
        args: '0x',
      });
    });
  });

  it('should create a caveat with terms length matching number of targets', () => {
    const blockAfterThreshold = 5n;
    const blockBeforeThreshold = 10n;

    const caveat = buildWithThresholds(
      blockAfterThreshold,
      blockBeforeThreshold,
    );

    expect(size(caveat.terms)).to.equal(EXPECTED_TERMS_LENGTH);
  });
});
