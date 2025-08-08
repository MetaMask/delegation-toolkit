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
import { erc7715RequestExecutionPermissionsAction } from './erc7715RequestExecutionPermissionsAction';
import type { RequestExecutionPermissionsParameters } from './erc7715RequestExecutionPermissionsAction';
import { ensureSnapsAuthorized } from './snapsAuthorization';
import type { SnapClient } from './snapsAuthorization';

export {
  erc7715RequestExecutionPermissionsAction as requestExecutionPermissions,
  type RequestExecutionPermissionsParameters,
  type RequestExecutionPermissionsReturnType,
} from './erc7715RequestExecutionPermissionsAction';

export {
  DelegationStorageClient,
  type DelegationStoreFilter,
  type Environment,
  type DelegationStorageConfig,
} from './delegationStorage';

export const erc7715ProviderActions =
  (snapIds?: { kernelSnapId: string; providerSnapId: string }) =>
  (client: Client) => ({
    requestExecutionPermissions: async (
      parameters: RequestExecutionPermissionsParameters,
    ) => {
      if (!(await ensureSnapsAuthorized(client as SnapClient, snapIds))) {
        throw new Error('Snaps not authorized');
      }

      return erc7715RequestExecutionPermissionsAction(
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
