import { describe, it, expect } from 'vitest';

import {
  getDeleGatorEnvironment,
  overrideDeployedEnvironment,
} from '../src/delegatorEnvironment';
import { type DeleGatorEnvironment } from '../src/types';

describe('DelegatorEnvironment', () => {
  describe('overrideDeployedEnvironment', () => {
    // this is a chainId that never be used - it's negative, and it's dead beef
    // it's important, because these tests may pollute overridden environments
    // for other tests.
    const overriddenChainId = -0xdeadb33f;
    const overriddenVersion = '1.3.0';
    const overriddenEnvironment = {} as DeleGatorEnvironment;

    it('should override the environment for a given chainId and version', () => {
      overrideDeployedEnvironment(
        overriddenChainId,
        overriddenVersion,
        overriddenEnvironment,
      );

      const resolvedEnvironment = getDeleGatorEnvironment(
        overriddenChainId,
        overriddenVersion,
      );

      expect(resolvedEnvironment).equals(overriddenEnvironment);
    });

    it('should not override the environment for a different version', () => {
      overrideDeployedEnvironment(
        overriddenChainId,
        overriddenVersion,
        overriddenEnvironment,
      );
      const wrongVersion = '1.0.0';

      expect(() =>
        getDeleGatorEnvironment(overriddenChainId, wrongVersion),
      ).to.throw(
        `No contracts found for version ${wrongVersion} chain ${overriddenChainId}`,
      );
    });

    it('should not override the environment for a different chainId', () => {
      overrideDeployedEnvironment(
        overriddenChainId,
        overriddenVersion,
        overriddenEnvironment,
      );
      const wrongChainId = 0xdeadb33f;

      expect(() =>
        getDeleGatorEnvironment(wrongChainId, overriddenVersion),
      ).to.throw(
        `No contracts found for version ${overriddenVersion} chain ${wrongChainId}`,
      );
    });
  });
});
