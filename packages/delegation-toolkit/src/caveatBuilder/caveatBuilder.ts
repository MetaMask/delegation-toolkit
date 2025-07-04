import type { Caveat, DeleGatorEnvironment } from '../types';
import { createCaveatBuilderFromScope, type ScopeConfig } from './scope';

export type Caveats = CaveatBuilder | Caveat[];

type CaveatWithOptionalArgs = Omit<Caveat, 'args'> & {
  args?: Caveat['args'];
};

const INSECURE_UNRESTRICTED_DELEGATION_ERROR_MESSAGE =
  'No caveats found. If you definitely want to create an empty caveat collection, set `allowInsecureUnrestrictedDelegation` to `true`.';

/**
 * Resolves the array of Caveat from a Caveats argument.
 * @param config - The configuration for the caveat builder.
 * @param config.environment - The environment to be used for the caveat builder.
 * @param config.scope - The scope to be used for the caveat builder.
 * @param config.caveats - The caveats to be resolved, which can be either a CaveatBuilder or an array of Caveat.
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

  const additionalCaveats = Array.isArray(caveats) ? caveats : caveats.build();

  additionalCaveats.forEach((caveat) => scopeCaveatBuilder.addCaveat(caveat));

  return scopeCaveatBuilder.build();
};

type RemoveFirst<TypeArray extends any[]> = TypeArray extends [
  any,
  ...infer Rest,
]
  ? Rest
  : never;

type CaveatBuilderMap = {
  [key: string]: (
    environment: DeleGatorEnvironment,
    ...args: [...any]
  ) => Caveat;
};

export type CaveatBuilderConfig = {
  allowInsecureUnrestrictedDelegation?: boolean;
};

/**
 * A builder class for creating and managing caveats.
 * @template TCaveatBuilderMap - The type map of available caveat builder functions.
 */
export class CaveatBuilder<
  TCaveatBuilderMap extends CaveatBuilderMap = Record<string, never>,
> {
  #results: Caveat[] = [];

  #hasBeenBuilt = false;

  #environment: DeleGatorEnvironment;

  #config: CaveatBuilderConfig;

  #enforcerBuilders: TCaveatBuilderMap;

  constructor(
    environment: DeleGatorEnvironment,
    config: CaveatBuilderConfig = {},
    enforcerBuilders: TCaveatBuilderMap = {} as TCaveatBuilderMap,
    builtCaveats: Caveat[] = [],
  ) {
    this.#environment = environment;
    this.#config = config;
    this.#enforcerBuilders = enforcerBuilders;
    this.#results = builtCaveats;
  }

  /**
   * Extends the CaveatBuilder with a new enforcer function.
   * @template TEnforcerName - The name of the enforcer.
   * @template TFunction - The type of the enforcer function.
   * @param name - The name of the enforcer.
   * @param fn - The enforcer function.
   * @returns The extended CaveatBuilder instance.
   */
  extend<
    TEnforcerName extends string,
    TFunction extends (
      environment: DeleGatorEnvironment,
      ...args: [...any]
    ) => Caveat,
  >(
    name: TEnforcerName,
    fn: TFunction,
  ): CaveatBuilder<TCaveatBuilderMap & Record<TEnforcerName, TFunction>> {
    return new CaveatBuilder<
      TCaveatBuilderMap & Record<TEnforcerName, TFunction>
    >(
      this.#environment,
      this.#config,
      { ...this.#enforcerBuilders, [name]: fn },
      this.#results,
    );
  }

  /**
   * Adds a caveat directly using a Caveat object.
   * @param caveat - The caveat to add.
   * @returns The CaveatBuilder instance for chaining.
   */
  addCaveat(caveat: CaveatWithOptionalArgs): CaveatBuilder<TCaveatBuilderMap>;

  /**
   * Adds a caveat using a named enforcer function.
   * @param name - The name of the enforcer function to use.
   * @param args - The arguments to pass to the enforcer function.
   * @returns The CaveatBuilder instance for chaining.
   */
  addCaveat<TEnforcerName extends keyof TCaveatBuilderMap>(
    name: TEnforcerName,
    ...args: RemoveFirst<Parameters<TCaveatBuilderMap[TEnforcerName]>>
  ): CaveatBuilder<TCaveatBuilderMap>;

  addCaveat<TEnforcerName extends keyof TCaveatBuilderMap>(
    nameOrCaveat: TEnforcerName | CaveatWithOptionalArgs,
    ...args: typeof nameOrCaveat extends CaveatWithOptionalArgs
      ? []
      : RemoveFirst<Parameters<TCaveatBuilderMap[TEnforcerName]>>
  ): CaveatBuilder<TCaveatBuilderMap> {
    if (typeof nameOrCaveat === 'object') {
      const caveat = {
        args: '0x' as const,
        ...nameOrCaveat,
      };

      this.#results = [...this.#results, caveat];

      return this;
    }
    const name = nameOrCaveat;

    const func = this.#enforcerBuilders[name];
    if (typeof func === 'function') {
      const result = func(this.#environment, ...args);

      this.#results = [...this.#results, result];

      return this;
    }
    throw new Error(`Function "${String(name)}" does not exist.`);
  }

  /**
   * Returns the caveats that have been built using this CaveatBuilder.
   * @returns The array of built caveats.
   * @throws Error if the builder has already been built or if no caveats are found and empty caveats are not allowed.
   */
  build(): Caveat[] {
    if (this.#hasBeenBuilt) {
      throw new Error('This CaveatBuilder has already been built.');
    }

    if (
      this.#results.length === 0 &&
      !this.#config.allowInsecureUnrestrictedDelegation
    ) {
      throw new Error(INSECURE_UNRESTRICTED_DELEGATION_ERROR_MESSAGE);
    }

    this.#hasBeenBuilt = true;

    return this.#results;
  }
}
