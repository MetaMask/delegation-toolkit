import type {
  Account,
  Address,
  Chain,
  Client,
  Transport,
  WalletClient,
} from 'viem';
import { BaseError } from 'viem';
import { parseAccount } from 'viem/accounts';

import {
  toDelegationStruct,
  SIGNABLE_DELEGATION_TYPED_DATA,
} from '../delegation';
import type { Delegation } from '../types';

export type SignDelegationParameters = {
  /** Account to sign with */
  account?: Account | Address;
  /** The delegation to sign */
  delegation: Omit<Delegation, 'signature'>;
  /** The address of the delegation manager contract */
  delegationManager: Address;
  /** The chain ID for the signature */
  chainId: number;
  /** The name of the contract */
  name?: string;
  /** The version of the contract */
  version?: string;
  /** Whether to allow insecure unrestricted delegation */
  allowInsecureUnrestrictedDelegation?: boolean;
};

export type SignDelegationReturnType = `0x${string}`;

/**
 * Signs a delegation using a wallet client.
 * @param client - The wallet client to use for signing.
 * @param parameters - The parameters for signing the delegation.
 * @returns The signature of the delegation.
 * @example
 * ```ts
 * const walletClient = createWalletClient({
 *   chain: mainnet,
 *   transport: http()
 * }).extend(signDelegationAction());
 *
 * const signature = await walletClient.signDelegation({
 *   delegation: {
 *     delegate: '0x...',
 *     delegator: '0x...',
 *     authority: '0x...',
 *     caveats: [],
 *     salt: '0x'
 *   },
 *   delegationManager: '0x...',
 *   chainId: 1
 * });
 * ```
 */
export async function signDelegation<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: Client<Transport, TChain, TAccount> & {
    signTypedData: WalletClient['signTypedData'];
  },
  parameters: SignDelegationParameters,
): Promise<SignDelegationReturnType> {
  const {
    account: accountParam = client.account,
    delegation,
    delegationManager,
    chainId,
    name = 'DelegationManager',
    version = '1',
    allowInsecureUnrestrictedDelegation = false,
  } = parameters;

  if (!accountParam) {
    throw new BaseError('Account not found. Please provide an account.');
  }

  const account = parseAccount(accountParam);

  const delegationStruct = toDelegationStruct({
    ...delegation,
    signature: '0x',
  });

  if (
    delegationStruct.caveats.length === 0 &&
    !allowInsecureUnrestrictedDelegation
  ) {
    throw new Error(
      'No caveats found. If you definitely want to sign a delegation without caveats, set `allowInsecureUnrestrictedDelegation` to `true`.',
    );
  }

  return client.signTypedData({
    account,
    domain: {
      chainId,
      name,
      version,
      verifyingContract: delegationManager,
    },
    types: SIGNABLE_DELEGATION_TYPED_DATA,
    primaryType: 'Delegation',
    message: delegationStruct,
  });
}

/**
 * Creates a sign delegation action that can be used to extend a wallet client.
 * @returns A function that can be used with wallet client extend method.
 * @example
 * ```ts
 * const walletClient = createWalletClient({
 *   chain: mainnet,
 *   transport: http()
 * }).extend(signDelegationAction());
 * ```
 */
export function signDelegationAction() {
  return <
    TChain extends Chain | undefined,
    TAccount extends Account | undefined,
  >(
    client: Client<Transport, TChain, TAccount> & {
      signTypedData: WalletClient['signTypedData'];
    },
  ) => ({
    signDelegation: async (
      parameters: Omit<SignDelegationParameters, 'chainId'> & {
        chainId?: number;
      },
    ) =>
      signDelegation(client, {
        chainId:
          parameters.chainId ??
          (() => {
            if (!client.chain?.id) {
              throw new BaseError(
                'Chain ID is required. Either provide it in parameters or configure the client with a chain.',
              );
            }
            return client.chain.id;
          })(),
        ...parameters,
      }),
  });
}
