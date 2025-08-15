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
import type { MetaMaskExtensionClient } from './snapsAuthorization';

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

type Erc7715ProviderConfig = {
  useWalletMethod: boolean;
  snapIds?: {
    kernelSnapId?: string;
    providerSnapId?: string;
  };
};

export const erc7715ProviderActions =
  (erc7715ProviderConfig: Erc7715ProviderConfig = { useWalletMethod: false }) =>
  (client: Client) => ({
    requestExecutionPermissions: async (
      parameters: RequestExecutionPermissionsParameters,
    ) => {
      const { useWalletMethod, snapIds } = erc7715ProviderConfig;

      let kernelSnapId: string | undefined;

      if (!useWalletMethod) {
        kernelSnapId =
          snapIds?.kernelSnapId ?? 'npm:@metamask/permissions-kernel-snap';

        const snapIdsToAuthorize = {
          kernelSnapId,
          providerSnapId:
            snapIds?.providerSnapId ?? 'npm:@metamask/gator-permissions-snap',
        };

        if (
          !(await ensureSnapsAuthorized(
            client as MetaMaskExtensionClient,
            snapIdsToAuthorize,
          ))
        ) {
          throw new Error('Snaps not authorized');
        }
      }

      return erc7715RequestExecutionPermissionsAction(
        client as MetaMaskExtensionClient,
        parameters,
        kernelSnapId,
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
