import { beforeAll } from 'vitest';
import type { SmartAccountsEnvironment } from '@metamask/smart-accounts-kit';
import { overrideDeployedEnvironment } from '@metamask/smart-accounts-kit/utils';
import { chain } from './config';
import { readFile } from 'fs/promises';

// beforeAll runs within the context of the test runner, need to load the
// environment and set it up as the environment for the current chain.
beforeAll(async () => {
  const environment = await readFile('./.gator-env.json', 'utf-8');
  overrideDeployedEnvironment(
    chain.id,
    '1.3.0',
    JSON.parse(environment) as SmartAccountsEnvironment,
  );
});
