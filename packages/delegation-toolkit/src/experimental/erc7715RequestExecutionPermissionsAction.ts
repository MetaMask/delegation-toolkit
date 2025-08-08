import { isHex, toHex, type Address } from 'viem';
import type {
  AccountSigner,
  Erc20TokenPeriodicPermission,
  Erc20TokenStreamPermission,
  NativeTokenPeriodicPermission,
  NativeTokenStreamPermission,
  PermissionRequest,
  PermissionResponse,
  PermissionTypes,
  Rule,
} from '@metamask/permission-types';
import type { SnapClient } from './snapsAuthorization.js';

// todo: we will remove custom permissions, and just have a union of the supported permission types.
/**
 * Represents a custom permission with arbitrary data.
 */
export type BasePermissionParameter = {
  data: Record<string, unknown>;
  type: string;
  rules?: Record<string, unknown>;
  isRequired?: boolean;
};

/**
 * Represents a native token stream permission.
 * This allows for continuous token streaming with defined parameters.
 */
export type NativeTokenStreamPermissionParameter = BasePermissionParameter & {
  type: 'native-token-stream';
  expiry?: number;
  data: {
    amountPerSecond: bigint;
    initialAmount?: bigint;
    startTime?: number;
    maxAmount?: number;
    justification?: string;
  };
};

export type Erc20TokenStreamPermissionParameter = BasePermissionParameter & {
  type: 'erc20-token-stream';
  expiry?: number;
  data: {
    tokenAddress: Address;
    amountPerSecond: bigint;
    initialAmount?: bigint;
    startTime?: number;
    maxAmount?: number;
    justification?: string;
  };
};

export type NativeTokenPeriodicPermissionParameter = BasePermissionParameter & {
  type: 'native-token-periodic';
  expiry?: number;
  data: {
    periodAmount: bigint;
    periodDuration: number;
    startTime?: number;
    justification?: string;
  };
};

export type Erc20TokenPeriodicPermissionParameter = BasePermissionParameter & {
  type: 'erc20-token-periodic';
  expiry?: number;
  data: {
    tokenAddress: Address;
    periodAmount: bigint;
    periodDuration: number;
    startTime?: number;
    justification?: string;
  };
};

export type SupportedPermissionParams =
  | NativeTokenStreamPermissionParameter
  | Erc20TokenStreamPermissionParameter
  | NativeTokenPeriodicPermissionParameter
  | Erc20TokenPeriodicPermissionParameter;

export type SignerParam = Address | AccountSigner;

/**
 * Represents a single permission request.
 */
export type PermissionRequestParameter = {
  chainId: number;
  // The permission to grant to the user.
  permission: SupportedPermissionParams;
  // Whether the caller allows the permission to be adjusted.
  isAdjustmentAllowed: boolean;
  // Account to assign the permission to.
  signer: SignerParam;
  // address from which the permission should be granted.
  address?: Address;
  // Timestamp (in seconds) that specifies the time by which this permission MUST expire.
  expiry?: number;
};

/**
 * Parameters for the RequestExecutionPermissions action.
 *
 * @template Signer - The type of the signer, either an Address or Account.
 */
export type GrantPermissionsParameters = PermissionRequestParameter[];

/**
 * Return type for the grant permissions action.
 */
export type GrantPermissionsReturnType = PermissionResponse<
  AccountSigner,
  PermissionTypes
>[];

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
export async function erc7715RequestExecutionPermissionsAction(
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
          method: 'wallet_requestExecutionPermissions',
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
function formatPermissionsRequest(
  parameters: PermissionRequestParameter,
): PermissionRequest<AccountSigner, PermissionTypes> {
  const { chainId, address, expiry, isAdjustmentAllowed } = parameters;

  const permissionFormatter = getPermissionFormatter(
    parameters.permission.type,
  );

  const signerAddress =
    typeof parameters.signer === 'string'
      ? parameters.signer
      : parameters.signer.data.address;

  const isExpirySpecified = !!expiry;

  const rules: Rule[] = isExpirySpecified
    ? [
        {
          type: 'expiry',
          isAdjustmentAllowed,
          data: {
            expiry,
          },
        },
      ]
    : [];

  const optionalFields = {
    ...(address ? { address } : {}),
  };

  return {
    ...optionalFields,
    chainId: toHex(chainId),
    permission: permissionFormatter({
      permission: parameters.permission,
      isAdjustmentAllowed,
    }),
    signer: {
      // MetaMask 7715 implementation only supports AccountSigner
      type: 'account',
      data: {
        address: signerAddress,
      },
    },
    rules,
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

type PermissionFormatter = (params: {
  permission: BasePermissionParameter;
  isAdjustmentAllowed: boolean;
}) => PermissionTypes;

/**
 * Gets the appropriate formatter function for a specific permission type.
 *
 * @param permissionType - The type of permission to format.
 * @returns A formatter function for the specified permission type.
 */
function getPermissionFormatter(permissionType: string): PermissionFormatter {
  switch (permissionType) {
    case 'native-token-stream':
      return ({ permission, isAdjustmentAllowed }) =>
        formatNativeTokenStreamPermission({
          permission: permission as NativeTokenStreamPermissionParameter,
          isAdjustmentAllowed,
        });
    case 'erc20-token-stream':
      return ({ permission, isAdjustmentAllowed }) =>
        formatErc20TokenStreamPermission({
          permission: permission as Erc20TokenStreamPermissionParameter,
          isAdjustmentAllowed,
        });

    case 'native-token-periodic':
      return ({ permission, isAdjustmentAllowed }) =>
        formatNativeTokenPeriodicPermission({
          permission: permission as NativeTokenPeriodicPermissionParameter,
          isAdjustmentAllowed,
        });
    case 'erc20-token-periodic':
      return ({ permission, isAdjustmentAllowed }) =>
        formatErc20TokenPeriodicPermission({
          permission: permission as Erc20TokenPeriodicPermissionParameter,
          isAdjustmentAllowed,
        });
    default:
      throw new Error(`Unsupported permission type: ${permissionType}`);
  }
}

/**
 * Formats a native token stream permission for the wallet.
 *
 * @param permission - The native token stream permission to format.
 * @returns The formatted permission object.
 */
function formatNativeTokenStreamPermission({
  permission,
  isAdjustmentAllowed,
}: {
  permission: NativeTokenStreamPermissionParameter;
  isAdjustmentAllowed: boolean;
}): NativeTokenStreamPermission {
  const {
    data: {
      initialAmount,
      justification,
      maxAmount,
      startTime,
      amountPerSecond,
    },
  } = permission;

  const isInitialAmountSpecified =
    initialAmount !== undefined && initialAmount !== null;

  const isMaxAmountSpecified = maxAmount !== undefined && maxAmount !== null;

  const isStartTimeSpecified = startTime !== undefined && startTime !== null;

  const optionalFields = {
    ...(isInitialAmountSpecified && {
      initialAmount: toHexOrThrow(initialAmount),
    }),
    ...(isMaxAmountSpecified && {
      maxAmount: toHexOrThrow(maxAmount),
    }),
    ...(isStartTimeSpecified && {
      startTime: Number(startTime),
    }),
    ...(justification ? { justification } : {}),
  };

  return {
    type: 'native-token-stream',
    data: {
      amountPerSecond: toHexOrThrow(
        amountPerSecond,
        'Invalid parameters: amountPerSecond is required',
      ),
      ...optionalFields,
    },
    isAdjustmentAllowed,
  };
}

/**
 * Formats an ERC-20 token stream permission parameter into the required
 * Erc20TokenStreamPermission object, converting numeric values to hex strings
 * and including only specified optional fields.
 *
 * @param params - The parameters for formatting the ERC-20 token stream permission.
 * @param params.permission - The ERC-20 token stream permission parameter to format.
 * @param params.isAdjustmentAllowed - Whether adjustment of the stream is allowed.
 * @returns The formatted Erc20TokenStreamPermission object.
 */
function formatErc20TokenStreamPermission({
  permission,
  isAdjustmentAllowed,
}: {
  permission: Erc20TokenStreamPermissionParameter;
  isAdjustmentAllowed: boolean;
}): Erc20TokenStreamPermission {
  const {
    data: {
      tokenAddress,
      amountPerSecond,
      initialAmount,
      startTime,
      maxAmount,
      justification,
    },
  } = permission;

  const isInitialAmountSpecified =
    initialAmount !== undefined && initialAmount !== null;

  const isMaxAmountSpecified = maxAmount !== undefined && maxAmount !== null;

  const isStartTimeSpecified = startTime !== undefined && startTime !== null;

  const optionalFields = {
    ...(isInitialAmountSpecified && {
      initialAmount: toHexOrThrow(initialAmount),
    }),
    ...(isMaxAmountSpecified && {
      maxAmount: toHexOrThrow(maxAmount),
    }),
    ...(isStartTimeSpecified && {
      startTime: Number(startTime),
    }),
    ...(justification ? { justification } : {}),
  };

  return {
    type: 'erc20-token-stream',
    data: {
      tokenAddress: toHexOrThrow(tokenAddress),
      amountPerSecond: toHexOrThrow(amountPerSecond),
      ...optionalFields,
    },
    isAdjustmentAllowed,
  };
}

/**
 * Formats a native token periodic permission for submission to the wallet.
 *
 * @param params - The parameters for formatting the native token periodic permission.
 * @param params.permission - The native token periodic permission parameter to format.
 * @param params.isAdjustmentAllowed - Whether the permission is allowed to be adjusted.
 * @returns The formatted NativeTokenPeriodicPermission object.
 */
function formatNativeTokenPeriodicPermission({
  permission,
  isAdjustmentAllowed,
}: {
  permission: NativeTokenPeriodicPermissionParameter;
  isAdjustmentAllowed: boolean;
}): NativeTokenPeriodicPermission {
  const {
    data: { periodAmount, periodDuration, startTime, justification },
  } = permission;

  const isStartTimeSpecified = startTime !== undefined && startTime !== null;

  const optionalFields = {
    ...(isStartTimeSpecified && {
      startTime: Number(startTime),
    }),
    ...(justification ? { justification } : {}),
  };

  return {
    type: 'native-token-periodic',
    data: {
      periodAmount: toHexOrThrow(periodAmount),
      periodDuration: Number(periodDuration),
      ...optionalFields,
    },
    isAdjustmentAllowed,
  };
}

/**
 * Formats an ERC20 token periodic permission for submission to the wallet.
 *
 * @param params - The parameters for formatting the ERC20 token periodic permission.
 * @param params.permission - The ERC20 token periodic permission parameter to format.
 * @param params.isAdjustmentAllowed - Whether the permission is allowed to be adjusted.
 * @returns The formatted Erc20TokenPeriodicPermission object.
 */
function formatErc20TokenPeriodicPermission({
  permission,
  isAdjustmentAllowed,
}: {
  permission: Erc20TokenPeriodicPermissionParameter;
  isAdjustmentAllowed: boolean;
}): Erc20TokenPeriodicPermission {
  const {
    data: {
      tokenAddress,
      periodAmount,
      periodDuration,
      startTime,
      justification,
    },
  } = permission;

  const isStartTimeSpecified = startTime !== undefined && startTime !== null;

  const optionalFields = {
    ...(isStartTimeSpecified && {
      startTime: Number(startTime),
    }),
    ...(justification ? { justification } : {}),
  };

  return {
    type: 'erc20-token-periodic',
    data: {
      tokenAddress: toHexOrThrow(tokenAddress),
      periodAmount: toHexOrThrow(periodAmount),
      periodDuration: Number(periodDuration),
      ...optionalFields,
    },
    isAdjustmentAllowed,
  };
}
