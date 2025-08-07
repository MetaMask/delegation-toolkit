import { createCaveatBuilder } from '../coreCaveatBuilder';
import type { CoreCaveatBuilder } from '../coreCaveatBuilder';
import type { NativeTokenPeriodTransferBuilderConfig } from '../nativeTokenPeriodTransferBuilder';
import type { DeleGatorEnvironment } from 'src/types';

export type NativeTokenPeriodicScopeConfig = {
  type: 'nativeToken-periodic';
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
  return createCaveatBuilder(environment)
    .addCaveat('exactCalldata', {
      calldata: '0x',
    })
    .addCaveat('nativeTokenPeriodTransfer', {
      periodAmount: config.periodAmount,
      periodDuration: config.periodDuration,
      startDate: config.startDate,
    });
}
