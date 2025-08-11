import type { DeleGatorEnvironment } from '../../types';
import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type {
  nativeTokenStreaming,
  NativeTokenStreamingBuilderConfig,
} from '../nativeTokenStreamingBuilder';

export type NativeTokenStreamingScopeConfig = {
  type: typeof nativeTokenStreaming;
} & NativeTokenStreamingBuilderConfig;

/**
 * Creates a caveat builder configured for native token streaming with time-based limits.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing native token streaming parameters.
 * @returns A configured caveat builder with native token streaming and exact calldata caveats.
 * @throws Error if any of the native token streaming parameters are invalid.
 * @throws Error if the environment is not properly configured.
 */
export function createNativeTokenStreamingCaveatBuilder(
  environment: DeleGatorEnvironment,
  config: NativeTokenStreamingScopeConfig,
): CoreCaveatBuilder {
  return createCaveatBuilder(environment)
    .addCaveat('exactCalldata', {
      calldata: '0x',
    })
    .addCaveat('nativeTokenStreaming', {
      initialAmount: config.initialAmount,
      maxAmount: config.maxAmount,
      amountPerSecond: config.amountPerSecond,
      startTime: config.startTime,
    });
}
