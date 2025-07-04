export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "contract IDelegationManager"
      },
      {
        "name": "_entryPoint",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "DOMAIN_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "NAME",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PACKED_USER_OP_TYPEHASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addDeposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "addKey",
    "inputs": [
      {
        "name": "_keyId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_x",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_y",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "delegationManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDelegationManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "disableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "enableDelegation",
    "inputs": [
      {
        "name": "_delegation",
        "type": "tuple",
        "internalType": "struct Delegation",
        "components": [
          {
            "name": "delegate",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "delegator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "authority",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "caveats",
            "type": "tuple[]",
            "internalType": "struct Caveat[]",
            "components": [
              {
                "name": "enforcer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "terms",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "args",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "salt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "entryPoint",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IEntryPoint"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_execution",
        "type": "tuple",
        "internalType": "struct Execution",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "execute",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "executeFromExecutor",
    "inputs": [
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCalldata",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "returnData_",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getDeposit",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDomainHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getImplementation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInitializedVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKey",
    "inputs": [
      {
        "name": "_keyId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "x_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "y_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKeyIdHashes",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKeyIdHashesCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "_key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPackedUserOperationTypedDataHash",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_keyIds",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "_xValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_yValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isDelegationDisabled",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "_hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "magicValue_",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155BatchReceived",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC1155Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onERC721Received",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redeemDelegations",
    "inputs": [
      {
        "name": "_permissionContexts",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "_modes",
        "type": "bytes32[]",
        "internalType": "ModeCode[]"
      },
      {
        "name": "_executionCallDatas",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "reinitialize",
    "inputs": [
      {
        "name": "_version",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_keyIds",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "_xValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_yValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_deleteP256Keys",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeKey",
    "inputs": [
      {
        "name": "_keyId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "_interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "_newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateSigners",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_keyIds",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "_xValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "_yValues",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "_newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCallAndRetainStorage",
    "inputs": [
      {
        "name": "_newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "validateUserOp",
    "inputs": [
      {
        "name": "_userOp",
        "type": "tuple",
        "internalType": "struct PackedUserOperation",
        "components": [
          {
            "name": "sender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "nonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initCode",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "callData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "accountGasLimits",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "preVerificationGas",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "gasFees",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "paymasterAndData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_missingAccountFunds",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "validationData_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawDeposit",
    "inputs": [
      {
        "name": "_withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "_withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AddedP256Key",
    "inputs": [
      {
        "name": "keyIdHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "keyId",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "x",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "y",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ClearedStorage",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RemovedP256Key",
    "inputs": [
      {
        "name": "keyIdHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "x",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "y",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SentPrefund",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDelegationManager",
    "inputs": [
      {
        "name": "newDelegationManager",
        "type": "address",
        "indexed": true,
        "internalType": "contract IDelegationManager"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetEntryPoint",
    "inputs": [
      {
        "name": "entryPoint",
        "type": "address",
        "indexed": true,
        "internalType": "contract IEntryPoint"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CannotRemoveLastSigner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InputLengthsMismatch",
    "inputs": [
      {
        "name": "keyIdsLength",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "xValuesLength",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "yValuesLength",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidEmptyKey",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "KeyAlreadyExists",
    "inputs": [
      {
        "name": "keyIdHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "KeyDoesNotExist",
    "inputs": [
      {
        "name": "keyIdHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "KeyNotOnCurve",
    "inputs": [
      {
        "name": "x",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "y",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "NotDelegationManager",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPoint",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotEntryPointOrSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SignersCannotBeEmpty",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "UUPSUnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedCallType",
    "inputs": [
      {
        "name": "callType",
        "type": "bytes1",
        "internalType": "CallType"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnsupportedExecType",
    "inputs": [
      {
        "name": "execType",
        "type": "bytes1",
        "internalType": "ExecType"
      }
    ]
  }
] as const;


export const bytecode = "0x6101c0604052306080523480156200001657600080fd5b506040516200556538038062005565833981016040819052620000399162000319565b81816040518060400160405280600f81526020016e243cb13934b22232b632a3b0ba37b960891b815250604051806040016040528060018152602001603160f81b815250818162000095600083620001ca60201b90919060201c565b61014052620000a6816001620001ca565b61016052815160208084019190912061010052815190820120610120524660c052620001366101005161012051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60a05250503060e0526200014962000203565b6001600160a01b038085166101808190529084166101a0526040517fb2e8eb88b584ae71ef4e854c10847f4d39bd93e52599f147bfb4dcc8de52014d90600090a26040516001600160a01b038416907fee8699dc0e27105da2653bdba54be0edcaadc3e33890a3ad705517ffe9bf0a9990600090a250505050505062000541565b6000602083511015620001ea57620001e283620002b7565b9050620001fd565b81620001f78482620003ff565b5060ff90505b92915050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff1615620002545760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b0390811614620002b45780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b600080829050601f81511115620002ee578260405163305a27a960e01b8152600401620002e59190620004cb565b60405180910390fd5b8051620002fb826200051c565b179392505050565b6001600160a01b0381168114620002b457600080fd5b600080604083850312156200032d57600080fd5b82516200033a8162000303565b60208401519092506200034d8162000303565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200038357607f821691505b602082108103620003a457634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620003fa576000816000526020600020601f850160051c81016020861015620003d55750805b601f850160051c820191505b81811015620003f657828155600101620003e1565b5050505b505050565b81516001600160401b038111156200041b576200041b62000358565b62000433816200042c84546200036e565b84620003aa565b602080601f8311600181146200046b5760008415620004525750858301515b600019600386901b1c1916600185901b178555620003f6565b600085815260208120601f198616915b828110156200049c578886015182559484019460019091019084016200047b565b5085821015620004bb5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60006020808352835180602085015260005b81811015620004fb57858101830151858201604001528201620004dd565b506000604082860101526040601f19601f8301168501019250505092915050565b80516020808301519190811015620003a45760001960209190910360031b1b16919050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a051614eeb6200067a6000396000818161068c0152818161091e015281816109cb01528181610abe01528181610b3c01528181610ca001528181610d5501528181610de001528181610e5001528181610f3c01528181610ff701528181611069015281816112c301528181611342015281816113ab015281816114a60152818161156501528181611a1b01528181611d0e01528181611d7c0152612d4e0152600081816107ff01528181610b9f01528181610c2201528181610d030152818161140e01526117ac0152600061275a0152600061272d01526000611f3e01526000611f1601526000611e7101526000611e9b01526000611ec5015260008181612190015281816121b901526126100152614eeb6000f3fe6080604052600436106102765760003560e01c80638da5cb5b1161014f578063c8561e73116100c1578063e9ae5c531161007a578063e9ae5c53146107da578063ea4d3c9b146107ed578063ed8101b514610821578063f23a6e6114610841578063f2fde38b14610861578063ffa1ad741461088157600080fd5b8063c8561e7314610710578063cef6d20914610730578063d087d28814610750578063d37aec9214610765578063d5d33b551461079a578063d691c964146107ba57600080fd5b8063acb8cc4911610113578063acb8cc491461061c578063ad3cb1cc14610649578063b0d691fe1461067a578063b3c65015146106ae578063bc197c81146106db578063c399ec88146106fb57600080fd5b80638da5cb5b1461054d5780638ebf95331461058c578063a24c8f32146105ac578063a3f4df7e146105bf578063aaf10f421461060757600080fd5b8063445140b8116101e85780635c1c6dcd116101ac5780635c1c6dcd146104a8578063715018a6146104bb57806378a68ecf146104d05780637f07bfdc146104f057806383ebb7711461051057806384b0196e1461052557600080fd5b8063445140b81461043857806349934047146104585780634a58db19146104785780634f1ef2861461048057806352d1902d1461049357600080fd5b806319822f7c1161023a57806319822f7c146103605780631c03010a146103805780632b3afd99146103a25780632ffeaad6146103d65780633e1b0812146103f85780633ed010151461041857600080fd5b806301ffc9a71461028257806306394d67146102b7578063074feff3146102e5578063150b7a02146103075780631626ba7e1461034057600080fd5b3661027d57005b600080fd5b34801561028e57600080fd5b506102a261029d366004613d03565b6108b2565b60405190151581526020015b60405180910390f35b3480156102c357600080fd5b506102d76102d2366004613d46565b6108de565b6040519081526020016102ae565b3480156102f157600080fd5b50610305610300366004613ded565b610913565b005b34801561031357600080fd5b50610327610322366004613f5c565b610984565b6040516001600160e01b031990911681526020016102ae565b34801561034c57600080fd5b5061032761035b366004614008565b61099f565b34801561036c57600080fd5b506102d761037b366004614053565b6109be565b34801561038c57600080fd5b50600080516020614e36833981519152546102d7565b3480156103ae57600080fd5b506102d77fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc1881565b3480156103e257600080fd5b506103eb610a2e565b6040516102ae91906140a0565b34801561040457600080fd5b506102d76104133660046140d8565b610a97565b34801561042457600080fd5b50610305610433366004614101565b610b31565b34801561044457600080fd5b506102a261045336600461413b565b610c09565b34801561046457600080fd5b50610305610473366004614101565b610c95565b610305610d38565b61030561048e366004614154565b610da2565b34801561049f57600080fd5b506102d7610db8565b6103056104b63660046141a3565b610dd5565b3480156104c757600080fd5b50610305610e45565b3480156104dc57600080fd5b506103056104eb3660046141f6565b610ea8565b3480156104fc57600080fd5b5061030561050b3660046142c8565b610fec565b34801561051c57600080fd5b506102d76110c9565b34801561053157600080fd5b5061053a6110d8565b6040516102ae9796959493929190614344565b34801561055957600080fd5b50600080516020614e16833981519152546001600160a01b03165b6040516001600160a01b0390911681526020016102ae565b34801561059857600080fd5b506103056105a7366004613ded565b61111e565b6103056105ba366004614154565b610daa565b3480156105cb57600080fd5b506105fa6040518060400160405280600f81526020016e243cb13934b22232b632a3b0ba37b960891b81525081565b6040516102ae91906143dd565b34801561061357600080fd5b5061057461123a565b34801561062857600080fd5b506105fa604051806040016040528060018152602001603160f81b81525081565b34801561065557600080fd5b506105fa604051806040016040528060058152602001640352e302e360dc1b81525081565b34801561068657600080fd5b506105747f000000000000000000000000000000000000000000000000000000000000000081565b3480156106ba57600080fd5b506106c361125b565b6040516001600160401b0390911681526020016102ae565b3480156106e757600080fd5b506103276106f636600461446f565b61128e565b34801561070757600080fd5b506102d76112ab565b34801561071c57600080fd5b5061030561072b36600461451c565b611337565b34801561073c57600080fd5b5061030561074b36600461456c565b6113a0565b34801561075c57600080fd5b506102d7611487565b34801561077157600080fd5b50610785610780366004614605565b6114dd565b604080519283526020830191909152016102ae565b3480156107a657600080fd5b506103056107b5366004614605565b61155a565b6107cd6107c8366004614008565b61179f565b6040516102ae9190614646565b6103056107e8366004614008565b611a10565b3480156107f957600080fd5b506105747f000000000000000000000000000000000000000000000000000000000000000081565b34801561082d57600080fd5b506102d761083c366004613d46565b611c13565b34801561084d57600080fd5b5061032761085c3660046146aa565b611d55565b34801561086d57600080fd5b5061030561087c366004614712565b611d71565b34801561088d57600080fd5b506105fa604051806040016040528060058152602001640312e332e360dc1b81525081565b60006108bd82611dd4565b806108d857506001600160e01b031982166307f5828d60e41b145b92915050565b60006108d86108eb611e64565b6108f484611c13565b60405161190160f01b8152600281019290925260228201526042902090565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061094c5750333014155b1561096a57604051630796d94560e01b815260040160405180910390fd5b61097b878787878787876001611f8f565b50505050505050565b600061098e612185565b50630a85bd0160e11b949350505050565b60006109a9612185565b6109b484848461222a565b90505b9392505050565b6000336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610a0957604051636b31ba1560e11b815260040160405180910390fd5b610a11612185565b610a2384610a1e866108de565b61244e565b90506109b782612496565b60606000600080516020614e1683398151915260028101805460408051602080840282018101909252828152939450830182828015610a8c57602002820191906000526020600020905b815481526020019060010190808311610a78575b505050505091505090565b604051631aab3f0d60e11b81523060048201526001600160c01b03821660248201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a90604401602060405180830381865afa158015610b0d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108d8919061472f565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610b6a5750333014155b15610b8857604051630796d94560e01b815260040160405180910390fd5b604051633ed0101560e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690633ed0101590610bd4908490600401614877565b600060405180830381600087803b158015610bee57600080fd5b505af1158015610c02573d6000803e3d6000fd5b5050505050565b6040516316a0682960e11b8152600481018290526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632d40d05290602401602060405180830381865afa158015610c71573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108d89190614953565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610cce5750333014155b15610cec57604051630796d94560e01b815260040160405180910390fd5b604051634993404760e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690634993404790610bd4908490600401614877565b610d40612185565b60405163b760faf960e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063b760faf99034906024016000604051808303818588803b158015610bee57600080fd5b610daa61252d565b610db482826125ea565b5050565b6000610dc2612605565b50600080516020614e5683398151915290565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610e1e57604051636b31ba1560e11b815260040160405180910390fd5b610db4610e2e6020830183614712565b6020830135610e406040850185614970565b61264e565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610e7e5750333014155b15610e9c57604051630796d94560e01b815260040160405180910390fd5b610ea66000612684565b565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805460ff8b81169291600160401b90041680610ef2575080546001600160401b03808416911610155b15610f105760405163f92ee8a960e01b815260040160405180910390fd5b805468ffffffffffffffffff19166001600160401b03831617600160401b178155336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610f6a5750333014155b15610f8857604051630796d94560e01b815260040160405180910390fd5b610f988a8a8a8a8a8a8a8a611f8f565b805460ff60401b191681556040516001600160401b03831681527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15050505050505050505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906110255750333014155b1561104357604051630796d94560e01b815260040160405180910390fd5b60405163040b850f60e31b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063205c287890604401600060405180830381600087803b1580156110ad57600080fd5b505af11580156110c1573d6000803e3d6000fd5b505050505050565b60006110d3611e64565b905090565b6000606080600080600060606110ec612726565b6110f4612753565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff1615906001600160401b03166000811580156111635750825b90506000826001600160401b0316600114801561117f5750303b155b90508115801561118d575080155b156111ab5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156111d557845460ff60401b1916600160401b1785555b6111e68c8c8c8c8c8c8c6000611f8f565b831561122c57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050505050565b60006110d3600080516020614e56833981519152546001600160a01b031690565b60006110d37ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00546001600160401b031690565b6000611298612185565b5063bc197c8160e01b5b95945050505050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a08231906024015b602060405180830381865afa158015611313573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110d3919061472f565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906113705750333014155b1561138e57604051630796d94560e01b815260040160405180910390fd5b61139a84848484612780565b50505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906113d95750333014155b156113f757604051630796d94560e01b815260040160405180910390fd5b60405163cef6d20960e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cef6d2099061144d90899089908990899089908990600401614a17565b600060405180830381600087803b15801561146757600080fd5b505af115801561147b573d6000803e3d6000fd5b50505050505050505050565b604051631aab3f0d60e11b8152306004820152600060248201819052907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a906044016112f6565b60008080600080516020614e1683398151915290506000816001016000878760405160200161150d929190614a80565b60408051601f198184030181529181528151602092830120835282820193909352908201600020825180840190935280548084526001909101549290910182905297909650945050505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906115935750333014155b156115b157604051630796d94560e01b815260040160405180910390fd5b604051600080516020614e16833981519152906000906115d79085908590602001614a80565b60408051601f198184030181528282528051602091820120600081815260018088018452908490208585019094528354808652930154918401829052935081158015611621575080155b1561164757604051631a36430d60e31b8152600481018590526024015b60405180910390fd5b6002850154600181148015611664575085546001600160a01b0316155b156116825760405163c4c8547360e01b815260040160405180910390fd5b60005b611690600183614aa6565b81101561171557858760020182815481106116ad576116ad614ab9565b90600052602060002001540361170d57600287016116cc600184614aa6565b815481106116dc576116dc614ab9565b90600052602060002001548760020182815481106116fc576116fc614ab9565b600091825260209091200155611715565b600101611685565b508560020180548061172957611729614acf565b60008281526020808220830160001990810183905590920190925586825260018881018252604080842084815590910192909255815185815290810184905286917facf0e8088062f44f734bbcb5223794fd8bb6f6db1c199cb6a72df119d002a71b910160405180910390a25050505050505050565b6060336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146117ea57604051630692ce8160e21b815260040160405180910390fd5b83600881901b6117fe82600160f81b6128fd565b1561187f57366000611810878761290f565b90925090506118208360006128fd565b156118365761182f82826129a8565b9450611878565b61184483600160f81b6128fd565b156118535761182f8282612a69565b6040516308c3ee0360e11b81526001600160f81b03198416600482015260240161163e565b5050611a07565b61188a8260006128fd565b156119e25760008036600061189f8989612b96565b6040805160018082528183019092529498509296509094509250816020015b60608152602001906001900390816118be57905050965060006118e186826128fd565b15611915576118f28585858561264e565b8860008151811061190557611905614ab9565b60200260200101819052506119d8565b61192386600160f81b6128fd565b156119b35761193485858585612be7565b8960008151811061194757611947614ab9565b60209081029190910101529050806119ae577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb760008960008151811061198f5761198f614ab9565b60200260200101516040516119a5929190614ae5565b60405180910390a15b6119d8565b6040516308c3ee0360e11b81526001600160f81b03198716600482015260240161163e565b5050505050611a07565b604051632e5bf3f960e21b81526001600160f81b03198316600482015260240161163e565b50509392505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611a5957604051636b31ba1560e11b815260040160405180910390fd5b82600881901b611a6d82600160f81b6128fd565b15611ac857366000611a7f868661290f565b9092509050611a8f8360006128fd565b15611aa457611a9e82826129a8565b50611ac1565b611ab283600160f81b6128fd565b1561185357611a9e8282612a69565b5050610c02565b611ad38260006128fd565b156119e257600080366000611ae88888612b96565b9350935093509350611afe85600060f81b6128fd565b15611b1557611b0f8484848461264e565b50611c0a565b611b2385600160f81b6128fd565b15611be557604080516001808252818301909252600091816020015b6060815260200190600190039081611b3f5790505090506000611b6486868686612be7565b83600081518110611b7757611b77614ab9565b6020908102919091010152905080611bde577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb7600083600081518110611bbf57611bbf614ab9565b6020026020010151604051611bd5929190614ae5565b60405180910390a15b5050611c0a565b6040516308c3ee0360e11b81526001600160f81b03198616600482015260240161163e565b50505050610c02565b60007fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18611c436020840184614712565b6020840135611c556040860186614970565b604051611c63929190614a80565b604051908190039020611c796060870187614970565b604051611c87929190614a80565b604051908190039020608087013560a088013560c0890135611cac60e08b018b614970565b604051611cba929190614a80565b60408051918290038220602083019a909a526001600160a01b03988916908201526060810196909652608086019490945260a085019290925260c084015260e08301526101008201526101208101929092527f00000000000000000000000000000000000000000000000000000000000000001661014082015261016001604051602081830303815290604052805190602001209050919050565b6000611d5f612185565b5063f23a6e6160e01b95945050505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590611daa5750333014155b15611dc857604051630796d94560e01b815260040160405180910390fd5b611dd181612684565b50565b6000611dde612185565b6001600160e01b031982166335a4725960e21b1480611e0d57506001600160e01b03198216630a85bd0160e11b145b80611e2857506001600160e01b03198216630271189760e51b145b80611e4357506001600160e01b031982166301ffc9a760e01b145b806108d8575050630b135d3f60e11b6001600160e01b03198216145b919050565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015611ebd57507f000000000000000000000000000000000000000000000000000000000000000046145b15611ee757507f000000000000000000000000000000000000000000000000000000000000000090565b6110d3604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b856001600160a01b038916158015611fa5575080155b8015611fae5750815b15611fcc576040516312da594d60e11b815260040160405180910390fd5b8085141580611fdb5750808314155b1561200a5760405163a297991b60e01b815260048101829052602481018690526044810184905260640161163e565b81156120ff57600080516020614e3683398151915254600080516020614e168339815191529080156120fc5760005b818110156120ed57600083600201828154811061205857612058614ab9565b6000918252602080832090910154808352600180880180845260408086208151808301835281548152938101805485880190815286895293909652869055949093558051925193519194509284927facf0e8088062f44f734bbcb5223794fd8bb6f6db1c199cb6a72df119d002a71b926120db9290918252602082015260400190565b60405180910390a25050600101612039565b506120fc600283016000613cd1565b50505b60005b818110156121705761216889898381811061211f5761211f614ab9565b90506020028101906121319190614970565b89898581811061214357612143614ab9565b9050602002013588888681811061215c5761215c614ab9565b90506020020135612780565b600101612102565b5061217a89612684565b505050505050505050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148061220c57507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316612200600080516020614e56833981519152546001600160a01b031690565b6001600160a01b031614155b15610ea65760405163703e46dd60e11b815260040160405180910390fd5b60008160418190036122c757600080516020614e16833981519152546001600160a01b03166001600160a01b03166122988686868080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612c1892505050565b6001600160a01b0316036122b65750630b135d3f60e11b90506109b7565b506001600160e01b031990506109b7565b60608110156122e157506001600160e01b031990506109b7565b600080516020614e1683398151915260006122ff6020828789614afe565b61230891614b28565b60008181526001808501602090815260409283902083518085019094528054808552920154908301529192509015801561234457506020810151155b1561235e57506001600160e01b031993506109b792505050565b8360601480156123b257506123b28888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050855160208701519092509050612c42565b156123cb5750630b135d3f60e11b93506109b792505050565b8360601415801561242057506124208888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050855160208701519092509050612ce0565b156124395750630b135d3f60e11b93506109b792505050565b506001600160e01b031993506109b792505050565b60008061246883612463610100870187614970565b61222a565b90506374eca2c160e11b6001600160e01b031982160161248c5760009150506108d8565b5060019392505050565b8015611dd157604051600090339060001990849084818181858888f193505050503d80600081146124e3576040519150601f19603f3d011682016040523d82523d6000602084013e6124e8565b606091505b505060408051848152821515602082015291925033917fa427c7d47f24d01b170779a7600b1d4c0d7cdbabaa0f19c4f0e6182053ffc931910160405180910390a25050565b600080516020614e3683398151915254600080516020614e168339815191529060005b818110156125a05782600101600084600201838154811061257357612573614ab9565b60009182526020808320909101548352820192909252604001812081815560019081019190915501612550565b506125af600283016000613cd1565b81546001600160a01b03191682556040517feb09d532980c3cc73dcad99b80e264204a667a54cbb7b63ec8d68dcb1c7096be90600090a15050565b6125f2612185565b6125fb82612d43565b610db48282612d9a565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610ea65760405163703e46dd60e11b815260040160405180910390fd5b60405181838237600038838387895af161266b573d6000823e3d81fd5b3d8152602081013d6000823e3d01604052949350505050565b600080516020614e3683398151915254600080516020614e16833981519152901580156126b857506001600160a01b038216155b156126d65760405163c4c8547360e01b815260040160405180910390fd5b80546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60606110d37f00000000000000000000000000000000000000000000000000000000000000006000612e5c565b60606110d37f00000000000000000000000000000000000000000000000000000000000000006001612e5c565b61278a8282612f07565b6127b1576040516313c3d61f60e01b8152600481018390526024810182905260440161163e565b600084846040516020016127c6929190614a80565b6040516020818303038152906040528051906020012090508484905060000361280257604051637e25658160e11b815260040160405180910390fd5b60008181527fa2b1bcb5e16cee2a8898b49cb0c3605e70c16f429f6002ed8b1bc5612a694901602052604090208054600080516020614e1683398151915291901515806128525750600181015415155b15612873576040516361db108160e01b81526004810184905260240161163e565b604080518082018252868152602080820187815260008781526001808801845285822094518555915193820193909355600286018054918201815583529120018490555183907fd00539cb08a7c24166308150d64d603150c01baf89d3d3e4c6063d6db7c6983d906128ec908a908a908a908a90614b46565b60405180910390a250505050505050565b6001600160f81b031990811691161490565b366000833580850160208587010360208201945081359350808460051b8301118360401c17156129475763ba597e7e6000526004601cfd5b831561299e578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c17156129955763ba597e7e6000526004601cfd5b50505082612951575b5050509250929050565b606081806001600160401b038111156129c3576129c3613e99565b6040519080825280602002602001820160405280156129f657816020015b60608152602001906001900390816129e15790505b50915060005b81811015612a615736858583818110612a1757612a17614ab9565b9050602002810190612a299190614b6d565b9050612a3b610e2e6020830183614712565b848381518110612a4d57612a4d614ab9565b6020908102919091010152506001016129fc565b505092915050565b606081806001600160401b03811115612a8457612a84613e99565b604051908082528060200260200182016040528015612ab757816020015b6060815260200190600190039081612aa25790505b50915060005b81811015612a615736858583818110612ad857612ad8614ab9565b9050602002810190612aea9190614b6d565b90506000612b15612afe6020840184614712565b6020840135612b106040860186614970565b612be7565b868581518110612b2757612b27614ab9565b6020908102919091010152905080612b8c577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb783868581518110612b6d57612b6d614ab9565b6020026020010151604051612b83929190614ae5565b60405180910390a15b5050600101612abd565b6000803681612ba86014828789614afe565b612bb191614b8d565b60601c9350612bc4603460148789614afe565b612bcd91614b28565b9250612bdc8560348189614afe565b949793965094505050565b604051600090828482376000388483888a5af191503d8152602081013d6000823e3d81016040525094509492505050565b600080600080612c288686612f6a565b925092509250612c388282612fb7565b5090949350505050565b6000806000612c5086613070565b915091506000600288604051602001612c6b91815260200190565b60408051601f1981840301815290829052612c8591614bc0565b602060405180830381855afa158015612ca2573d6000803e3d6000fd5b5050506040513d601f19601f82011682018060405250810190612cc5919061472f565b9050612cd48184848989613092565b98975050505050505050565b600080612cec85613241565b9050612d3986604051602001612d0491815260200190565b60408051601f198184030181529181528301516060840151608085015160a086015160c0870151875160208901518c8c6132bf565b9695505050505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590612d7c5750333014155b15611dd157604051630796d94560e01b815260040160405180910390fd5b816001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015612df4575060408051601f3d908101601f19168201909252612df19181019061472f565b60015b612e1c57604051634c9c8ce360e01b81526001600160a01b038316600482015260240161163e565b600080516020614e568339815191528114612e4d57604051632a87526960e21b81526004810182905260240161163e565b612e57838361345d565b505050565b606060ff8314612e7657612e6f836134b3565b90506108d8565b818054612e8290614bd2565b80601f0160208091040260200160405190810160405280929190818152602001828054612eae90614bd2565b8015612efb5780601f10612ed057610100808354040283529160200191612efb565b820191906000526020600020905b815481529060010190602001808311612ede57829003601f168201915b505050505090506108d8565b60006109b76ffffffffeffffffffffffffffffffffff60601b197fffffffff00000001000000000000000000000000fffffffffffffffffffffffc7f5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b86866134f2565b60008060008351604103612fa45760208401516040850151606086015160001a612f968882858561359d565b955095509550505050612fb0565b50508151600091506002905b9250925092565b6000826003811115612fcb57612fcb614c06565b03612fd4575050565b6001826003811115612fe857612fe8614c06565b036130065760405163f645eedf60e01b815260040160405180910390fd5b600282600381111561301a5761301a614c06565b0361303b5760405163fce698f760e01b81526004810182905260240161163e565b600382600381111561304f5761304f614c06565b03610db4576040516335e2f38360e21b81526004810182905260240161163e565b600080828060200190518101906130879190614c1c565b909590945092505050565b60006130bf60027fffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551614c60565b8411156130ce575060006112a2565b6040805160208101889052908101869052606081018590526080810184905260a0810183905260009060c00160405160208183030381529060405290506000806101006001600160a01b0316836040516131289190614bc0565b600060405180830381855afa9150503d8060008114613163576040519150601f19603f3d011682016040523d82523d6000602084013e613168565b606091505b5080519193509150151582801561317c5750805b156131a35781806020019051810190613195919061472f565b6001149450505050506112a2565b60405163a1f3128160e01b8152600481018b9052602481018a905260448101899052606481018890526084810187905273__$b8f96b288d4d0429e38b8ed50fd423070f$__9063a1f312819060a401602060405180830381865af415801561320f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906132339190614953565b9a9950505050505050505050565b6132836040518060e001604052806000815260200160008152602001606081526020016000151581526020016060815260200160608152602001600081525090565b818060200190518101906132979190614cc7565b60c089015260a088015260808701521515606086015260408501526020840152825250919050565b600060258a5110806132f957506132f78a6020815181106132e2576132e2614ab9565b01602001516001600160f81b0319168a61366c565b155b1561330657506000613233565b6000886133128d6136d2565b8960405160200161332593929190614d86565b60408051601f198184030181528282019091526015825274113a3cb832911d113bb2b130baba34371733b2ba1160591b6020830152915061336781838a6138df565b61337657600092505050613233565b60006002836040516133889190614bc0565b602060405180830381855afa1580156133a5573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052508101906133c8919061472f565b9050600060028e836040516020016133e1929190614dc9565b60408051601f19818403018152908290526133fb91614bc0565b602060405180830381855afa158015613418573d6000803e3d6000fd5b5050506040513d601f19601f8201168201806040525081019061343b919061472f565b905061344a818a8a8a8a613092565b9f9e505050505050505050505050505050565b6134668261398e565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a28051156134ab57612e5782826139f3565b610db4613a60565b606060006134c083613a7f565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600082158015613500575081155b8061350b5750858310155b806135165750858210155b15613523575060006112a2565b6000868061353357613533614c4a565b83840990506000878061354857613548614c4a565b888061355657613556614c4a565b888709898061356757613567614c4a565b878b8061357657613576614c4a565b898a0909089050878061358b5761358b614c4a565b86820891909114979650505050505050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156135d85750600091506003905082613662565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa15801561362c573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661365857506000925060019150829050613662565b9250600091508190505b9450945094915050565b6000600160f81b83811614613683575060006108d8565b8180156136965750600160fa1b83811614155b156136a3575060006108d8565b600160fb1b838116146136c957600f60fc1b600160fc1b8416016136c9575060006108d8565b50600192915050565b606060006136df83613aa7565b9050600081905060006002825111801561372a575081600283516137039190614aa6565b8151811061371357613713614ab9565b6020910101516001600160f81b031916603d60f81b145b1561373757506002613782565b60018251118015613779575081600183516137529190614aa6565b8151811061376257613762614ab9565b6020910101516001600160f81b031916603d60f81b145b15613782575060015b60008183516137919190614aa6565b90506000816001600160401b038111156137ad576137ad613e99565b6040519080825280601f01601f1916602001820160405280156137d7576020820181803683370190505b50905060005b828110156138d4578481815181106137f7576137f7614ab9565b01602001516001600160f81b031916602b60f81b0361384357602d60f81b82828151811061382757613827614ab9565b60200101906001600160f81b031916908160001a9053506138cc565b84818151811061385557613855614ab9565b01602001516001600160f81b031916602f60f81b0361388557605f60f81b82828151811061382757613827614ab9565b84818151811061389757613897614ab9565b602001015160f81c60f81b8282815181106138b4576138b4614ab9565b60200101906001600160f81b031916908160001a9053505b6001016137dd565b509695505050505050565b825182516000918591859190845b8281101561397f57816139008289614deb565b10613913576000955050505050506109b7565b8361391e8289614deb565b8151811061392e5761392e614ab9565b602001015160f81c60f81b6001600160f81b03191685828151811061395557613955614ab9565b01602001516001600160f81b03191614613977576000955050505050506109b7565b6001016138ed565b50600198975050505050505050565b806001600160a01b03163b6000036139c457604051634c9c8ce360e01b81526001600160a01b038216600482015260240161163e565b600080516020614e5683398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b031684604051613a109190614bc0565b600060405180830381855af49150503d8060008114613a4b576040519150601f19603f3d011682016040523d82523d6000602084013e613a50565b606091505b50915091506112a2858383613acd565b3415610ea65760405163b398979f60e01b815260040160405180910390fd5b600060ff8216601f8111156108d857604051632cd44ac360e21b815260040160405180910390fd5b60606108d882604051806060016040528060408152602001614e76604091396001613b29565b606082613ae257613add82613ca8565b6109b7565b8151158015613af957506001600160a01b0384163b155b15613b2257604051639996b31560e01b81526001600160a01b038516600482015260240161163e565b50806109b7565b60608351600003613b4957506040805160208101909152600081526109b7565b600082613b7a57600385516004613b609190614dfe565b613b6b906002614deb565b613b759190614c60565b613b9f565b600385516002613b8a9190614deb565b613b949190614c60565b613b9f906004614dfe565b90506000816001600160401b03811115613bbb57613bbb613e99565b6040519080825280601f01601f191660200182016040528015613be5576020820181803683370190505b50905060018501602082018788518901602081018051600082525b82841015613c5b576003840193508351603f8160121c168701518653600186019550603f81600c1c168701518653600186019550603f8160061c168701518653600186019550603f8116870151865350600185019450613c00565b905250508515613c9c57600388510660018114613c7f5760028114613c9257613c9a565b603d6001830353603d6002830353613c9a565b603d60018303535b505b50909695505050505050565b805115613cb85780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b5080546000825590600052602060002090810190611dd191905b80821115613cff5760008155600101613ceb565b5090565b600060208284031215613d1557600080fd5b81356001600160e01b0319811681146109b757600080fd5b60006101208284031215613d4057600080fd5b50919050565b600060208284031215613d5857600080fd5b81356001600160401b03811115613d6e57600080fd5b613d7a84828501613d2d565b949350505050565b6001600160a01b0381168114611dd157600080fd5b8035611e5f81613d82565b60008083601f840112613db457600080fd5b5081356001600160401b03811115613dcb57600080fd5b6020830191508360208260051b8501011115613de657600080fd5b9250929050565b60008060008060008060006080888a031215613e0857600080fd5b8735613e1381613d82565b965060208801356001600160401b0380821115613e2f57600080fd5b613e3b8b838c01613da2565b909850965060408a0135915080821115613e5457600080fd5b613e608b838c01613da2565b909650945060608a0135915080821115613e7957600080fd5b50613e868a828b01613da2565b989b979a50959850939692959293505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715613ed757613ed7613e99565b604052919050565b60006001600160401b03821115613ef857613ef8613e99565b50601f01601f191660200190565b600082601f830112613f1757600080fd5b8135613f2a613f2582613edf565b613eaf565b818152846020838601011115613f3f57600080fd5b816020850160208301376000918101602001919091529392505050565b60008060008060808587031215613f7257600080fd5b8435613f7d81613d82565b93506020850135613f8d81613d82565b92506040850135915060608501356001600160401b03811115613faf57600080fd5b613fbb87828801613f06565b91505092959194509250565b60008083601f840112613fd957600080fd5b5081356001600160401b03811115613ff057600080fd5b602083019150836020828501011115613de657600080fd5b60008060006040848603121561401d57600080fd5b8335925060208401356001600160401b0381111561403a57600080fd5b61404686828701613fc7565b9497909650939450505050565b60008060006060848603121561406857600080fd5b83356001600160401b0381111561407e57600080fd5b61408a86828701613d2d565b9660208601359650604090950135949350505050565b6020808252825182820181905260009190848201906040850190845b81811015613c9c578351835292840192918401916001016140bc565b6000602082840312156140ea57600080fd5b81356001600160c01b03811681146109b757600080fd5b60006020828403121561411357600080fd5b81356001600160401b0381111561412957600080fd5b820160c081850312156109b757600080fd5b60006020828403121561414d57600080fd5b5035919050565b6000806040838503121561416757600080fd5b823561417281613d82565b915060208301356001600160401b0381111561418d57600080fd5b61419985828601613f06565b9150509250929050565b6000602082840312156141b557600080fd5b81356001600160401b038111156141cb57600080fd5b8201606081850312156109b757600080fd5b8015158114611dd157600080fd5b8035611e5f816141dd565b600080600080600080600080600060c08a8c03121561421457600080fd5b893560ff8116811461422557600080fd5b985061423360208b01613d97565b975060408a01356001600160401b038082111561424f57600080fd5b61425b8d838e01613da2565b909950975060608c013591508082111561427457600080fd5b6142808d838e01613da2565b909750955060808c013591508082111561429957600080fd5b506142a68c828d01613da2565b90945092506142b9905060a08b016141eb565b90509295985092959850929598565b600080604083850312156142db57600080fd5b82356142e681613d82565b946020939093013593505050565b60005b8381101561430f5781810151838201526020016142f7565b50506000910152565b600081518084526143308160208601602086016142f4565b601f01601f19169290920160200192915050565b60ff60f81b881681526000602060e0602084015261436560e084018a614318565b8381036040850152614377818a614318565b606085018990526001600160a01b038816608086015260a0850187905284810360c08601528551808252602080880193509091019060005b818110156143cb578351835292840192918401916001016143af565b50909c9b505050505050505050505050565b6020815260006109b76020830184614318565b600082601f83011261440157600080fd5b813560206001600160401b0382111561441c5761441c613e99565b8160051b61442b828201613eaf565b928352848101820192828101908785111561444557600080fd5b83870192505b848310156144645782358252918301919083019061444b565b979650505050505050565b600080600080600060a0868803121561448757600080fd5b853561449281613d82565b945060208601356144a281613d82565b935060408601356001600160401b03808211156144be57600080fd5b6144ca89838a016143f0565b945060608801359150808211156144e057600080fd5b6144ec89838a016143f0565b9350608088013591508082111561450257600080fd5b5061450f88828901613f06565b9150509295509295909350565b6000806000806060858703121561453257600080fd5b84356001600160401b0381111561454857600080fd5b61455487828801613fc7565b90989097506020870135966040013595509350505050565b6000806000806000806060878903121561458557600080fd5b86356001600160401b038082111561459c57600080fd5b6145a88a838b01613da2565b909850965060208901359150808211156145c157600080fd5b6145cd8a838b01613da2565b909650945060408901359150808211156145e657600080fd5b506145f389828a01613da2565b979a9699509497509295939492505050565b6000806020838503121561461857600080fd5b82356001600160401b0381111561462e57600080fd5b61463a85828601613fc7565b90969095509350505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b8281101561469d57603f1988860301845261468b858351614318565b9450928501929085019060010161466f565b5092979650505050505050565b600080600080600060a086880312156146c257600080fd5b85356146cd81613d82565b945060208601356146dd81613d82565b9350604086013592506060860135915060808601356001600160401b0381111561470657600080fd5b61450f88828901613f06565b60006020828403121561472457600080fd5b81356109b781613d82565b60006020828403121561474157600080fd5b5051919050565b6000808335601e1984360301811261475f57600080fd5b83016020810192503590506001600160401b0381111561477e57600080fd5b803603821315613de657600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60008383855260208086019550808560051b830101846000805b8881101561486957858403601f19018a52823536899003605e190181126147f5578283fd5b88016060813561480481613d82565b6001600160a01b0316865261481b82880183614748565b828989015261482d838901828461478d565b92505050604061483f81840184614748565b93508783038289015261485383858361478d565b9d89019d975050509386019350506001016147d0565b509198975050505050505050565b602081526000823561488881613d82565b6001600160a01b03908116602084810191909152840135906148a982613d82565b80821660408501525050604083013560608301526060830135601e198436030181126148d457600080fd5b83016020810190356001600160401b038111156148f057600080fd5b8060051b360382131561490257600080fd5b60c0608085015261491760e0850182846147b6565b915050608084013560a084015261493160a0850185614748565b848303601f190160c0860152612d3983828461478d565b8051611e5f816141dd565b60006020828403121561496557600080fd5b81516109b7816141dd565b6000808335601e1984360301811261498757600080fd5b8301803591506001600160401b038211156149a157600080fd5b602001915036819003821315613de657600080fd5b6000838385526020808601955060208560051b8301018460005b87811015614a0a57848303601f190189526149eb8288614748565b6149f685828461478d565b9a86019a94505050908301906001016149d0565b5090979650505050505050565b606081526000614a2b60608301888a6149b6565b8281036020848101919091528682528791810160005b88811015614a5d57833582529282019290820190600101614a41565b508481036040860152614a718187896149b6565b9b9a5050505050505050505050565b8183823760009101908152919050565b634e487b7160e01b600052601160045260246000fd5b818103818111156108d8576108d8614a90565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b8281526040602082015260006109b46040830184614318565b60008085851115614b0e57600080fd5b83861115614b1b57600080fd5b5050820193919092039150565b803560208310156108d857600019602084900360031b1b1692915050565b606081526000614b5a60608301868861478d565b6020830194909452506040015292915050565b60008235605e19833603018112614b8357600080fd5b9190910192915050565b6bffffffffffffffffffffffff198135818116916014851015612a615760149490940360031b84901b1690921692915050565b60008251614b838184602087016142f4565b600181811c90821680614be657607f821691505b602082108103613d4057634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b600080600060608486031215614c3157600080fd5b8351925060208401519150604084015190509250925092565b634e487b7160e01b600052601260045260246000fd5b600082614c7d57634e487b7160e01b600052601260045260246000fd5b500490565b600082601f830112614c9357600080fd5b8151614ca1613f2582613edf565b818152846020838601011115614cb657600080fd5b613d7a8260208301602087016142f4565b600080600080600080600080610100898b031215614ce457600080fd5b88519750602089015196506040890151955060608901516001600160401b0380821115614d1057600080fd5b614d1c8c838d01614c82565b9650614d2a60808c01614948565b955060a08b0151915080821115614d4057600080fd5b614d4c8c838d01614c82565b945060c08b0151915080821115614d6257600080fd5b50614d6f8b828c01614c82565b92505060e089015190509295985092959890939650565b60008451614d988184602089016142f4565b845190830190614dac8183602089016142f4565b8451910190614dbf8183602088016142f4565b0195945050505050565b60008351614ddb8184602088016142f4565b9190910191825250602001919050565b808201808211156108d8576108d8614a90565b80820281158282048414176108d8576108d8614a9056fea2b1bcb5e16cee2a8898b49cb0c3605e70c16f429f6002ed8b1bc5612a694900a2b1bcb5e16cee2a8898b49cb0c3605e70c16f429f6002ed8b1bc5612a694902360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc4142434445464748494a4b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f707172737475767778797a303132333435363738392b2fa2646970667358221220d641f685fbc825f5c1c752f10b46c0f81d9143a8b41e10871b92196f03c53fe864736f6c63430008170033" as const;