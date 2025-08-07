import type {
  Account,
  Address,
  Chain,
  Client,
  Hex as ViemHex,
  RpcSchema,
  Transport,
} from 'viem';
import { isHex, toHex } from 'viem';
import type {
  Hex,
  Signer as PermissionSigner,
  PermissionTypes,
  PermissionRequest as ExecutionPermissionRequest,
  PermissionResponse as ExecutionPermissionResponse,
  NativeTokenStreamPermission as PkgNativeTokenStreamPermission,
  NativeTokenPeriodicPermission as PkgNativeTokenPeriodicPermission,
  Erc20TokenStreamPermission as PkgErc20TokenStreamPermission,
  Erc20TokenPeriodicPermission as PkgErc20TokenPeriodicPermission,
} from '@metamask/permission-types';

// Developer-friendly helper types and inputs

type DeveloperHexish = Hex | bigint | number | string | null | undefined;

export type WalletSignerInput = { type: 'wallet'; data?: Record<string, never> };
export type KeySignerInput = {
  type: 'key';
  data: { type: 'secp256r1' | 'secp256k1' | 'ed25519' | 'schnorr'; publicKey: Hex | ViemHex };
};
export type KeysSignerInput = {
  type: 'keys';
  data: { keys: { type: 'secp256r1' | 'secp256k1' | 'ed25519' | 'schnorr'; publicKey: Hex | ViemHex }[] };
};
export type AccountSignerInput = { type: 'account'; data: { address: Address | Hex | ViemHex } };

export type SignerInput =
  | string
  | Address
  | WalletSignerInput
  | KeySignerInput
  | KeysSignerInput
  | AccountSignerInput;

export type NativeTokenStreamPermissionInput = {
  type: 'native-token-stream';
  isAdjustmentAllowed?: boolean;
  data: {
    initialAmount?: DeveloperHexish;
    maxAmount?: DeveloperHexish;
    amountPerSecond: DeveloperHexish;
    startTime?: number | string | null;
    justification?: string | null;
  };
};

export type NativeTokenPeriodicPermissionInput = {
  type: 'native-token-periodic';
  isAdjustmentAllowed?: boolean;
  data: {
    periodAmount: DeveloperHexish;
    periodDuration: number;
    startTime?: number | string | null;
    justification?: string | null;
  };
};

export type Erc20TokenStreamPermissionInput = {
  type: 'erc20-token-stream';
  isAdjustmentAllowed?: boolean;
  data: {
    tokenAddress: Address | Hex | ViemHex;
    initialAmount?: DeveloperHexish;
    maxAmount?: DeveloperHexish;
    amountPerSecond: DeveloperHexish;
    startTime?: number | string | null;
    justification?: string | null;
  };
};

export type Erc20TokenPeriodicPermissionInput = {
  type: 'erc20-token-periodic';
  isAdjustmentAllowed?: boolean;
  data: {
    tokenAddress: Address | Hex | ViemHex;
    periodAmount: DeveloperHexish;
    periodDuration: number;
    startTime?: number | string | null;
    justification?: string | null;
  };
};

export type PermissionInput =
  | NativeTokenStreamPermissionInput
  | NativeTokenPeriodicPermissionInput
  | Erc20TokenStreamPermissionInput
  | Erc20TokenPeriodicPermissionInput;

export type RequestExecutionPermissionParameters = Array<{
  chainId: number | Hex | ViemHex;
  address?: Address | Hex | ViemHex;
  signer: SignerInput;
  permission: PermissionInput;
  rules?: { type: string; isAdjustmentAllowed: boolean; data: Record<string, unknown> }[] | null;
}>;

export type RequestExecutionPermissionsReturnType = ExecutionPermissionResponse<
  PermissionSigner,
  PermissionTypes
>[];

// Snap RPC types

export type SnapAuthorizations = Record<
  string,
  { version: string; id: string; enabled: boolean; blocked: boolean }
>;

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

export type SnapClient = Client<
  Transport,
  Chain | undefined,
  Account | undefined,
  SnapRpcSchema
>;

const isSnapAuthorized = (
  authorizations: SnapAuthorizations,
  snapId: string,
) => {
  const authorization = authorizations[snapId];
  const isAuthorized =
    (authorization?.enabled && !authorization?.blocked) || false;

  return isAuthorized;
};

const reAuthorize = async (client: SnapClient, snapId: string) => {
  const newAuthorizations = await client.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: {} as Record<string, unknown>,
    },
  });

  return isSnapAuthorized(newAuthorizations, snapId);
};

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

export async function erc7715RequestExecutionPermissionsAction(
  client: SnapClient,
  parameters: RequestExecutionPermissionParameters,
  kernelSnapId = 'npm:@metamask/permissions-kernel-snap',
): Promise<RequestExecutionPermissionsReturnType> {
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
    throw new Error('Failed to request execution permissions');
  }

  return result as any as RequestExecutionPermissionsReturnType;
}

function formatPermissionsRequest(
  parameters: RequestExecutionPermissionParameters[number],
): ExecutionPermissionRequest<PermissionSigner, PermissionTypes> {
  const { rules } = parameters;

  const chainIdHex = toHexOrThrow(parameters.chainId, 'Invalid chainId');

  const addressHex = parameters.address
    ? (toHexOrThrow(parameters.address, 'Invalid address') as Hex)
    : undefined;

  const signer = formatSigner(parameters.signer);

  const permission = formatPermission(parameters.permission);

  const optionalFields = {
    ...(rules !== undefined ? { rules: rules ?? null } : {}),
    ...(addressHex ? { address: addressHex } : {}),
  } as Partial<ExecutionPermissionRequest<PermissionSigner, PermissionTypes>>;

  return {
    chainId: chainIdHex as Hex,
    signer,
    permission,
    ...optionalFields,
  } as ExecutionPermissionRequest<PermissionSigner, PermissionTypes>;
}

function formatSigner(signer: SignerInput): PermissionSigner {
  if (typeof signer === 'string') {
    const address = signer as Address | Hex | ViemHex;
    return { type: 'account', data: { address: toHexOrThrow(address) as Hex } };
  }

  if ('type' in signer && signer.type === 'account') {
    return {
      type: 'account',
      data: { address: toHexOrThrow(signer.data.address) as Hex },
    };
  }

  if ('type' in signer && signer.type === 'wallet') {
    return { type: 'wallet', data: {} };
  }

  if ('type' in signer && signer.type === 'key') {
    return {
      type: 'key',
      data: { type: signer.data.type, publicKey: toHexOrThrow(signer.data.publicKey) as Hex },
    };
  }

  if ('type' in signer && signer.type === 'keys') {
    return {
      type: 'keys',
      data: {
        keys: signer.data.keys.map((k) => ({
          type: k.type,
          publicKey: toHexOrThrow(k.publicKey) as Hex,
        })),
      },
    };
  }

  // Fallback: treat as account address
  return { type: 'account', data: { address: toHexOrThrow(signer as Address) as Hex } };
}

function assertIsDefined<TValue>(
  value: TValue | null | undefined,
  message?: string,
): asserts value is TValue {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Invalid parameters: value is required');
  }
}

function toHexOrThrow(
  value: DeveloperHexish,
  message?: string,
) {
  assertIsDefined(value, message);

  if (typeof value === 'string') {
    if (!isHex(value)) {
      // Treat as decimal string, coerce via Number -> toHex
      const decimal = Number(value);
      if (Number.isNaN(decimal)) {
        throw new Error('Invalid parameters: invalid hex value');
      }
      return toHex(decimal);
    }
    return value as Hex;
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return toHex(value as Parameters<typeof toHex>[0]);
  }

  return value as Hex; // should be null/undefined handled earlier
}

function toOptionalHex(value: DeveloperHexish): Hex | null | undefined {
  if (value === null || value === undefined) {
    return value as null | undefined;
  }
  return toHexOrThrow(value);
}

function toOptionalNumber(value: number | string | null | undefined): number | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'string') {
    if (isHex(value)) {
      return Number(BigInt(value));
    }
    const decimal = Number(value);
    if (Number.isNaN(decimal)) {
      throw new Error('Invalid parameters: invalid number value');
    }
    return decimal;
  }
  return value;
}

function formatPermission(permission: PermissionInput): PermissionTypes {
  switch (permission.type) {
    case 'native-token-stream':
      return formatNativeTokenStreamPermission(permission);
    case 'native-token-periodic':
      return formatNativeTokenPeriodicPermission(permission);
    case 'erc20-token-stream':
      return formatErc20TokenStreamPermission(permission);
    case 'erc20-token-periodic':
      return formatErc20TokenPeriodicPermission(permission);
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return permission as any as PermissionTypes;
  }
}

function withIsAdjustmentAllowed<T extends { isAdjustmentAllowed?: boolean }>(
  permission: T,
): { isAdjustmentAllowed: boolean } {
  return { isAdjustmentAllowed: permission.isAdjustmentAllowed ?? false };
}

function formatNativeTokenStreamPermission(
  permission: NativeTokenStreamPermissionInput,
): PkgNativeTokenStreamPermission {
  assertIsDefined(
    permission.data.amountPerSecond,
    'Invalid parameters: amountPerSecond is required',
  );

  return {
    type: 'native-token-stream',
    ...withIsAdjustmentAllowed(permission),
    data: {
      amountPerSecond: toHexOrThrow(permission.data.amountPerSecond) as Hex,
      initialAmount: toOptionalHex(permission.data.initialAmount) ?? undefined,
      maxAmount: toOptionalHex(permission.data.maxAmount) ?? undefined,
      startTime: toOptionalNumber(permission.data.startTime),
      justification: permission.data.justification ?? undefined,
    },
  } as PkgNativeTokenStreamPermission;
}

function formatNativeTokenPeriodicPermission(
  permission: NativeTokenPeriodicPermissionInput,
): PkgNativeTokenPeriodicPermission {
  assertIsDefined(
    permission.data.periodAmount,
    'Invalid parameters: periodAmount is required',
  );
  assertIsDefined(
    permission.data.periodDuration,
    'Invalid parameters: periodDuration is required',
  );

  return {
    type: 'native-token-periodic',
    ...withIsAdjustmentAllowed(permission),
    data: {
      periodAmount: toHexOrThrow(permission.data.periodAmount) as Hex,
      periodDuration: permission.data.periodDuration,
      startTime: toOptionalNumber(permission.data.startTime),
      justification: permission.data.justification ?? undefined,
    },
  } as PkgNativeTokenPeriodicPermission;
}

function formatErc20TokenStreamPermission(
  permission: Erc20TokenStreamPermissionInput,
): PkgErc20TokenStreamPermission {
  assertIsDefined(
    permission.data.amountPerSecond,
    'Invalid parameters: amountPerSecond is required',
  );

  return {
    type: 'erc20-token-stream',
    ...withIsAdjustmentAllowed(permission),
    data: {
      tokenAddress: toHexOrThrow(permission.data.tokenAddress) as Hex,
      amountPerSecond: toHexOrThrow(permission.data.amountPerSecond) as Hex,
      initialAmount: toOptionalHex(permission.data.initialAmount) ?? undefined,
      maxAmount: toOptionalHex(permission.data.maxAmount) ?? undefined,
      startTime: toOptionalNumber(permission.data.startTime),
      justification: permission.data.justification ?? undefined,
    },
  } as PkgErc20TokenStreamPermission;
}

function formatErc20TokenPeriodicPermission(
  permission: Erc20TokenPeriodicPermissionInput,
): PkgErc20TokenPeriodicPermission {
  assertIsDefined(
    permission.data.periodAmount,
    'Invalid parameters: periodAmount is required',
  );
  assertIsDefined(
    permission.data.periodDuration,
    'Invalid parameters: periodDuration is required',
  );

  return {
    type: 'erc20-token-periodic',
    ...withIsAdjustmentAllowed(permission),
    data: {
      tokenAddress: toHexOrThrow(permission.data.tokenAddress) as Hex,
      periodAmount: toHexOrThrow(permission.data.periodAmount) as Hex,
      periodDuration: permission.data.periodDuration,
      startTime: toOptionalNumber(permission.data.startTime),
      justification: permission.data.justification ?? undefined,
    },
  } as PkgErc20TokenPeriodicPermission;
}