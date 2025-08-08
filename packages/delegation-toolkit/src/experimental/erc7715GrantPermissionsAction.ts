import { isHex, toHex, type Address } from 'viem';
import type {
  AccountSigner,
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
    justification: string;
  };
};

export type SupportedPermissionParams =
  NativeTokenStreamPermissionParameter /* TODO: add other supported permission types here */;

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
  assertIsDefined(
    justification,
    'Invalid parameters: justification is required',
  );

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
  };

  return {
    type: 'native-token-stream',
    data: {
      amountPerSecond: toHexOrThrow(
        amountPerSecond,
        'Invalid parameters: amountPerSecond is required',
      ),
      justification,
      ...optionalFields,
    },
    isAdjustmentAllowed,
  };
}
