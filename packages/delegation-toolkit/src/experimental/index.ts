import type { Client, WalletClient } from 'viem';
import type { BundlerClient } from 'viem/account-abstraction';

import type {
  SendTransactionWithDelegationParameters,
  SendUserOperationWithDelegationParameters,
} from './erc7710RedeemDelegationAction';
import {
  sendTransactionWithDelegationAction,
  sendUserOperationWithDelegationAction,
} from './erc7710RedeemDelegationAction';
import { erc7715GrantPermissionsAction } from './erc7715GrantPermissionsAction';
import { ensureSnapsAuthorized } from './snapsAuthorization';
import type { SnapClient } from './snapsAuthorization';
import type { GrantPermissionsParameters } from './erc7715GrantPermissionsAction';

export {
  erc7715GrantPermissionsAction as grantPermissions,
  type GrantPermissionsParameters,
  type GrantPermissionsReturnType,
} from './erc7715GrantPermissionsAction';

export {
  DelegationStorageClient,
  type DelegationStoreFilter,
  type Environment,
  type DelegationStorageConfig,
} from './delegationStorage';

export const erc7715ProviderActions =
  (snapIds?: { kernelSnapId: string; providerSnapId: string }) =>
  (client: Client) => ({
    grantPermissions: async (parameters: GrantPermissionsParameters) => {
      if (!(await ensureSnapsAuthorized(client as SnapClient, snapIds))) {
        throw new Error('Snaps not authorized');
      }

      return erc7715GrantPermissionsAction(
        client as SnapClient,
        parameters,
        snapIds?.kernelSnapId,
      );
    },
  });

export const erc7710WalletActions = () => (client: WalletClient) => ({
  sendTransactionWithDelegation: async (
    args: SendTransactionWithDelegationParameters,
  ) => sendTransactionWithDelegationAction(client, args),
});

export const erc7710BundlerActions = () => (client: Client) => ({
  sendUserOperationWithDelegation: async (
    args: SendUserOperationWithDelegationParameters,
  ) => sendUserOperationWithDelegationAction(client as BundlerClient, args),
});
