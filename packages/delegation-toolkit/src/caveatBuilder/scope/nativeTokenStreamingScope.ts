import type { DeleGatorEnvironment } from '../../types';
import type { AllowedCalldataBuilderConfig } from '../allowedCalldataBuilder';
import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { ExactCalldataBuilderConfig } from '../exactCalldataBuilder';
import type {
  nativeTokenStreaming,
  NativeTokenStreamingBuilderConfig,
} from '../nativeTokenStreamingBuilder';

export type NativeTokenStreamingScopeConfig = {
  type: typeof nativeTokenStreaming;
  allowedCalldata?: AllowedCalldataBuilderConfig[];
  exactCalldata?: ExactCalldataBuilderConfig;
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
  const {
    initialAmount,
    maxAmount,
    amountPerSecond,
    startTime,
    allowedCalldata,
    exactCalldata,
  } = config;

  const caveatBuilder = createCaveatBuilder(environment);

  // Add calldata restrictions
  if (allowedCalldata && allowedCalldata.length > 0) {
    allowedCalldata.forEach((calldataConfig) => {
      caveatBuilder.addCaveat('allowedCalldata', calldataConfig);
    });
  } else if (exactCalldata) {
    caveatBuilder.addCaveat('exactCalldata', exactCalldata);
  } else {
    // Default behavior: only allow empty calldata
    caveatBuilder.addCaveat('exactCalldata', {
      calldata: '0x',
    });
  }

  // Add native token streaming restriction
  caveatBuilder.addCaveat('nativeTokenStreaming', {
    initialAmount,
    maxAmount,
    amountPerSecond,
    startTime,
  });

  return caveatBuilder;
}
