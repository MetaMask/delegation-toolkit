import type {
  Account,
  Address,
  Chain,
  Client,
  Hex,
  RpcSchema,
  Transport,
} from 'viem';
import { isHex, toHex } from 'viem';

/**
 * Represents a custom permission with arbitrary data.
 */
export type Permission = {
  data: Record<string, unknown>;
  type: string;
  rules?: Record<string, unknown>;
  isRequired?: boolean;
};

/**
 * Represents a native token stream permission.
 * This allows for continuous token streaming with defined parameters.
 */
export type NativeTokenStreamPermission = Permission & {
  type: 'native-token-stream';
  data: {
    initialAmount?: bigint;
    amountPerSecond: bigint;
    startTime?: number;
    maxAmount?: number;
    justification: string;
  };
};

export type SignerParam =
  | Address
  | { type: 'account'; data: { address: Address } }
  | { type: string; data: Record<string, unknown> };

/**
 * Parameters for a permission request.
 *
 * @template Signer - The type of the signer provided, either an Address or Account.
 */
export type PermissionRequest<Signer extends SignerParam> = {
  chainId: number;
  // address to which the permission request is targetting
  address?: Address;
  // Timestamp (in seconds) that specifies the time by which this permission MUST expire.
  expiry: number;
  // The permission to grant to the user.
  permission: Permission;
  // Account to assign the permission to.
  signer: Signer;
  // Whether the caller allows the permission to be adjusted.
  isAdjustmentAllowed?: boolean;
};

/**
 * Response from a permission request, including additional metadata.
 */
export type PermissionResponse = PermissionRequest<Address> & {
  // the PermissionsContext for the granted permission
  context: Hex;

  // ERC-4337 Factory and data to deploy smart contract account.
  accountMeta?: {
    factory: Hex;
    factoryData: Hex;
  }[];

  // This is actually _either_ a userOpBuilder or a delegationManager, but the typings
  // become complicated to consume if we encode it correctly.
  signerMeta?: {
    userOpBuilder?: Hex;
    delegationManager?: Hex;
  };
};

/**
 * Parameters for granting permissions.
 *
 * @template Signer - The type of the signer, either an Address or Account.
 */
export type GrantPermissionsParameters = PermissionRequest<SignerParam>[];

/**
 * Return type for the grant permissions action.
 */
export type GrantPermissionsReturnType = PermissionResponse[];
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

/**
 * Grants permissions according to EIP-7715 specification.
 *
 * @template Signer - The type of the signer, either an Address or Account.
 * @param client - The client to use for the request.
 * @param parameters - The permissions requests to grant.
 * @param kernelSnapId - The ID of the kernel snap to invoke, defaults to 'npm:@metamask/permissions-kernel-snap'.
 * @returns A promise that resolves to the permission responses.
 * @description
 * This function formats the permissions requests and invokes the wallet snap to grant permissions.
 * It will throw an error if the permissions could not be granted.
 */
export async function erc7715GrantPermissionsAction(
  client: SnapClient,
  parameters: GrantPermissionsParameters,
  kernelSnapId = 'npm:@metamask/permissions-kernel-snap',
): Promise<GrantPermissionsReturnType> {
  const formattedParameters = parameters.map(formatPermissionsRequest);

  const result = await client.request(
    {
      method: 'wallet_invokeSnap',
      params: {
        snapId: kernelSnapId,
        request: {
          method: 'wallet_grantPermissions',
          params: formattedParameters,
        },
      },
    },
    { retryCount: 0 },
  );

  if (result === null) {
    throw new Error('Failed to grant permissions');
  }

  return result as any as GrantPermissionsReturnType;
}

/**
 * Formats a permissions request for submission to the wallet.
 *
 * @param parameters - The permissions request to format.
 * @returns The formatted permissions request.
 * @internal
 */
function formatPermissionsRequest(parameters: PermissionRequest<SignerParam>) {
  const { chainId, address, expiry, isAdjustmentAllowed } = parameters;

  const permissionFormatter = getPermissionFormatter(
    parameters.permission.type,
  );

  const signerAddress =
    typeof parameters.signer === 'string'
      ? parameters.signer
      : parameters.signer.data.address;

  const isAdjustmentAllowedSpecified =
    isAdjustmentAllowed !== null && isAdjustmentAllowed !== undefined;

  const optionalFields = {
    ...(isAdjustmentAllowedSpecified ? { isAdjustmentAllowed } : {}),
    ...(address ? { address } : {}),
  };

  return {
    ...optionalFields,
    chainId: toHex(chainId),
    expiry,
    permission: permissionFormatter(parameters.permission),
    signer: {
      // only support account type for now
      type: 'account',
      data: {
        address: signerAddress,
      },
    },
  };
}

/**
 * Asserts that a value is defined (not null or undefined).
 *
 * @param value - The value to check.
 * @param message - Optional custom error message to throw if the value is not defined.
 * @throws {Error} If the value is null or undefined.
 */
function assertIsDefined<TValue>(
  value: TValue | null | undefined,
  message?: string,
): asserts value is TValue {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Invalid parameters: value is required');
  }
}

/**
 * Converts a value to a hex string or throws an error if the value is invalid.
 *
 * @param value - The value to convert to hex.
 * @param message - Optional custom error message.
 * @returns The value as a hex string.
 */
function toHexOrThrow(
  value: Parameters<typeof toHex>[0] | undefined,
  message?: string,
) {
  assertIsDefined(value, message);

  if (typeof value === 'string') {
    if (!isHex(value)) {
      throw new Error('Invalid parameters: invalid hex value');
    }
    return value;
  }

  return toHex(value);
}

/**
 * Gets the appropriate formatter function for a specific permission type.
 *
 * @param permissionType - The type of permission to format.
 * @returns A formatter function for the specified permission type.
 */
function getPermissionFormatter(
  permissionType: string,
): (permission: Permission) => Permission {
  switch (permissionType) {
    case 'native-token-stream':
      return (permission: Permission) =>
        formatNativeTokenStreamPermission(
          permission as NativeTokenStreamPermission,
        );
    default:
      return (permission: Permission) => ({ ...permission });
  }
}

/**
 * Formats a native token stream permission for the wallet.
 *
 * @param permission - The native token stream permission to format.
 * @returns The formatted permission object.
 */
function formatNativeTokenStreamPermission(
  permission: NativeTokenStreamPermission,
): Permission {
  assertIsDefined(
    permission.data.justification,
    'Invalid parameters: justification is required',
  );

  const isInitialAmountSpecified =
    permission.data.initialAmount !== undefined &&
    permission.data.initialAmount !== null;

  const isMaxAmountSpecified =
    permission.data.maxAmount !== undefined &&
    permission.data.maxAmount !== null;

  const isStartTimeSpecified =
    permission.data.startTime !== undefined &&
    permission.data.startTime !== null;

  const optionalFields = {
    ...(isInitialAmountSpecified && {
      initialAmount: toHexOrThrow(permission.data.initialAmount),
    }),
    ...(isMaxAmountSpecified && {
      maxAmount: toHexOrThrow(permission.data.maxAmount),
    }),
    ...(isStartTimeSpecified && {
      startTime: Number(permission.data.startTime),
    }),
  };

  return {
    ...permission,
    data: {
      amountPerSecond: toHexOrThrow(
        permission.data.amountPerSecond,
        'Invalid parameters: amountPerSecond is required',
      ),
      justification: permission.data.justification,
      ...optionalFields,
    },
  };
}
