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
    "name": "MAX_NUMBER_OF_SIGNERS",
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
    "name": "addSigner",
    "inputs": [
      {
        "name": "_newSigner",
        "type": "address",
        "internalType": "address"
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
    "name": "getSigners",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSignersCount",
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
    "name": "getThreshold",
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
    "name": "initialize",
    "inputs": [
      {
        "name": "_signers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "isSigner",
    "inputs": [
      {
        "name": "_addr",
        "type": "address",
        "internalType": "address"
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
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "_signers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_clearSigners",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeSigner",
    "inputs": [
      {
        "name": "_oldSigner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "replaceSigner",
    "inputs": [
      {
        "name": "_oldSigner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_newSigner",
        "type": "address",
        "internalType": "address"
      }
    ],
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
    "name": "updateMultiSigParameters",
    "inputs": [
      {
        "name": "_signers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "_threshold",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_clearSigners",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateThreshold",
    "inputs": [
      {
        "name": "_threshold",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "AddedSigner",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
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
    "name": "RemovedSigner",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReplacedSigner",
    "inputs": [
      {
        "name": "oldSigner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newSigner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
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
    "name": "UpdatedThreshold",
    "inputs": [
      {
        "name": "threshold",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
    "name": "AlreadyASigner",
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
    "name": "InsufficientSigners",
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
    "name": "InvalidSignerAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidThreshold",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotASigner",
    "inputs": []
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
    "name": "TooManySigners",
    "inputs": []
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


export const bytecode = "0x6101c0604052306080523480156200001657600080fd5b506040516200492838038062004928833981016040819052620000399162000392565b81816040518060400160405280601181526020017026bab63a34a9b4b3a232b632a3b0ba37b960791b815250604051806040016040528060018152602001603160f81b8152508181620000976000836200021f60201b90919060201c565b61014052620000a88160016200021f565b61016052815160208084019190912061010052815190820120610120524660c052620001386101005161012051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60a05250503060e0526200014b62000258565b6001600160a01b038085166101808190529084166101a0526040517fb2e8eb88b584ae71ef4e854c10847f4d39bd93e52599f147bfb4dcc8de52014d90600090a26040516001600160a01b038416907fee8699dc0e27105da2653bdba54be0edcaadc3e33890a3ad705517ffe9bf0a9990600090a2505050506000620001d66200030c60201b60201c565b600019600282018190556040519081529091507f78c34957a47c9ef62a6f6f2f8720f71e2394a6438100e7e20d139c3cbe774d039060200160405180910390a1505050620005ba565b60006020835110156200023f57620002378362000330565b905062000252565b816200024c848262000478565b5060ff90505b92915050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff1615620002a95760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b0390811614620003095780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b7fb005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c0090565b600080829050601f8151111562000367578260405163305a27a960e01b81526004016200035e919062000544565b60405180910390fd5b8051620003748262000595565b179392505050565b6001600160a01b03811681146200030957600080fd5b60008060408385031215620003a657600080fd5b8251620003b3816200037c565b6020840151909250620003c6816200037c565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620003fc57607f821691505b6020821081036200041d57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111562000473576000816000526020600020601f850160051c810160208610156200044e5750805b601f850160051c820191505b818110156200046f578281556001016200045a565b5050505b505050565b81516001600160401b03811115620004945762000494620003d1565b620004ac81620004a58454620003e7565b8462000423565b602080601f831160018114620004e45760008415620004cb5750858301515b600019600386901b1c1916600185901b1785556200046f565b600085815260208120601f198616915b828110156200051557888601518255948401946001909101908401620004f4565b5085821015620005345787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60006020808352835180602085015260005b81811015620005745785810183015185820160400152820162000556565b506000604082860101526040601f19601f8301168501019250505092915050565b805160208083015191908110156200041d5760001960209190910360031b1b16919050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a051614235620006f3600039600081816106d8015281816109cd01528181610c2d01528181610cb701528181610d3501528181610e9901528181610f4e01528181610fd90152818161115e0152818161124e015281816113010152818161137301528181611523015281816115a20152818161169d0152818161195501528181611a4b01528181611c6101528181611e64015281816120da0152612d0d01526000818161084a01528181610d9801528181610e1b01528181610efc0152818161160501526116e1015260006129970152600061296a015260006122be01526000612296015260006121f10152600061221b0152600061224501526000818161214801528181612171015261267101526142356000f3fe6080604052600436106102815760003560e01c806394cf795e1161014f578063cef6d209116100c1578063e9ae5c531161007a578063e9ae5c5314610825578063ea4d3c9b14610838578063eb12d61e1461086c578063ed8101b51461088c578063f23a6e61146108ac578063ffa1ad74146108cc57600080fd5b8063cef6d2091461075c578063d087d2881461077c578063d691c96414610791578063d7d7442f146107b1578063e3d9109f146107d1578063e75235b8146107f157600080fd5b8063acb8cc4911610113578063acb8cc4914610668578063ad3cb1cc14610695578063b0d691fe146106c6578063b3c65015146106fa578063bc197c8114610727578063c399ec881461074757600080fd5b806394cf795e1461059a578063a0c1deb4146105bc578063a24c8f32146105de578063a3f4df7e146105f1578063aaf10f421461063b57600080fd5b806349934047116101f357806365ee81d8116101ac57806365ee81d8146104b757806378979a80146104d75780637df73e27146104f75780637f07bfdc1461053d57806383ebb7711461055d57806384b0196e1461057257600080fd5b806349934047146104345780634a58db19146104545780634f1ef2861461045c57806352d1902d1461046f5780635c1c6dcd1461048457806360b5bb3f1461049757600080fd5b806319822f7c1161024557806319822f7c1461036b5780632b3afd991461038b5780633e1b0812146103bf5780633ed01015146103df578063445140b8146103ff5780634891161f1461041f57600080fd5b806301ffc9a71461028d57806306394d67146102c25780630e316ab7146102f0578063150b7a02146103125780631626ba7e1461034b57600080fd5b3661028857005b600080fd5b34801561029957600080fd5b506102ad6102a8366004613309565b6108fd565b60405190151581526020015b60405180910390f35b3480156102ce57600080fd5b506102e26102dd36600461334c565b61098d565b6040519081526020016102b9565b3480156102fc57600080fd5b5061031061030b36600461339d565b6109c2565b005b34801561031e57600080fd5b5061033261032d36600461346f565b610be6565b6040516001600160e01b031990911681526020016102b9565b34801561035757600080fd5b50610332610366366004613522565b610c01565b34801561037757600080fd5b506102e261038636600461356d565b610c20565b34801561039757600080fd5b506102e27fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc1881565b3480156103cb57600080fd5b506102e26103da3660046135ba565b610c90565b3480156103eb57600080fd5b506103106103fa3660046135e3565b610d2a565b34801561040b57600080fd5b506102ad61041a36600461361d565b610e02565b34801561042b57600080fd5b506102e2601e81565b34801561044057600080fd5b5061031061044f3660046135e3565b610e8e565b610310610f31565b61031061046a366004613636565b610f9b565b34801561047b57600080fd5b506102e2610fb1565b610310610492366004613685565b610fce565b3480156104a357600080fd5b506103106104b2366004613703565b61103e565b3480156104c357600080fd5b506103106104d236600461375c565b611153565b3480156104e357600080fd5b506103106104f23660046137ba565b6111bc565b34801561050357600080fd5b506102ad61051236600461339d565b6001600160a01b031660009081526000805160206141c0833981519152602052604090205460ff1690565b34801561054957600080fd5b50610310610558366004613836565b6112f6565b34801561056957600080fd5b506102e26113d3565b34801561057e57600080fd5b506105876113e2565b6040516102b997969594939291906138b2565b3480156105a657600080fd5b506105af611428565b6040516102b9919061394b565b3480156105c857600080fd5b506000805160206141a0833981519152546102e2565b6103106105ec366004613636565b610fa3565b3480156105fd57600080fd5b5061062e6040518060400160405280601181526020017026bab63a34a9b4b3a232b632a3b0ba37b960791b81525081565b6040516102b99190613998565b34801561064757600080fd5b5061065061149b565b6040516001600160a01b0390911681526020016102b9565b34801561067457600080fd5b5061062e604051806040016040528060018152602001603160f81b81525081565b3480156106a157600080fd5b5061062e604051806040016040528060058152602001640352e302e360dc1b81525081565b3480156106d257600080fd5b506106507f000000000000000000000000000000000000000000000000000000000000000081565b34801561070657600080fd5b5061070f6114bc565b6040516001600160401b0390911681526020016102b9565b34801561073357600080fd5b50610332610742366004613a2a565b6114ef565b34801561075357600080fd5b506102e261150b565b34801561076857600080fd5b50610310610777366004613ad7565b611597565b34801561078857600080fd5b506102e261167e565b6107a461079f366004613522565b6116d4565b6040516102b99190613b70565b3480156107bd57600080fd5b506103106107cc36600461361d565b61194a565b3480156107dd57600080fd5b506103106107ec366004613bd4565b611a40565b3480156107fd57600080fd5b507fb005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c02546102e2565b610310610833366004613522565b611c56565b34801561084457600080fd5b506106507f000000000000000000000000000000000000000000000000000000000000000081565b34801561087857600080fd5b5061031061088736600461339d565b611e59565b34801561089857600080fd5b506102e26108a736600461334c565b611fdf565b3480156108b857600080fd5b506103326108c7366004613c0d565b612121565b3480156108d857600080fd5b5061062e604051806040016040528060058152602001640312e332e360dc1b81525081565b600061090761213d565b6001600160e01b031982166335a4725960e21b148061093657506001600160e01b03198216630a85bd0160e11b145b8061095157506001600160e01b03198216630271189760e51b145b8061096c57506001600160e01b031982166301ffc9a760e01b145b8061098757506001600160e01b03198216630b135d3f60e11b145b92915050565b600061098761099a6121e4565b6109a384611fdf565b60405161190160f01b8152600281019290925260228201526042902090565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906109fb5750333014155b15610a1957604051630796d94560e01b815260040160405180910390fd5b6001600160a01b03811660009081526000805160206141c0833981519152602081905260409091205460ff16610a625760405163da0357f760e01b815260040160405180910390fd5b600181015460028201548103610a8b576040516361774dcf60e11b815260040160405180910390fd5b60005b610a99600183613c8b565b811015610b6357836001600160a01b0316836001018281548110610abf57610abf613c9e565b6000918252602090912001546001600160a01b031603610b5b5782600101600183610aea9190613c8b565b81548110610afa57610afa613c9e565b6000918252602090912001546001840180546001600160a01b039092169183908110610b2857610b28613c9e565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550610b63565b600101610a8e565b5081600101805480610b7757610b77613cb4565b60008281526020808220830160001990810180546001600160a01b03191690559092019092556001600160a01b038516808352908490526040808320805460ff191690555190917fb0073c14ccc2332b5b461c0d2fb94366f38d3954a82745e74827aa0811c9f98191a2505050565b6000610bf061213d565b50630a85bd0160e11b949350505050565b6000610c0b61213d565b610c1684848461230f565b90505b9392505050565b6000336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610c6b57604051636b31ba1560e11b815260040160405180910390fd5b610c7361213d565b610c8584610c808661098d565b6124ae565b9050610c19826124f6565b604051631aab3f0d60e11b81523060048201526001600160c01b03821660248201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a90604401602060405180830381865afa158015610d06573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109879190613cca565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610d635750333014155b15610d8157604051630796d94560e01b815260040160405180910390fd5b604051633ed0101560e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690633ed0101590610dcd908490600401613e12565b600060405180830381600087803b158015610de757600080fd5b505af1158015610dfb573d6000803e3d6000fd5b5050505050565b6040516316a0682960e11b8152600481018290526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632d40d05290602401602060405180830381865afa158015610e6a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109879190613eed565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590610ec75750333014155b15610ee557604051630796d94560e01b815260040160405180910390fd5b604051634993404760e01b81526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690634993404790610dcd908490600401613e12565b610f3961213d565b60405163b760faf960e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063b760faf99034906024016000604051808303818588803b158015610de757600080fd5b610fa361258e565b610fad828261264b565b5050565b6000610fbb612666565b506000805160206141e083398151915290565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461101757604051636b31ba1560e11b815260040160405180910390fd5b610fad611027602083018361339d565b60208301356110396040850185613f0a565b6126af565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff1615906001600160401b03166000811580156110835750825b90506000826001600160401b0316600114801561109f5750303b155b9050811580156110ad575080155b156110cb5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156110f557845460ff60401b1916600160401b1785555b61110288888860006126e5565b831561114957845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2906020015b60405180910390a15b5050505050505050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061118c5750333014155b156111aa57604051630796d94560e01b815260040160405180910390fd5b6111b6848484846126e5565b50505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054869190600160401b900460ff1680611204575080546001600160401b03808416911610155b156112225760405163f92ee8a960e01b815260040160405180910390fd5b805468ffffffffffffffffff19166001600160401b03831617600160401b178155336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061127c5750333014155b1561129a57604051630796d94560e01b815260040160405180910390fd5b6112a6868686866126e5565b805460ff60401b191681556040516001600160401b03831681527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a150505050505050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480159061132f5750333014155b1561134d57604051630796d94560e01b815260040160405180910390fd5b60405163040b850f60e31b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063205c287890604401600060405180830381600087803b1580156113b757600080fd5b505af11580156113cb573d6000803e3d6000fd5b505050505050565b60006113dd6121e4565b905090565b6000606080600080600060606113f6612963565b6113fe612990565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b606060006000805160206141c08339815191526001810180546040805160208084028201810190925282815293945083018282801561149057602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611472575b505050505091505090565b60006113dd6000805160206141e0833981519152546001600160a01b031690565b60006113dd7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00546001600160401b031690565b60006114f961213d565b5063bc197c8160e01b95945050505050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a08231906024015b602060405180830381865afa158015611573573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113dd9190613cca565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906115d05750333014155b156115ee57604051630796d94560e01b815260040160405180910390fd5b60405163cef6d20960e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cef6d2099061164490899089908990899089908990600401613fb1565b600060405180830381600087803b15801561165e57600080fd5b505af1158015611672573d6000803e3d6000fd5b50505050505050505050565b604051631aab3f0d60e11b8152306004820152600060248201819052907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906335567e1a90604401611556565b6060336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461171f57604051630692ce8160e21b815260040160405180910390fd5b83600881901b61173382600160f81b6129bd565b156117b95736600061174587876129cf565b90925090506117558360006129bd565b1561176b576117648282612a68565b94506117b2565b61177983600160f81b6129bd565b15611788576117648282612b29565b6040516308c3ee0360e11b81526001600160f81b0319841660048201526024015b60405180910390fd5b5050611941565b6117c48260006129bd565b1561191c576000803660006117d98989612c56565b6040805160018082528183019092529498509296509094509250816020015b60608152602001906001900390816117f8579050509650600061181b86826129bd565b1561184f5761182c858585856126af565b8860008151811061183f5761183f613c9e565b6020026020010181905250611912565b61185d86600160f81b6129bd565b156118ed5761186e85858585612ca7565b8960008151811061188157611881613c9e565b60209081029190910101529050806118e8577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb76000896000815181106118c9576118c9613c9e565b60200260200101516040516118df92919061401a565b60405180910390a15b611912565b6040516308c3ee0360e11b81526001600160f81b0319871660048201526024016117a9565b5050505050611941565b604051632e5bf3f960e21b81526001600160f81b0319831660048201526024016117a9565b50509392505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015906119835750333014155b156119a157604051630796d94560e01b815260040160405180910390fd5b806000036119c25760405163aabd5a0960e01b815260040160405180910390fd5b6000805160206141a0833981519152546000805160206141c083398151915290821115611a025760405163aabd5a0960e01b815260040160405180910390fd5b600281018290556040518281527f78c34957a47c9ef62a6f6f2f8720f71e2394a6438100e7e20d139c3cbe774d039060200160405180910390a15050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590611a795750333014155b15611a9757604051630796d94560e01b815260040160405180910390fd5b6001600160a01b0381161580611ab657506001600160a01b0381163b15155b15611ad457604051634501a91960e01b815260040160405180910390fd5b6001600160a01b03821660009081526000805160206141c0833981519152602081905260409091205460ff16611b1d5760405163da0357f760e01b815260040160405180910390fd5b6001600160a01b03821660009081526020829052604090205460ff1615611b5757604051631985f4ab60e31b815260040160405180910390fd5b600181015460005b81811015611bf157846001600160a01b0316836001018281548110611b8657611b86613c9e565b6000918252602090912001546001600160a01b031603611be95783836001018281548110611bb657611bb6613c9e565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550611bf1565b600101611b5f565b506001600160a01b03808516600081815260208590526040808220805460ff199081169091559387168083528183208054909516600117909455517f53a7b6f060162826746b07f3ff5cc66b83afad3bc9a57c9f34d7802901c6e8299190a350505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614611c9f57604051636b31ba1560e11b815260040160405180910390fd5b82600881901b611cb382600160f81b6129bd565b15611d0e57366000611cc586866129cf565b9092509050611cd58360006129bd565b15611cea57611ce48282612a68565b50611d07565b611cf883600160f81b6129bd565b1561178857611ce48282612b29565b5050610dfb565b611d198260006129bd565b1561191c57600080366000611d2e8888612c56565b9350935093509350611d4485600060f81b6129bd565b15611d5b57611d55848484846126af565b50611e50565b611d6985600160f81b6129bd565b15611e2b57604080516001808252818301909252600091816020015b6060815260200190600190039081611d855790505090506000611daa86868686612ca7565b83600081518110611dbd57611dbd613c9e565b6020908102919091010152905080611e24577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb7600083600081518110611e0557611e05613c9e565b6020026020010151604051611e1b92919061401a565b60405180910390a15b5050611e50565b6040516308c3ee0360e11b81526001600160f81b0319861660048201526024016117a9565b50505050610dfb565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590611e925750333014155b15611eb057604051630796d94560e01b815260040160405180910390fd5b6001600160a01b0381161580611ecf57506001600160a01b0381163b15155b15611eed57604051634501a91960e01b815260040160405180910390fd5b6000805160206141a0833981519152546000805160206141c083398151915290601d1901611f2e57604051630dc92ed360e11b815260040160405180910390fd5b6001600160a01b03821660009081526020829052604090205460ff1615611f6857604051631985f4ab60e31b815260040160405180910390fd5b6001818101805480830182556000918252602080832090910180546001600160a01b0319166001600160a01b038716908117909155808352908490526040808320805460ff191690941790935591517f82b74755d483f0688b80354268454667c377a5684e64a4dbb6820fc11a6276d49190a25050565b60007fbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc1861200f602084018461339d565b60208401356120216040860186613f0a565b60405161202f929190614033565b6040519081900390206120456060870187613f0a565b604051612053929190614033565b604051908190039020608087013560a088013560c089013561207860e08b018b613f0a565b604051612086929190614033565b60408051918290038220602083019a909a526001600160a01b03988916908201526060810196909652608086019490945260a085019290925260c084015260e08301526101008201526101208101929092527f00000000000000000000000000000000000000000000000000000000000000001661014082015261016001604051602081830303815290604052805190602001209050919050565b600061212b61213d565b5063f23a6e6160e01b95945050505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614806121c457507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166121b86000805160206141e0833981519152546001600160a01b031690565b6001600160a01b031614155b156121e25760405163703e46dd60e11b815260040160405180910390fd5b565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561223d57507f000000000000000000000000000000000000000000000000000000000000000046145b1561226757507f000000000000000000000000000000000000000000000000000000000000000090565b6113dd604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b7fb005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c02546000906000805160206141c08339815191529061235090604190614043565b831461236757506001600160e01b03199050610c19565b600061237460418561405a565b600283015490915060008080805b858110156124965760008a8a612399604185614043565b9060416123a786600161407c565b6123b19190614043565b926123be9392919061408f565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092935061240292508e9150839050612cd8565b9350846001600160a01b0316846001600160a01b031611158061243e57506001600160a01b03841660009081526020899052604090205460ff16155b1561245c57506001600160e01b03199750610c199650505050505050565b82612466816140b9565b9350508583106124885750630b135d3f60e11b9750610c199650505050505050565b509192508291600101612382565b506001600160e01b03199a9950505050505050505050565b6000806124c8836124c3610100870187613f0a565b61230f565b90506374eca2c160e11b6001600160e01b03198216016124ec576000915050610987565b5060019392505050565b801561258b57604051600090339060001990849084818181858888f193505050503d8060008114612543576040519150601f19603f3d011682016040523d82523d6000602084013e612548565b606091505b505060408051848152821515602082015291925033917fa427c7d47f24d01b170779a7600b1d4c0d7cdbabaa0f19c4f0e6182053ffc931910160405180910390a2505b50565b6000805160206141a0833981519152546000805160206141c08339815191529060005b81811015612608578260000160008460010183815481106125d4576125d4613c9e565b60009182526020808320909101546001600160a01b031683528201929092526040019020805460ff191690556001016125b1565b506126176001830160006132d7565b6000600283018190556040517feb09d532980c3cc73dcad99b80e264204a667a54cbb7b63ec8d68dcb1c7096be9190a15050565b61265361213d565b61265c82612d02565b610fad8282612d59565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146121e25760405163703e46dd60e11b815260040160405180910390fd5b60405181838237600038838387895af16126cc573d6000823e3d81fd5b3d8152602081013d6000823e3d01604052949350505050565b6000805160206141a08339815191525483906000805160206141c08339815191529060008461271d57612718828561407c565b61271f565b835b905085158061272d57508086115b1561274b5760405163aabd5a0960e01b815260040160405180910390fd5b601e81111561276d57604051630dc92ed360e11b815260040160405180910390fd5b84156128015760005b828110156127f257600084600101828154811061279557612795613c9e565b60009182526020808320909101546001600160a01b0316808352908790526040808320805460ff191690555190925082917fb0073c14ccc2332b5b461c0d2fb94366f38d3954a82745e74827aa0811c9f98191a250600101612776565b506128016001840160006132d7565b60005b8481101561292b57600089898381811061282057612820613c9e565b9050602002016020810190612835919061339d565b6001600160a01b03811660009081526020879052604090205490915060ff161561287257604051631985f4ab60e31b815260040160405180910390fd5b6001600160a01b038116158061289157506001600160a01b0381163b15155b156128af57604051634501a91960e01b815260040160405180910390fd5b6001858101805480830182556000918252602080832090910180546001600160a01b0319166001600160a01b038616908117909155808352908890526040808320805460ff191690941790935591517f82b74755d483f0688b80354268454667c377a5684e64a4dbb6820fc11a6276d49190a250600101612804565b50600283018690556040518681527f78c34957a47c9ef62a6f6f2f8720f71e2394a6438100e7e20d139c3cbe774d0390602001611140565b60606113dd7f00000000000000000000000000000000000000000000000000000000000000006000612e1b565b60606113dd7f00000000000000000000000000000000000000000000000000000000000000006001612e1b565b6001600160f81b031990811691161490565b366000833580850160208587010360208201945081359350808460051b8301118360401c1715612a075763ba597e7e6000526004601cfd5b8315612a5e578392505b6001830392508260051b850135915081850160408101358082018381358201118460408501111782861782351760401c1715612a555763ba597e7e6000526004601cfd5b50505082612a11575b5050509250929050565b606081806001600160401b03811115612a8357612a836133ba565b604051908082528060200260200182016040528015612ab657816020015b6060815260200190600190039081612aa15790505b50915060005b81811015612b215736858583818110612ad757612ad7613c9e565b9050602002810190612ae991906140d2565b9050612afb611027602083018361339d565b848381518110612b0d57612b0d613c9e565b602090810291909101015250600101612abc565b505092915050565b606081806001600160401b03811115612b4457612b446133ba565b604051908082528060200260200182016040528015612b7757816020015b6060815260200190600190039081612b625790505b50915060005b81811015612b215736858583818110612b9857612b98613c9e565b9050602002810190612baa91906140d2565b90506000612bd5612bbe602084018461339d565b6020840135612bd06040860186613f0a565b612ca7565b868581518110612be757612be7613c9e565b6020908102919091010152905080612c4c577fe723f28f104e46b47fd3531f3608374ac226bcf3ddda334a23a266453e0efdb783868581518110612c2d57612c2d613c9e565b6020026020010151604051612c4392919061401a565b60405180910390a15b5050600101612b7d565b6000803681612c68601482878961408f565b612c71916140f2565b60601c9350612c8460346014878961408f565b612c8d91614125565b9250612c9c856034818961408f565b949793965094505050565b604051600090828482376000388483888a5af191503d8152602081013d6000823e3d81016040525094509492505050565b600080600080612ce88686612ec6565b925092509250612cf88282612f13565b5090949350505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801590612d3b5750333014155b1561258b57604051630796d94560e01b815260040160405180910390fd5b816001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015612db3575060408051601f3d908101601f19168201909252612db091810190613cca565b60015b612ddb57604051634c9c8ce360e01b81526001600160a01b03831660048201526024016117a9565b6000805160206141e08339815191528114612e0c57604051632a87526960e21b8152600481018290526024016117a9565b612e168383612fcc565b505050565b606060ff8314612e3557612e2e83613022565b9050610987565b818054612e4190614143565b80601f0160208091040260200160405190810160405280929190818152602001828054612e6d90614143565b8015612eba5780601f10612e8f57610100808354040283529160200191612eba565b820191906000526020600020905b815481529060010190602001808311612e9d57829003601f168201915b50505050509050610987565b60008060008351604103612f005760208401516040850151606086015160001a612ef288828585613061565b955095509550505050612f0c565b50508151600091506002905b9250925092565b6000826003811115612f2757612f27614177565b03612f30575050565b6001826003811115612f4457612f44614177565b03612f625760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115612f7657612f76614177565b03612f975760405163fce698f760e01b8152600481018290526024016117a9565b6003826003811115612fab57612fab614177565b03610fad576040516335e2f38360e21b8152600481018290526024016117a9565b612fd582613130565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561301a57612e168282613195565b610fad61320b565b6060600061302f8361322a565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a084111561309c5750600091506003905082613126565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa1580156130f0573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661311c57506000925060019150829050613126565b9250600091508190505b9450945094915050565b806001600160a01b03163b60000361316657604051634c9c8ce360e01b81526001600160a01b03821660048201526024016117a9565b6000805160206141e083398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b0316846040516131b2919061418d565b600060405180830381855af49150503d80600081146131ed576040519150601f19603f3d011682016040523d82523d6000602084013e6131f2565b606091505b5091509150613202858383613252565b95945050505050565b34156121e25760405163b398979f60e01b815260040160405180910390fd5b600060ff8216601f81111561098757604051632cd44ac360e21b815260040160405180910390fd5b60608261326757613262826132ae565b610c19565b815115801561327e57506001600160a01b0384163b155b156132a757604051639996b31560e01b81526001600160a01b03851660048201526024016117a9565b5080610c19565b8051156132be5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b508054600082559060005260206000209081019061258b91905b8082111561330557600081556001016132f1565b5090565b60006020828403121561331b57600080fd5b81356001600160e01b031981168114610c1957600080fd5b6000610120828403121561334657600080fd5b50919050565b60006020828403121561335e57600080fd5b81356001600160401b0381111561337457600080fd5b61338084828501613333565b949350505050565b6001600160a01b038116811461258b57600080fd5b6000602082840312156133af57600080fd5b8135610c1981613388565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156133f8576133f86133ba565b604052919050565b600082601f83011261341157600080fd5b81356001600160401b0381111561342a5761342a6133ba565b61343d601f8201601f19166020016133d0565b81815284602083860101111561345257600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561348557600080fd5b843561349081613388565b935060208501356134a081613388565b92506040850135915060608501356001600160401b038111156134c257600080fd5b6134ce87828801613400565b91505092959194509250565b60008083601f8401126134ec57600080fd5b5081356001600160401b0381111561350357600080fd5b60208301915083602082850101111561351b57600080fd5b9250929050565b60008060006040848603121561353757600080fd5b8335925060208401356001600160401b0381111561355457600080fd5b613560868287016134da565b9497909650939450505050565b60008060006060848603121561358257600080fd5b83356001600160401b0381111561359857600080fd5b6135a486828701613333565b9660208601359650604090950135949350505050565b6000602082840312156135cc57600080fd5b81356001600160c01b0381168114610c1957600080fd5b6000602082840312156135f557600080fd5b81356001600160401b0381111561360b57600080fd5b820160c08185031215610c1957600080fd5b60006020828403121561362f57600080fd5b5035919050565b6000806040838503121561364957600080fd5b823561365481613388565b915060208301356001600160401b0381111561366f57600080fd5b61367b85828601613400565b9150509250929050565b60006020828403121561369757600080fd5b81356001600160401b038111156136ad57600080fd5b820160608185031215610c1957600080fd5b60008083601f8401126136d157600080fd5b5081356001600160401b038111156136e857600080fd5b6020830191508360208260051b850101111561351b57600080fd5b60008060006040848603121561371857600080fd5b83356001600160401b0381111561372e57600080fd5b61373a868287016136bf565b909790965060209590950135949350505050565b801515811461258b57600080fd5b6000806000806060858703121561377257600080fd5b84356001600160401b0381111561378857600080fd5b613794878288016136bf565b9095509350506020850135915060408501356137af8161374e565b939692955090935050565b6000806000806000608086880312156137d257600080fd5b85356001600160401b0380821682146137ea57600080fd5b9095506020870135908082111561380057600080fd5b5061380d888289016136bf565b9095509350506040860135915060608601356138288161374e565b809150509295509295909350565b6000806040838503121561384957600080fd5b823561385481613388565b946020939093013593505050565b60005b8381101561387d578181015183820152602001613865565b50506000910152565b6000815180845261389e816020860160208601613862565b601f01601f19169290920160200192915050565b60ff60f81b881681526000602060e060208401526138d360e084018a613886565b83810360408501526138e5818a613886565b606085018990526001600160a01b038816608086015260a0850187905284810360c08601528551808252602080880193509091019060005b818110156139395783518352928401929184019160010161391d565b50909c9b505050505050505050505050565b6020808252825182820181905260009190848201906040850190845b8181101561398c5783516001600160a01b031683529284019291840191600101613967565b50909695505050505050565b602081526000610c196020830184613886565b600082601f8301126139bc57600080fd5b813560206001600160401b038211156139d7576139d76133ba565b8160051b6139e68282016133d0565b9283528481018201928281019087851115613a0057600080fd5b83870192505b84831015613a1f57823582529183019190830190613a06565b979650505050505050565b600080600080600060a08688031215613a4257600080fd5b8535613a4d81613388565b94506020860135613a5d81613388565b935060408601356001600160401b0380821115613a7957600080fd5b613a8589838a016139ab565b94506060880135915080821115613a9b57600080fd5b613aa789838a016139ab565b93506080880135915080821115613abd57600080fd5b50613aca88828901613400565b9150509295509295909350565b60008060008060008060608789031215613af057600080fd5b86356001600160401b0380821115613b0757600080fd5b613b138a838b016136bf565b90985096506020890135915080821115613b2c57600080fd5b613b388a838b016136bf565b90965094506040890135915080821115613b5157600080fd5b50613b5e89828a016136bf565b979a9699509497509295939492505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b82811015613bc757603f19888603018452613bb5858351613886565b94509285019290850190600101613b99565b5092979650505050505050565b60008060408385031215613be757600080fd5b8235613bf281613388565b91506020830135613c0281613388565b809150509250929050565b600080600080600060a08688031215613c2557600080fd5b8535613c3081613388565b94506020860135613c4081613388565b9350604086013592506060860135915060808601356001600160401b03811115613c6957600080fd5b613aca88828901613400565b634e487b7160e01b600052601160045260246000fd5b8181038181111561098757610987613c75565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b600060208284031215613cdc57600080fd5b5051919050565b6000808335601e19843603018112613cfa57600080fd5b83016020810192503590506001600160401b03811115613d1957600080fd5b80360382131561351b57600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60008383855260208086019550808560051b830101846000805b88811015613e0457858403601f19018a52823536899003605e19018112613d90578283fd5b880160608135613d9f81613388565b6001600160a01b03168652613db682880183613ce3565b8289890152613dc88389018284613d28565b925050506040613dda81840184613ce3565b935087830382890152613dee838583613d28565b9d89019d97505050938601935050600101613d6b565b509198975050505050505050565b6020815260008235613e2381613388565b6001600160a01b0390811660208481019190915284013590613e4482613388565b80821660408501525050604083013560608301526060830135601e19843603018112613e6f57600080fd5b83016020810190356001600160401b03811115613e8b57600080fd5b8060051b3603821315613e9d57600080fd5b60c06080850152613eb260e085018284613d51565b915050608084013560a0840152613ecc60a0850185613ce3565b848303601f190160c0860152613ee3838284613d28565b9695505050505050565b600060208284031215613eff57600080fd5b8151610c198161374e565b6000808335601e19843603018112613f2157600080fd5b8301803591506001600160401b03821115613f3b57600080fd5b60200191503681900382131561351b57600080fd5b6000838385526020808601955060208560051b8301018460005b87811015613fa457848303601f19018952613f858288613ce3565b613f90858284613d28565b9a86019a9450505090830190600101613f6a565b5090979650505050505050565b606081526000613fc560608301888a613f50565b8281036020848101919091528682528791810160005b88811015613ff757833582529282019290820190600101613fdb565b50848103604086015261400b818789613f50565b9b9a5050505050505050505050565b828152604060208201526000610c166040830184613886565b8183823760009101908152919050565b808202811582820484141761098757610987613c75565b60008261407757634e487b7160e01b600052601260045260246000fd5b500490565b8082018082111561098757610987613c75565b6000808585111561409f57600080fd5b838611156140ac57600080fd5b5050820193919092039150565b6000600182016140cb576140cb613c75565b5060010190565b60008235605e198336030181126140e857600080fd5b9190910192915050565b6bffffffffffffffffffffffff198135818116916014851015612b215760149490940360031b84901b1690921692915050565b8035602083101561098757600019602084900360031b1b1692915050565b600181811c9082168061415757607f821691505b60208210810361334657634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b600082516140e881846020870161386256feb005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c01b005e320c74f68de39b3d9025549122b8b117c48474f537aac49c12147b61c00360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbca26469706673582212205fc6fdc85503c31560366339056f5ba5c2624d0697f326aa98f14cda48fe6f7164736f6c63430008170033" as const;