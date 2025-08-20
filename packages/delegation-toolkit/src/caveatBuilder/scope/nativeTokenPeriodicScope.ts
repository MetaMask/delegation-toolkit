import type { DeleGatorEnvironment } from '../../types';
import type { AllowedCalldataBuilderConfig } from '../allowedCalldataBuilder';
import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { ExactCalldataBuilderConfig } from '../exactCalldataBuilder';
import type {
  nativeTokenPeriodTransfer,
  NativeTokenPeriodTransferBuilderConfig,
} from '../nativeTokenPeriodTransferBuilder';

export type NativeTokenPeriodicScopeConfig = {
  type: typeof nativeTokenPeriodTransfer;
  allowedCalldata?: AllowedCalldataBuilderConfig[];
  exactCalldata?: ExactCalldataBuilderConfig;
} & NativeTokenPeriodTransferBuilderConfig;

/**
 * Creates a caveat builder configured for native token periodic transfers with recurring limits.
 *
 * @param environment - The DeleGator environment.
 * @param config - Configuration object containing native token periodic transfer parameters.
 * @returns A configured caveat builder with native token period transfer and exact calldata caveats.
 * @throws Error if any of the native token periodic transfer parameters are invalid.
 * @throws Error if the environment is not properly configured.
 */
export function createNativeTokenPeriodicCaveatBuilder(
  environment: DeleGatorEnvironment,
  config: NativeTokenPeriodicScopeConfig,
): CoreCaveatBuilder {
  const {
    periodAmount,
    periodDuration,
    startDate,
    allowedCalldata,
    exactCalldata,
  } = config;

  const caveatBuilder = createCaveatBuilder(environment);

  // Add calldata restrictions
  if (allowedCalldata) {
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

  // Add native token period transfer restriction
  caveatBuilder.addCaveat('nativeTokenPeriodTransfer', {
    periodAmount,
    periodDuration,
    startDate,
  });

  return caveatBuilder;
}
