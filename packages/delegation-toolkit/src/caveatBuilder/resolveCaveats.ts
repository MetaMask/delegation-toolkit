import { createCaveatBuilderFromScope, type ScopeConfig } from './scope';

import type { CoreCaveatConfiguration } from './coreCaveatBuilder';
import type { CaveatBuilder } from './caveatBuilder';
import { Caveat, DeleGatorEnvironment } from '../types';

export type Caveats = CaveatBuilder | (Caveat | CoreCaveatConfiguration)[];

/**
 * Resolves the array of Caveat from a Caveats argument.
 * @param config - The configuration for the caveat builder.
 * @param config.environment - The environment to be used for the caveat builder.
 * @param config.scope - The scope to be used for the caveat builder.
 * @param config.caveats - The caveats to be resolved, which can be either a CaveatBuilder or an array of Caveat or CaveatConfiguration.
 * @returns The resolved array of caveats.
 */
export const resolveCaveats = ({
  environment,
  scope,
  caveats,
}: {
  environment: DeleGatorEnvironment;
  scope: ScopeConfig;
  caveats: Caveats;
}) => {
  const scopeCaveatBuilder = createCaveatBuilderFromScope(environment, scope);

  if ('build' in caveats) {
    (caveats as CaveatBuilder).build().forEach((caveat) => {
      scopeCaveatBuilder.addCaveat(caveat);
    });
  } else if (Array.isArray(caveats)) {
    caveats.forEach((caveat) => {
      try {
        if ('type' in caveat) {
          const { type, ...config } = caveat as CoreCaveatConfiguration;
          scopeCaveatBuilder.addCaveat(type, config);
        } else {
          scopeCaveatBuilder.addCaveat(caveat as Caveat);
        }
      } catch (error) {
        throw new Error(`Invalid caveat: ${error}`);
      }
    });
  }

  return scopeCaveatBuilder.build();
};
