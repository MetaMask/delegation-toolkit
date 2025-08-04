export type Hex = `0x${string}`;

/**
 * A wallet is the signer for these permissions
 * `data` is not necessary for this signer type as the wallet is both the signer and grantor of these permissions
 */
export type WalletSigner = {
    type: "wallet";
    data: {};
};
  
/**
 * The types of keys that are supported for the following `key` and `keys` signer types.
 */
export type KeyType = "secp256r1" | "secp256k1" | "ed25519" | "schnorr";
  
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

/**
 * A base permission type that all permissions must extend.
 * `isAdjustmentAllowed` defines a boolean value that allows DApp to define whether the "permission" can be attenuated–adjusted to meet the user's terms.
 * @param type - is an enum defined by the ERCs
 * @param isAdjustmentAllowed - is a boolean that indicates whether the permission can be adjusted.
 * @param data - is a record of the data that is associated with the permission, and the structure is defined by the ERCs.
 */
export type Permission = {
    type: string; // enum defined by ERCs
    isAdjustmentAllowed: boolean; // whether the permission can be adjusted
    data: Record<string, any>; // specific to the type, structure defined by ERCs
};

/**
 * A base rule type that all rules must extend.
 * `isAdjustmentAllowed` defines a boolean value that allows DApp to define whether the "rule" can be attenuated–adjusted to meet the user's terms.
 * @param type - is an enum defined by the ERCs
 * @param isAdjustmentAllowed - is a boolean that indicates whether the rule can be adjusted.
 * @param data - is a record of the data that is associated with the rule, and the structure is defined by the ERCs.
 */
export type Rule = {
    type: string; // enum defined by ERCs
    isAdjustmentAllowed: boolean; // whether the rule can be adjusted
    data: Record<string, any>; // specific to the type, structure defined by ERCs
};

/**
 * Parameters for the `wallet_requestExecutionPermissions` JSON-RPC method.
 * @param chainId - chainId defines the chain with EIP-155 which applies to this permission request and all addresses can be found defined by other parameters.
 * @param address - address identifies the account being targetted for this permission request which is useful when a connection has been established and multiple accounts have been exposed. It is optional to let the user choose which account to grant permission for.
 * @param signer - signer is a field that identifies the key or account associated with the permission or alternatively the wallet will manage the session. See the "Signers" section for details.
 * @param permission - permission defines the allowed behavior the signer can do on behalf of the account. See the "Permission" section for details.
 * @param rules - rules defined the restrictions or conditions that a signer MUST abide by when using a permission to act on behalf of an account. See the "Rule" section for details.
 */
export type PermissionRequest = {
    chainId: Hex; // hex-encoding of uint256
    address?: Hex;
    signer: Signer;
    permission: Permission;
    rules?: Rule[];
}[];

/**
 * Response from the `wallet_requestExecutionPermissions` JSON-RPC method.
 * First note that the response contains all of the parameters of the original request and it is not guaranteed that the values received are equivalent to those requested.
 * @param context - is a catch-all to identify a permission for revoking permissions or submitting userOps, and can contain non-identifying data as well. It MAY be the `context` as defined in ERC-7679 and ERC-7710.
 * @param dependencyInfo - is an array of objects, each containing fields for `factory` and `factoryData` as defined in ERC-4337. Either both `factory` and `factoryData` must be specified in an entry, or neither. This array is used describe accounts that are not yet deployed but MUST be deployed in order for a permission to be successfully redeemed.
 * @param signerMeta - is dependent on the account type. If the signer type is `wallet` then it's not required. If the signer type is `key` or `keys` then `userOpBuilder` is required as defined in ERC-7679. If the signer type is `account` then `delegationManager` is required as defined in ERC-7710.
 */
export type PermissionResponse = PermissionRequest & {
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
 * @param permissionContext - the context identifier for the permission to be revoked
 */
export type RevokeExecutionPermissionRequestParams = {
    permissionContext: Hex;
};

/**
 * Response from the `wallet_revokeExecutionPermission` JSON-RPC method.
 * The wallet will respond with an empty response when successful.
 */
export type RevokeExecutionPermissionResponseResult = {};
