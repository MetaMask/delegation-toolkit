import type { Hex } from 'viem';
import { concat, size, slice, toHex } from 'viem';
import { expect, describe, it } from 'vitest';

import type { TokenPeriodConfig } from '../../src/caveatBuilder/multiTokenPeriodBuilder';
import {
  multiTokenPeriodBuilder,
  multiTokenPeriod,
} from '../../src/caveatBuilder/multiTokenPeriodBuilder';
import type { DeleGatorEnvironment } from '../../src/types';
import { randomAddress } from '../utils';

const LENGTH_PER_CONFIG = 116;

describe('multiTokenPeriodBuilder', () => {
  const mockEnvironment: DeleGatorEnvironment = {
    caveatEnforcers: {
      MultiTokenPeriodEnforcer: randomAddress(),
    },
  } as any as DeleGatorEnvironment;

  const mockConfig: TokenPeriodConfig = {
    token: randomAddress(),
    periodAmount: 1000n,
    periodDuration: 86400, // 1 day in seconds
    startDate: 1672531200, // Jan 1, 2023 00:00:00 UTC
  };

  const secondMockConfig: TokenPeriodConfig = {
    token: randomAddress(),
    periodAmount: 2000n,
    periodDuration: 3600, // 1 hour in seconds
    startDate: 1672531200, // Jan 1, 2023 00:00:00 UTC
  };

  it('should have the correct name constant', () => {
    expect(multiTokenPeriod).to.equal('multiTokenPeriod');
  });

  it('should encode a single token configuration correctly', () => {
    const result = multiTokenPeriodBuilder(mockEnvironment, [mockConfig]);

    expect(size(result.terms)).to.equal(LENGTH_PER_CONFIG);

    expect(slice(result.terms, 0, 20)).to.equal(mockConfig.token);
    expect(result.enforcer).to.equal(
      mockEnvironment.caveatEnforcers.MultiTokenPeriodEnforcer,
    );
    expect(result.args).to.equal('0x');
  });

  it('should encode multiple token correctly', () => {
    const result = multiTokenPeriodBuilder(mockEnvironment as any, [
      mockConfig,
      secondMockConfig,
    ]);

    expect(result.enforcer).to.equal(
      mockEnvironment.caveatEnforcers.MultiTokenPeriodEnforcer,
    );
    expect(result.args).to.equal('0x');
    expect(result.terms).to.equal(
      concat([
        mockConfig.token,
        toHex(mockConfig.periodAmount, { size: 32 }),
        toHex(mockConfig.periodDuration, { size: 32 }),
        toHex(mockConfig.startDate, { size: 32 }),
        secondMockConfig.token,
        toHex(secondMockConfig.periodAmount, { size: 32 }),
        toHex(secondMockConfig.periodDuration, { size: 32 }),
        toHex(secondMockConfig.startDate, { size: 32 }),
      ]),
    );
  });

  it('should throw error for empty configs array', () => {
    expect(() => multiTokenPeriodBuilder(mockEnvironment as any, [])).to.throw(
      'MultiTokenPeriodBuilder: configs array cannot be empty',
    );
  });

  it('should encode numeric values correctly', () => {
    const result = multiTokenPeriodBuilder(mockEnvironment as any, [
      mockConfig,
    ]);
    expect(slice(result.terms, 20, 20 + 32)).to.equal(
      toHex(mockConfig.periodAmount, { size: 32 }),
    );
    expect(slice(result.terms, 20 + 32, 20 + 32 + 32)).to.equal(
      toHex(mockConfig.periodDuration, { size: 32 }),
    );
  });

  it('should validate terms length is multiple of 116 bytes', () => {
    const result = multiTokenPeriodBuilder(mockEnvironment as any, [
      mockConfig,
      secondMockConfig,
    ]);
    expect(size(result.terms)).to.equal(LENGTH_PER_CONFIG * 2);
  });

  it('should throw error for invalid token address', () => {
    expect(() =>
      multiTokenPeriodBuilder(mockEnvironment as any, [
        { ...mockConfig, token: 'invalid' as Hex },
      ]),
    ).to.throw('Invalid token address: invalid');
  });

  it('should throw error for invalid period amount', () => {
    expect(() =>
      multiTokenPeriodBuilder(mockEnvironment as any, [
        { ...mockConfig, periodAmount: 0n },
      ]),
    ).to.throw('Invalid period amount: must be greater than 0');
  });

  it('should throw error for invalid period duration', () => {
    expect(() =>
      multiTokenPeriodBuilder(mockEnvironment as any, [
        { ...mockConfig, periodDuration: 0 },
      ]),
    ).to.throw('Invalid period duration: must be greater than 0');
  });
});
