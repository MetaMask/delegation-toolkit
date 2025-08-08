import type { Account, Chain, Client, RpcSchema, Transport } from 'viem';

/**
 * Represents the authorization status of installed MetaMask Snaps.
 *
 * @property {string} version - The version of the installed Snap.
 * @property {string} id - The unique identifier of the Snap.
 * @property {boolean} enabled - Whether the Snap is currently enabled.
 * @property {boolean} blocked - Whether the Snap is currently blocked.
 */
export type SnapAuthorizations = Record<
  string,
  { version: string; id: string; enabled: boolean; blocked: boolean }
>;

/**
 * RPC schema for MetaMask Snap-related methods.
 *
 * Extends the base RPC schema with methods specific to interacting with Snaps:
 * - `wallet_invokeSnap`: Invokes a method on a specific Snap.
 * - `wallet_getSnaps`: Retrieves all installed Snaps and their authorization status.
 * - `wallet_requestSnaps`: Requests permission to use specific Snaps.
 */
export type SnapRpcSchema = RpcSchema &
  [
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Method: 'wallet_invokeSnap';
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Params: {
        snapId: string;
        request: {
          method: string;
          params: unknown[];
        };
      };
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ReturnType: unknown;
    },
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Method: 'wallet_getSnaps';
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Params: Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ReturnType: SnapAuthorizations;
    },
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Method: 'wallet_requestSnaps';
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Params: Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ReturnType: SnapAuthorizations;
    },
  ];

/**
 * A Viem client extended with MetaMask Snap-specific RPC methods.
 *
 * This client type allows for interaction with MetaMask Snaps through
 * the standard Viem client interface, with added type safety for
 * Snap-specific methods.
 */
export type SnapClient = Client<
  Transport,
  Chain | undefined,
  Account | undefined,
  SnapRpcSchema
>;

/**
 * Checks if a specific snap is authorized, within the specified authorizations object..
 *
 * @param authorizations - The SnapAuthorizations object containing installed Snaps and their authorization status.
 * @param snapId - The ID of the snap to check.
 * @returns A boolean indicating whether the snap is authorized.
 */
const isSnapAuthorized = (
  authorizations: SnapAuthorizations,
  snapId: string,
) => {
  const authorization = authorizations[snapId];
  const isAuthorized =
    (authorization?.enabled && !authorization?.blocked) || false;

  return isAuthorized;
};

/**
 * Requests re-authorization of a specific snap.
 *
 * @param client - The SnapClient instance used to interact with MetaMask Snaps.
 * @param snapId - The ID of the snap to re-authorize.
 * @returns A promise that resolves to a boolean indicating whether the snap was re-authorized.
 */
const reAuthorize = async (client: SnapClient, snapId: string) => {
  const newAuthorizations = await client.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: {} as Record<string, unknown>,
    },
  });

  return isSnapAuthorized(newAuthorizations, snapId);
};

/**
 * Ensures that the required MetaMask Snaps for ERC-7715 permissions are authorized.
 *
 * @param client - The SnapClient instance used to interact with MetaMask Snaps.
 * @param snapIds - Optional object containing custom snap IDs to use.
 * @param snapIds.kernelSnapId - Custom ID for the permissions kernel snap (defaults to 'npm:@metamask/permissions-kernel-snap').
 * @param snapIds.providerSnapId - Custom ID for the permissions provider snap (defaults to 'npm:@metamask/gator-permissions-snap').
 * @returns A promise that resolves to a boolean indicating whether both snaps are authorized.
 * @description
 * This function attempts to authorize both the kernel and provider snaps required for ERC-7715 permissions.
 * It returns true only if both snaps are successfully authorized.
 */
export async function ensureSnapsAuthorized(
  client: SnapClient,
  snapIds?: { kernelSnapId: string; providerSnapId: string },
) {
  const kernelSnapId =
    snapIds?.kernelSnapId ?? 'npm:@metamask/permissions-kernel-snap';
  const providerSnapId =
    snapIds?.providerSnapId ?? 'npm:@metamask/gator-permissions-snap';

  const existingAuthorizations = await client.request({
    method: 'wallet_getSnaps',
    params: {} as Record<string, never>,
  });

  if (
    !isSnapAuthorized(existingAuthorizations, kernelSnapId) &&
    !(await reAuthorize(client, kernelSnapId))
  ) {
    return false;
  }

  if (
    !isSnapAuthorized(existingAuthorizations, providerSnapId) &&
    !(await reAuthorize(client, providerSnapId))
  ) {
    return false;
  }

  return true;
}
