import type { AllowedCalldataBuilderConfig } from './allowedCalldataBuilder';
import type { AllowedMethodsBuilderConfig } from './allowedMethodsBuilder';
import type { AllowedTargetsBuilderConfig } from './allowedTargetsBuilder';
import { createCaveatBuilder } from './coreCaveatBuilder';
import type { CoreCaveatBuilder } from './coreCaveatBuilder';
import type { ExactCalldataBuilderConfig } from './exactCalldataBuilder';
import type { UnitOfAuthorityBaseConfig } from './types';

export type FunctionCallUnitOfAuthorityConfig = UnitOfAuthorityBaseConfig &
  AllowedTargetsBuilderConfig &
  AllowedMethodsBuilderConfig & {
    allowedCalldata?: AllowedCalldataBuilderConfig[];
    exactCalldata?: ExactCalldataBuilderConfig;
  };

const isFunctionCallConfig = (
  config: FunctionCallUnitOfAuthorityConfig,
): config is FunctionCallUnitOfAuthorityConfig => {
  return 'targets' in config && 'selectors' in config;
};

/**
 * Creates a caveat builder configured for function call unit of authority.
 *
 * @param config - Configuration object containing allowed targets, methods, and optionally calldata.
 * @param config.environment - The DeleGator environment.
 * @returns A configured caveat builder with the specified caveats.
 * @throws Error if any of the required parameters are invalid.
 */
export function createFunctionCallCaveatBuilder(
  config: FunctionCallUnitOfAuthorityConfig,
): CoreCaveatBuilder {
  const { environment, targets, selectors, allowedCalldata, exactCalldata } =
    config;

  if (!isFunctionCallConfig(config)) {
    throw new Error('Invalid Function Call configuration');
  }

  const caveatBuilder = createCaveatBuilder(environment)
    .addCaveat('allowedTargets', { targets })
    .addCaveat('allowedMethods', { selectors });

  if (allowedCalldata) {
    allowedCalldata.forEach((calldataConfig) => {
      caveatBuilder.addCaveat('allowedCalldata', calldataConfig);
    });
  }
  if (exactCalldata) {
    caveatBuilder.addCaveat('exactCalldata', exactCalldata);
  }

  return caveatBuilder;
}
