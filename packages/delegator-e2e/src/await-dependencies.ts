import {
  http as httpTransport,
  createClient,
  createWalletClient,
  http,
  createPublicClient,
} from 'viem';
import { nodeUrl, bundlerUrl, paymasterUrl, chain, deployPk } from './config';
import { privateKeyToAccount } from 'viem/accounts';
import { deployDeleGatorEnvironment } from '@metamask/delegation-toolkit/utils';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { writeFile } from 'fs/promises';

const POLL_INTERVAL_MS = 1000;

const waitFor = async (name: string, url: string) => {
  let isAvailable: boolean | undefined = undefined;

  console.log(`Waiting for ${name}, at ${url}`);
  const transport = httpTransport(url);

  const client = createClient({
    transport,
  });

  do {
    if (isAvailable !== undefined) {
      // Only add a delay if it's not the first time
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    await client
      .request({ method: 'web3_clientVersion' })
      .then(() => (isAvailable = true))
      .catch((e: any) => {
        isAvailable = (e as Error).name !== 'HttpRequestError';
      });
  } while (!isAvailable);

  console.log(`${name} is available`);
};

const deployEnvironment = async () => {
  const gatorEnvironment = await deployDeleGatorEnvironment(
    createWalletClient({
      account: privateKeyToAccount(deployPk),
      chain,
      transport: http(nodeUrl),
    }),
    createPublicClient({
      chain,
      transport: http(nodeUrl),
    }),
    chain,
    {
      EntryPoint: ENTRYPOINT_ADDRESS_V07,
    },
  );

  return gatorEnvironment;
};

(async () => {
  await waitFor('Blockchain node', nodeUrl);
  const waitingForDependencies = Promise.all([
    waitFor('Bundler', bundlerUrl),
    waitFor('Mock paymaster', paymasterUrl),
  ]);

  const environment = await deployEnvironment();
  await writeFile('./.gator-env.json', JSON.stringify(environment, null, 2));

  await waitingForDependencies;
})();
