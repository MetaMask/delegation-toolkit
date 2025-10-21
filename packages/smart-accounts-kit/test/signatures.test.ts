import { describe, it, expect } from 'vitest';

import type { PartialSignature } from '../src/signatures';
import { aggregateSignature } from '../src/signatures';

describe('aggregateSignature', () => {
  it('should aggregate signatures in the correct order', () => {
    const signatures = [
      {
        signer: '0x2222222222222222222222222222222222222222',
        signature:
          '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
        type: 'ECDSA',
      },
      {
        signer: '0x1111111111111111111111111111111111111111',
        signature:
          '0x22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
        type: 'ECDSA',
      },
    ] as PartialSignature[];

    const result = aggregateSignature({ signatures });

    // The signatures should be concatenated in order of signer address
    expect(result).to.equal(
      '0x2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222211111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
    );
  });

  it('should handle empty signature array', () => {
    const result = aggregateSignature({ signatures: [] });
    expect(result).to.equal('0x');
  });

  it('should handle single signature', () => {
    const signatures = [
      {
        signer: '0x1111111111111111111111111111111111111111',
        signature:
          '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
        type: 'ECDSA',
      },
    ] as PartialSignature[];

    const result = aggregateSignature({ signatures });
    expect(result).to.equal(
      '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
    );
  });

  it('should throw with non-ECDSA signatures', () => {
    const signatures = [
      {
        signer: '0x1111111111111111111111111111111111111111',
        signature:
          '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
        type: 'ECDSA',
      },
      {
        signer: '0x2222222222222222222222222222222222222222',
        signature:
          '0x22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
        type: '1271',
      },
    ] as PartialSignature[];

    expect(() => aggregateSignature({ signatures })).to.throw(
      'Invalid signature type: 1271',
    );
  });
});
