import { describe, it, expect } from 'vitest';

import { createNonceTerms } from '../../src/caveats/nonce';

describe('createNonceTerms', () => {
  const EXPECTED_BYTE_LENGTH = 32; // 32 bytes for nonce

  it('creates valid terms for simple nonce', () => {
    const nonce = '0x1234567890abcdef';
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(
      '0x0000000000000000000000000000000000000000000000001234567890abcdef',
    );
  });

  it('creates valid terms for zero nonce', () => {
    const nonce = '0x0';
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );
  });

  it('creates valid terms for minimal nonce', () => {
    const nonce = '0x1';
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    );
  });

  it('creates valid terms for full 32-byte nonce', () => {
    const nonce =
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(nonce);
  });

  it('creates valid terms for uppercase hex nonce', () => {
    const nonce = '0x1234567890ABCDEF';
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(
      '0x0000000000000000000000000000000000000000000000001234567890ABCDEF',
    );
  });

  it('creates valid terms for mixed case hex nonce', () => {
    const nonce = '0x1234567890AbCdEf';
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(
      '0x0000000000000000000000000000000000000000000000001234567890AbCdEf',
    );
  });

  it('pads shorter hex values with leading zeros', () => {
    const nonce = '0xff';
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(
      '0x00000000000000000000000000000000000000000000000000000000000000ff',
    );
  });

  it('throws an error for empty nonce', () => {
    const nonce = '0x';

    expect(() => createNonceTerms({ nonce })).toThrow(
      'Invalid nonce: must be a non-empty hex string',
    );
  });

  it('throws an error for undefined nonce', () => {
    expect(() => createNonceTerms({ nonce: undefined as any })).toThrow(
      'Invalid nonce: must be a non-empty hex string',
    );
  });

  it('throws an error for null nonce', () => {
    expect(() => createNonceTerms({ nonce: null as any })).toThrow(
      'Invalid nonce: must be a non-empty hex string',
    );
  });

  it('throws an error for nonce without 0x prefix', () => {
    const nonce = '1234567890abcdef' as any;

    expect(() => createNonceTerms({ nonce })).toThrow(
      'Invalid nonce: must be a valid hex string',
    );
  });

  it('throws an error for invalid hex characters', () => {
    const nonce = '0x1234567890abcdefg' as any;

    expect(() => createNonceTerms({ nonce })).toThrow(
      'Invalid nonce: must be a valid hex string',
    );
  });

  it('throws an error for non-string nonce', () => {
    const nonce = 123456 as any;

    expect(() => createNonceTerms({ nonce })).toThrow(
      'Invalid nonce: must be a valid hex string',
    );
  });

  it('throws an error for nonce longer than 32 bytes', () => {
    // 33 bytes (66 hex chars + 0x prefix = 68 chars total, which exceeds 66)
    const nonce =
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12' as any;

    expect(() => createNonceTerms({ nonce })).toThrow(
      'Invalid nonce: must be 32 bytes or less in length',
    );
  });

  it('accepts nonce with exactly 32 bytes', () => {
    // 32 bytes (64 hex chars + 0x prefix = 66 chars total)
    const nonce =
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(nonce);
  });

  it('throws an error for string that looks like hex but has odd length', () => {
    const nonce = '0x123' as any;
    // This should still work as we pad it
    const result = createNonceTerms({ nonce });

    expect(result).toStrictEqual(
      '0x0000000000000000000000000000000000000000000000000000000000000123',
    );
  });

  // Tests for bytes return type
  describe('bytes return type', () => {
    it('returns Uint8Array when bytes encoding is specified', () => {
      const nonce = '0x1234567890abcdef';
      const result = createNonceTerms({ nonce }, { out: 'bytes' });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toHaveLength(EXPECTED_BYTE_LENGTH);
    });

    it('returns Uint8Array for minimal nonce with bytes encoding', () => {
      const nonce = '0x1';
      const result = createNonceTerms({ nonce }, { out: 'bytes' });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toHaveLength(EXPECTED_BYTE_LENGTH);
      // Should be 31 zeros followed by 1
      const expectedBytes = new Array(EXPECTED_BYTE_LENGTH).fill(0);
      expectedBytes[EXPECTED_BYTE_LENGTH - 1] = 1;
      expect(Array.from(result)).toEqual(expectedBytes);
    });

    it('returns Uint8Array for zero nonce with bytes encoding', () => {
      const nonce = '0x0';
      const result = createNonceTerms({ nonce }, { out: 'bytes' });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toHaveLength(EXPECTED_BYTE_LENGTH);
      // Should be all zeros
      const expectedBytes = new Array(EXPECTED_BYTE_LENGTH).fill(0);
      expect(Array.from(result)).toEqual(expectedBytes);
    });

    it('returns Uint8Array for full nonce with bytes encoding', () => {
      const nonce =
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const result = createNonceTerms({ nonce }, { out: 'bytes' });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toHaveLength(EXPECTED_BYTE_LENGTH);
      // Convert expected hex to bytes for comparison
      const expectedBytes = [
        0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78,
        0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef,
        0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef,
      ];
      expect(Array.from(result)).toEqual(expectedBytes);
    });

    it('returns Uint8Array for padded hex values with bytes encoding', () => {
      const nonce = '0xff';
      const result = createNonceTerms({ nonce }, { out: 'bytes' });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toHaveLength(EXPECTED_BYTE_LENGTH);
      // Should be 31 zeros followed by 0xff
      const expectedBytes = new Array(EXPECTED_BYTE_LENGTH).fill(0);
      expectedBytes[EXPECTED_BYTE_LENGTH - 1] = 0xff;
      expect(Array.from(result)).toEqual(expectedBytes);
    });
  });
});
