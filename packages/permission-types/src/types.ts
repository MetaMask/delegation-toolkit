////////////////////////////////////////////////////
// General Types
////////////////////////////////////////////////////

/**
 * A hex-encoded string.
 */
export type Hex = `0x${string}`;
  
/**
 * The types of keys that are supported for the following `key` and `keys` signer types.
 */
export type KeyType = "secp256r1" | "secp256k1" | "ed25519" | "schnorr";

////////////////////////////////////////////////////
// Signer Types
////////////////////////////////////////////////////

/**
 * A wallet is the signer for these permissions
 * `data` is not necessary for this signer type as the wallet is both the signer and grantor of these permissions
 */
export type WalletSigner = {
    type: "wallet";
    data: {};
};
  
/**
 * A signer representing a single key.
 * "Key" types are explicitly secp256r1 (p256) or secp256k1, and the public keys are hex-encoded.
 */
export type KeySigner = {
    type: "key";
    data: {
        type: KeyType;
        publicKey: Hex;
    };
};

/**
 * A signer representing a multisig signer.
 * Each element of `publicKeys` are all explicitly the same `KeyType`, and the public keys are hex-encoded.
 */
export type MultiKeySigner = {
    type: "keys";
    data: {
        keys: {
            type: KeyType;
            publicKey: Hex;
        }[];
    };
};

/**
 * An account that can be granted with permissions as in ERC-7710.
 */
export type AccountSigner = {
    type: "account";
    data: {
        address: Hex;
    };
};

export type Signer = WalletSigner | KeySigner | MultiKeySigner | AccountSigner;

////////////////////////////////////////////////////
// Permission Types
////////////////////////////////////////////////////

/**
 * A base permission type that all permissions must extend.
 * `isAdjustmentAllowed` defines a boolean value that allows DApp to define whether the "permission" can be attenuated–adjusted to meet the user's terms.
 * @property type - is an enum defined by the ERCs
 * @property isAdjustmentAllowed - is a boolean that indicates whether the permission can be adjusted.
 * @property data - is a record of the data that is associated with the permission, and the structure is defined by the ERCs.
 */
export type BasePermission = {
    type: string;
    isAdjustmentAllowed: boolean;
    data: Record<string, any>;
};

/**
 * A base rule type that all rules must extend.
 * `isAdjustmentAllowed` defines a boolean value that allows DApp to define whether the "rule" can be attenuated–adjusted to meet the user's terms.
 * @property type - is an enum defined by the ERCs
 * @property isAdjustmentAllowed - is a boolean that indicates whether the rule can be adjusted.
 * @property data - is a record of the data that is associated with the rule, and the structure is defined by the ERCs.
 */
export type Rule = {
    type: string;
    isAdjustmentAllowed: boolean;
    data: Record<string, any>;
};

////////////////////////////////////////////////////
// MetaMask Permission Types
////////////////////////////////////////////////////

/**
 * Base data for all MetaMask permissions.
 * @property justification - is a human-readable explanation of why the permission is being requested.
 */
export type MetaMaskBasePermissionData = {
    justification?: string;
};

/**
 * A permission to stream native tokens.
 * @property data.initialAmount - is the initial amount of the native token to be streamed. Defaults to 0.
 * @property data.maxAmount - is the maximum amount of the native token to be streamed. Defaults to Max Uint256.
 * @property data.amountPerSecond - is the amount of the native token to be streamed per second.
 * @property data.startTime - is the start time of the stream. Defaults to current time.
 */
export type NativeTokenStreamPermission = BasePermission & {
    type: 'native-token-stream';
    data: MetaMaskBasePermissionData & {
      initialAmount?: Hex;
      maxAmount?: Hex;
      amountPerSecond: Hex;
      startTime?: number;
    };
};

/**
 * A permission to stream native tokens periodically.
 * @property data.periodAmount - is the amount of the native token to be streamed per period.
 * @property data.periodDuration - is the duration of the period in seconds.
 * @property data.startTime - is the start time of the stream. Defaults to current time.
 */
export type NativeTokenPeriodicPermission = BasePermission & {
    type: 'native-token-periodic';
    data: MetaMaskBasePermissionData & {
      periodAmount: Hex;
      periodDuration: number;
      startTime?: number;
    };
};

/**
 * A permission to stream ERC20 tokens.
 * @property data.initialAmount - is the initial amount of the ERC20 token to be streamed. Defaults to 0.
 * @property data.maxAmount - is the maximum amount of the ERC20 token to be streamed. Defaults to Max Uint256.
 * @property data.amountPerSecond - is the amount of the ERC20 token to be streamed per second.
 * @property data.startTime - is the start time of the stream. Defaults to current time.
 * @property data.tokenAddress - is the address of the ERC20 token to be streamed.
 */
export type Erc20TokenStreamPermission = BasePermission & {
    type: 'erc20-token-stream';
    data: MetaMaskBasePermissionData & {
      initialAmount?: Hex;
      maxAmount?: Hex;
      amountPerSecond: Hex;
      startTime?: number;
      tokenAddress: Hex;
    };
};
  
/**
 * A permission to stream ERC20 tokens periodically.
 * @property data.periodAmount - is the amount of the ERC20 token to be streamed per period.
 * @property data.periodDuration - is the duration of the period in seconds.
 * @property data.startTime - is the start time of the stream. Defaults to current time.
 * @property data.tokenAddress - is the address of the ERC20 token to be streamed per period.
 */
export type Erc20TokenPeriodicPermission = BasePermission & {
    type: 'erc20-token-periodic';
    data: MetaMaskBasePermissionData & {
      periodAmount: Hex;
      periodDuration: number;
      startTime?: number;
      tokenAddress: Hex;
    };
};

/**
 * A custom permission.
 * @property data - is a record of the data that is associated with the permission, and the structure is defined by the ERCs.
 */
// TODO: Consider openning up permission types with Custom / Unknown permissions in subseqential versions.
// export type CustomPermission = BasePermission & {
//     type: 'custom';
//     data: MetaMaskBasePermissionData & Record<string, unknown>;
// };

/**
 * Represents the type of the ERC-7715 permissions that can be granted.
 */
export type PermissionTypes =
    | NativeTokenStreamPermission
    | NativeTokenPeriodicPermission
    | Erc20TokenStreamPermission
    | Erc20TokenPeriodicPermission;

////////////////////////////////////////////////////
// Permission Requests
////////////////////////////////////////////////////

/**
 * Parameters for the `wallet_requestExecutionPermissions` JSON-RPC method.
 * @property chainId - chainId defines the chain with EIP-155 which applies to this permission request and all addresses can be found defined by other parameters.
 * @property address - address identifies the account being targetted for this permission request which is useful when a connection has been established and multiple accounts have been exposed. It is optional to let the user choose which account to grant permission for.
 * @property signer - signer is a field that identifies the key or account associated with the permission or alternatively the wallet will manage the session. See the "Signers" section for details.
 * @property permission - permission defines the allowed behavior the signer can do on behalf of the account. See the "Permission" section for details.
 * @property rules - rules defined the restrictions or conditions that a signer MUST abide by when using a permission to act on behalf of an account. See the "Rule" section for details.
 */
export type PermissionRequest<
    TSigner extends Signer,
    TPermission extends PermissionTypes
> = {
    chainId: Hex; // hex-encoding of uint256
    address?: Hex;
    signer: TSigner;
    permission: TPermission;
    rules?: Rule[];
};

/**
 * Response from the `wallet_requestExecutionPermissions` JSON-RPC method.
 * First note that the response contains all of the parameters of the original request and it is not guaranteed that the values received are equivalent to those requested.
 * @property context - is a catch-all to identify a permission for revoking permissions or submitting userOps, and can contain non-identifying data as well. It MAY be the `context` as defined in ERC-7679 and ERC-7710.
 * @property dependencyInfo - is an array of objects, each containing fields for `factory` and `factoryData` as defined in ERC-4337. Either both `factory` and `factoryData` must be specified in an entry, or neither. This array is used describe accounts that are not yet deployed but MUST be deployed in order for a permission to be successfully redeemed.
 * @property signerMeta - is dependent on the account type. If the signer type is `wallet` then it's not required. If the signer type is `key` or `keys` then `userOpBuilder` is required as defined in ERC-7679. If the signer type is `account` then `delegationManager` is required as defined in ERC-7710.
 */
export type PermissionResponse<
    TSigner extends Signer,
    TPermission extends PermissionTypes
> = PermissionRequest<TSigner, TPermission> & {
    context: Hex;
    dependencyInfo: {
        factory: Hex;
        factoryData: Hex;
    }[];
    signerMeta?: {
        // 7679 userOp building
        userOpBuilder?: Hex;
        // 7710 delegation
        delegationManager?: Hex;
    };
};

/**
 * Parameters for the `wallet_revokeExecutionPermission` JSON-RPC method.
 * @property permissionContext - the context identifier for the permission to be revoked
 */
export type RevokeExecutionPermissionRequestParams = {
    permissionContext: Hex;
};

/**
 * Response from the `wallet_revokeExecutionPermission` JSON-RPC method.
 * The wallet will respond with an empty response when successful.
 */
export type RevokeExecutionPermissionResponseResult = {};
