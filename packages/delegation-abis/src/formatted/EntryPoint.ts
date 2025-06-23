export const abi = [
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "addStake",
    "inputs": [
      {
        "name": "unstakeDelaySec",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
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
    "name": "delegateAndRevert",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositTo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "deposits",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "deposit",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "staked",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "stake",
        "type": "uint112",
        "internalType": "uint112"
      },
      {
        "name": "unstakeDelaySec",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "withdrawTime",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDepositInfo",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "info",
        "type": "tuple",
        "internalType": "struct IStakeManager.DepositInfo",
        "components": [
          {
            "name": "deposit",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "staked",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "stake",
            "type": "uint112",
            "internalType": "uint112"
          },
          {
            "name": "unstakeDelaySec",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "withdrawTime",
            "type": "uint48",
            "internalType": "uint48"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNonce",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [
      {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSenderAddress",
    "inputs": [
      {
        "name": "initCode",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getUserOpHash",
    "inputs": [
      {
        "name": "userOp",
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
    "name": "handleAggregatedOps",
    "inputs": [
      {
        "name": "opsPerAggregator",
        "type": "tuple[]",
        "internalType": "struct IEntryPoint.UserOpsPerAggregator[]",
        "components": [
          {
            "name": "userOps",
            "type": "tuple[]",
            "internalType": "struct PackedUserOperation[]",
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
            "name": "aggregator",
            "type": "address",
            "internalType": "contract IAggregator"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "beneficiary",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "handleOps",
    "inputs": [
      {
        "name": "ops",
        "type": "tuple[]",
        "internalType": "struct PackedUserOperation[]",
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
        "name": "beneficiary",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "incrementNonce",
    "inputs": [
      {
        "name": "key",
        "type": "uint192",
        "internalType": "uint192"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "innerHandleOp",
    "inputs": [
      {
        "name": "callData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "opInfo",
        "type": "tuple",
        "internalType": "struct EntryPoint.UserOpInfo",
        "components": [
          {
            "name": "mUserOp",
            "type": "tuple",
            "internalType": "struct EntryPoint.MemoryUserOp",
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
                "name": "verificationGasLimit",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "callGasLimit",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymasterVerificationGasLimit",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymasterPostOpGasLimit",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "preVerificationGas",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymaster",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "maxFeePerGas",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxPriorityFeePerGas",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "userOpHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "prefund",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "contextOffset",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "preOpGas",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "context",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "actualGasCost",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "nonceSequenceNumber",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
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
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
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
    "name": "unlockStake",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawStake",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawTo",
    "inputs": [
      {
        "name": "withdrawAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "withdrawAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AccountDeployed",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "factory",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "paymaster",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BeforeExecution",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Deposited",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalDeposit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostOpRevertReason",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "revertReason",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SignatureAggregatorChanged",
    "inputs": [
      {
        "name": "aggregator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeLocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalStaked",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "unstakeDelaySec",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeUnlocked",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StakeWithdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationEvent",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "paymaster",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "success",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "actualGasCost",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "actualGasUsed",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationPrefundTooLow",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserOperationRevertReason",
    "inputs": [
      {
        "name": "userOpHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "revertReason",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Withdrawn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "withdrawAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "DelegateAndRevert",
    "inputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "ret",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "FailedOp",
    "inputs": [
      {
        "name": "opIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "FailedOpWithRevert",
    "inputs": [
      {
        "name": "opIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "inner",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "PostOpReverted",
    "inputs": [
      {
        "name": "returnData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SenderAddressResult",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SignatureValidationFailed",
    "inputs": [
      {
        "name": "aggregator",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;


export const bytecode = "0x60a0604052604051620000129062000051565b604051809103905ff0801580156200002c573d5f803e3d5ffd5b506001600160a01b031660805234801562000045575f80fd5b5060016002556200005f565b6101ff806200374883390190565b6080516136c96200007f5f395f8181610de0015261271501526136c95ff3fe608060405260043610610107575f3560e01c806370a0823111610092578063b760faf911610062578063b760faf914610425578063bb9fe6bf14610438578063c23a5cea1461044c578063dbed18e01461046b578063fc7e286d1461048a575f80fd5b806370a0823114610394578063765e827f146103c8578063850aaf62146103e75780639b249f6914610406575f80fd5b80631b2e01b8116100d85780631b2e01b8146101ae578063205c2878146101e457806322cdde4c1461020357806335567e1a146102225780635287ce1214610280575f80fd5b806242dc531461011b57806301ffc9a71461014d5780630396cb601461017c5780630bd28e3b1461018f575f80fd5b366101175761011533610530565b005b5f80fd5b348015610126575f80fd5b5061013a610135366004612c4f565b610584565b6040519081526020015b60405180910390f35b348015610158575f80fd5b5061016c610167366004612d06565b610702565b6040519015158152602001610144565b61011561018a366004612d2d565b610789565b34801561019a575f80fd5b506101156101a9366004612d66565b610a14565b3480156101b9575f80fd5b5061013a6101c8366004612d7f565b600160209081525f928352604080842090915290825290205481565b3480156101ef575f80fd5b506101156101fe366004612db2565b610a4a565b34801561020e575f80fd5b5061013a61021d366004612ddc565b610b96565b34801561022d575f80fd5b5061013a61023c366004612d7f565b6001600160a01b0382165f9081526001602090815260408083206001600160c01b038516845290915290819020549082901b67ffffffffffffffff19161792915050565b34801561028b575f80fd5b5061033a61029a366004612e13565b6040805160a0810182525f80825260208201819052918101829052606081018290526080810191909152506001600160a01b03165f9081526020818152604091829020825160a0810184528154815260019091015460ff811615159282019290925261010082046001600160701b031692810192909252600160781b810463ffffffff166060830152600160981b900465ffffffffffff16608082015290565b60405161014491905f60a082019050825182526020830151151560208301526001600160701b03604084015116604083015263ffffffff606084015116606083015265ffffffffffff608084015116608083015292915050565b34801561039f575f80fd5b5061013a6103ae366004612e13565b6001600160a01b03165f9081526020819052604090205490565b3480156103d3575f80fd5b506101156103e2366004612e6e565b610bd7565b3480156103f2575f80fd5b50610115610401366004612ec0565b610d4c565b348015610411575f80fd5b50610115610420366004612f10565b610dc7565b610115610433366004612e13565b610530565b348015610443575f80fd5b50610115610e7e565b348015610457575f80fd5b50610115610466366004612e13565b610fa8565b348015610476575f80fd5b50610115610485366004612e6e565b6111c7565b348015610495575f80fd5b506104ed6104a4366004612e13565b5f602081905290815260409020805460019091015460ff81169061010081046001600160701b031690600160781b810463ffffffff1690600160981b900465ffffffffffff1685565b6040805195865293151560208601526001600160701b039092169284019290925263ffffffff909116606083015265ffffffffffff16608082015260a001610144565b5f61053b82346115ce565b9050816001600160a01b03167f2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c48260405161057891815260200190565b60405180910390a25050565b5f805a90503330146105dd5760405162461bcd60e51b815260206004820152601760248201527f4141393220696e7465726e616c2063616c6c206f6e6c7900000000000000000060448201526064015b60405180910390fd5b8451606081015160a082015181016127100160405a603f028161060257610602612f4e565b0410156106185763deaddead60e01b5f5260205ffd5b87515f90156106a6575f610631845f01515f8c86611600565b9050806106a4575f610644610800611616565b80519091501561069e57845f01516001600160a01b03168a602001517f1c4fada7374c0a9ee8841fc38afe82932dc0f8e69012e927f061a8bae611a201876020015184604051610695929190612faf565b60405180910390a35b60019250505b505b5f88608001515a86030190506106f4828a8a8a8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250879250611641915050565b9a9950505050505050505050565b5f6001600160e01b0319821663307e35b760e11b148061073257506001600160e01b0319821663122a0e9b60e31b145b8061074d57506001600160e01b0319821663cf28ef9760e01b145b8061076857506001600160e01b03198216633e84f02160e01b145b8061078357506301ffc9a760e01b6001600160e01b03198316145b92915050565b335f90815260208190526040902063ffffffff82166107ea5760405162461bcd60e51b815260206004820152601a60248201527f6d757374207370656369667920756e7374616b652064656c617900000000000060448201526064016105d4565b600181015463ffffffff600160781b9091048116908316101561084f5760405162461bcd60e51b815260206004820152601c60248201527f63616e6e6f7420646563726561736520756e7374616b652074696d650000000060448201526064016105d4565b60018101545f9061086f90349061010090046001600160701b0316612fdb565b90505f81116108b55760405162461bcd60e51b81526020600482015260126024820152711b9bc81cdd185ad9481cdc1958da599a595960721b60448201526064016105d4565b6001600160701b038111156108fd5760405162461bcd60e51b815260206004820152600e60248201526d7374616b65206f766572666c6f7760901b60448201526064016105d4565b6040805160a08101825283548152600160208083018281526001600160701b0386811685870190815263ffffffff8a8116606088018181525f60808a0181815233808352828a52918c90209a518b55965199909801805494519151965165ffffffffffff16600160981b0265ffffffffffff60981b1997909416600160781b029690961669ffffffffffffffffffff60781b1991909516610100026effffffffffffffffffffffffffff0019991515999099166effffffffffffffffffffffffffffff1990941693909317979097179190911691909117179055835185815290810192909252917fa5ae833d0bb1dcd632d98a8b70973e8516812898e19bf27b70071ebc8dc52c01910160405180910390a2505050565b335f9081526001602090815260408083206001600160c01b03851684529091528120805491610a4283612fee565b919050555050565b335f9081526020819052604090208054821115610aa95760405162461bcd60e51b815260206004820152601960248201527f576974686472617720616d6f756e7420746f6f206c617267650000000000000060448201526064016105d4565b8054610ab6908390613006565b8155604080516001600160a01b03851681526020810184905233917fd1c19fbcd4551a5edfb66d43d2e337c04837afda3482b42bdf569a8fccdae5fb910160405180910390a25f836001600160a01b0316836040515f6040518083038185875af1925050503d805f8114610b45576040519150601f19603f3d011682016040523d82523d5f602084013e610b4a565b606091505b5050905080610b905760405162461bcd60e51b81526020600482015260126024820152716661696c656420746f20776974686472617760701b60448201526064016105d4565b50505050565b5f610ba0826117f9565b6040805160208101929092523090820152466060820152608001604051602081830303815290604052805190602001209050919050565b610bdf611811565b815f816001600160401b03811115610bf957610bf9612a5a565b604051908082528060200260200182016040528015610c3257816020015b610c1f6129d0565b815260200190600190039081610c175790505b5090505f5b82811015610ca7575f828281518110610c5257610c52613019565b602002602001015190505f80610c8c848a8a87818110610c7457610c74613019565b9050602002810190610c86919061302d565b85611839565b91509150610c9c8483835f611a3b565b505050600101610c37565b506040515f907fbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972908290a15f5b83811015610d2f57610d2381888884818110610cf257610cf2613019565b9050602002810190610d04919061302d565b858481518110610d1657610d16613019565b6020026020010151611bd5565b90910190600101610cd4565b50610d3a8482611e83565b505050610d476001600255565b505050565b5f80846001600160a01b03168484604051610d6892919061304c565b5f60405180830381855af49150503d805f8114610da0576040519150601f19603f3d011682016040523d82523d5f602084013e610da5565b606091505b50915091508181604051632650415560e21b81526004016105d492919061305b565b604051632b870d1b60e11b81525f906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063570e1a3690610e17908690869060040161309d565b6020604051808303815f875af1158015610e33573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610e5791906130b0565b604051633653dc0360e11b81526001600160a01b03821660048201529091506024016105d4565b335f90815260208190526040812060018101549091600160781b90910463ffffffff169003610edc5760405162461bcd60e51b815260206004820152600a6024820152691b9bdd081cdd185ad95960b21b60448201526064016105d4565b600181015460ff16610f245760405162461bcd60e51b8152602060048201526011602482015270616c726561647920756e7374616b696e6760781b60448201526064016105d4565b60018101545f90610f4290600160781b900463ffffffff16426130cb565b60018301805460ff65ffffffffffff60981b011916600160981b65ffffffffffff841690810260ff19169190911790915560405190815290915033907ffa9b3c14cc825c412c9ed81b3ba365a5b459439403f18829e572ed53a4180f0a90602001610578565b335f908152602081905260409020600181015461010090046001600160701b03168061100d5760405162461bcd60e51b81526020600482015260146024820152734e6f207374616b6520746f20776974686472617760601b60448201526064016105d4565b6001820154600160981b900465ffffffffffff1661106d5760405162461bcd60e51b815260206004820152601d60248201527f6d7573742063616c6c20756e6c6f636b5374616b65282920666972737400000060448201526064016105d4565b600182015442600160981b90910465ffffffffffff1611156110d15760405162461bcd60e51b815260206004820152601b60248201527f5374616b65207769746864726177616c206973206e6f7420647565000000000060448201526064016105d4565b600182018054610100600160c81b0319169055604080516001600160a01b03851681526020810183905233917fb7c918e0e249f999e965cafeb6c664271b3f4317d296461500e71da39f0cbda3910160405180910390a25f836001600160a01b0316826040515f6040518083038185875af1925050503d805f8114611171576040519150601f19603f3d011682016040523d82523d5f602084013e611176565b606091505b5050905080610b905760405162461bcd60e51b815260206004820152601860248201527f6661696c656420746f207769746864726177207374616b65000000000000000060448201526064016105d4565b6111cf611811565b815f805b8281101561133657368686838181106111ee576111ee613019565b905060200281019061120091906130f1565b9050365f61120e8380613105565b90925090505f6112246040850160208601612e13565b90505f196001600160a01b0382160161127f5760405162461bcd60e51b815260206004820152601760248201527f4141393620696e76616c69642061676772656761746f7200000000000000000060448201526064016105d4565b6001600160a01b0381161561131a576001600160a01b038116632dd8113384846112ac604089018961314a565b6040518563ffffffff1660e01b81526004016112cb94939291906132ab565b5f6040518083038186803b1580156112e1575f80fd5b505afa9250505080156112f2575060015b61131a5760405163086a9f7560e41b81526001600160a01b03821660048201526024016105d4565b6113248287612fdb565b955050600190930192506111d3915050565b505f816001600160401b0381111561135057611350612a5a565b60405190808252806020026020018201604052801561138957816020015b6113766129d0565b81526020019060019003908161136e5790505b5090505f805b8481101561146057368888838181106113aa576113aa613019565b90506020028101906113bc91906130f1565b9050365f6113ca8380613105565b90925090505f6113e06040850160208601612e13565b9050815f5b8181101561144e575f89898151811061140057611400613019565b602002602001015190505f806114228b898987818110610c7457610c74613019565b9150915061143284838389611a3b565b8a61143c81612fee565b9b5050600190930192506113e5915050565b50506001909401935061138f92505050565b506040517fbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972905f90a1505f80805b8581101561158a57368989838181106114a9576114a9613019565b90506020028101906114bb91906130f1565b90506114cd6040820160208301612e13565b6001600160a01b03167f575ff3acadd5ab348fe1855e217e0f3678f8d767d7494c9f9fefbee2e17cca4d60405160405180910390a2365f61150e8380613105565b9092509050805f5b81811015611579576115588885858481811061153457611534613019565b9050602002810190611546919061302d565b8b8b81518110610d1657610d16613019565b6115629088612fdb565b96508761156e81612fee565b985050600101611516565b50506001909301925061148e915050565b506040515f907f575ff3acadd5ab348fe1855e217e0f3678f8d767d7494c9f9fefbee2e17cca4d908290a26115bf8682611e83565b5050505050610d476001600255565b6001600160a01b0382165f908152602081905260408120805482906115f4908590612fdb565b91829055509392505050565b5f805f845160208601878987f195945050505050565b60603d828111156116245750815b604051602082018101604052818152815f602083013e9392505050565b5f805a85519091505f908161165582611f78565b60e08301519091506001600160a01b038116611674578251935061172b565b8093505f8851111561172b57868202955060028a600281111561169957611699613325565b1461172b5760a0830151604051637c627b2160e01b81526001600160a01b03831691637c627b21916116d5908e908d908c908990600401613339565b5f604051808303815f88803b1580156116ec575f80fd5b5087f1935050505080156116fe575060015b61172b575f61170e610800611616565b905080604051632b5e552f60e21b81526004016105d49190613380565b5a60a0840151606085015160808c01519288039990990198019088038082111561175e576064600a828403020498909801975b505060408901518783029650868110156117b75760028b600281111561178657611786613325565b036117a8578096506117978a611fa9565b6117a38a5f898b611ff8565b6117eb565b63deadaa5160e01b5f5260205ffd5b8681036117c486826115ce565b505f808d60028111156117d9576117d9613325565b1490506117e88c828b8d611ff8565b50505b505050505050949350505050565b5f61180382612073565b805190602001209050919050565b600280540361183357604051633ee5aeb560e01b815260040160405180910390fd5b60028055565b5f805f5a845190915061184c8682612128565b61185586610b96565b6020860152604081015161012082015161010083015160a08401516080850151606086015160c0870151861717171717176effffffffffffffffffffffffffffff8111156118e55760405162461bcd60e51b815260206004820152601860248201527f41413934206761732076616c756573206f766572666c6f77000000000000000060448201526064016105d4565b5f6119138460c081015160a08201516080830151606084015160408501516101009095015194010101010290565b90506119228a8a8a8487612234565b9650611935845f015185602001516123c5565b61198b5789604051631101335b60e11b81526004016105d4918152604060208201819052601a908201527f4141323520696e76616c6964206163636f756e74206e6f6e6365000000000000606082015260800190565b825a860311156119e75789604051631101335b60e11b81526004016105d4918152604060208201819052601e908201527f41413236206f76657220766572696669636174696f6e4761734c696d69740000606082015260800190565b60e08401516060906001600160a01b031615611a0e57611a098b8b8b85612411565b975090505b604089018290528060608a015260a08a01355a870301896080018181525050505050505050935093915050565b5f80611a46856125c8565b91509150816001600160a01b0316836001600160a01b031614611aac5785604051631101335b60e11b81526004016105d49181526040602082018190526014908201527320a0991a1039b4b3b730ba3ab9329032b93937b960611b606082015260800190565b8015611b045785604051631101335b60e11b81526004016105d49181526040602082018190526017908201527f414132322065787069726564206f72206e6f7420647565000000000000000000606082015260800190565b5f611b0e856125c8565b925090506001600160a01b03811615611b6a5786604051631101335b60e11b81526004016105d49181526040602082018190526014908201527320a0999a1039b4b3b730ba3ab9329032b93937b960611b606082015260800190565b8115611bcc5786604051631101335b60e11b81526004016105d49181526040602082018190526021908201527f41413332207061796d61737465722065787069726564206f72206e6f742064756060820152606560f81b608082015260a00190565b50505050505050565b5f805a90505f611be6846060015190565b6040519091505f903682611bfd60608a018a61314a565b9150915060605f826003811115611c1357843591505b506372288ed160e01b6001600160e01b0319821601611cc0575f8b8b60200151604051602401611c44929190613392565b60408051601f198184030181529181526020820180516001600160e01b0316638dd7712f60e01b1790525190915030906242dc5390611c8b9084908f908d9060240161345d565b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050925050611d15565b306001600160a01b03166242dc5385858d8b604051602401611ce5949392919061349c565b604051602081830303815290604052915060e01b6020820180516001600160e01b03838183161783525050505091505b60205f8351602085015f305af195505f51985084604052505050505080611e79575f3d80602003611d4a5760205f803e5f5191505b5063deaddead60e01b8103611d9d5787604051631101335b60e11b81526004016105d4918152604060208201819052600f908201526e41413935206f7574206f662067617360881b606082015260800190565b63deadaa5160e01b8103611dec575f86608001515a611dbc9087613006565b611dc69190612fdb565b6040880151909150611dd788611fa9565b611de3885f8385611ff8565b9550611e779050565b855180516020808901519201516001600160a01b0390911691907ff62676f440ff169a3a9afdbf812e89e7f95975ee8e5c31214ffdef631c5f479290611e33610800611616565b604051611e41929190612faf565b60405180910390a35f86608001515a611e5a9087613006565b611e649190612fdb565b9050611e736002888684611641565b9550505b505b5050509392505050565b6001600160a01b038216611ed95760405162461bcd60e51b815260206004820152601860248201527f4141393020696e76616c69642062656e6566696369617279000000000000000060448201526064016105d4565b5f826001600160a01b0316826040515f6040518083038185875af1925050503d805f8114611f22576040519150601f19603f3d011682016040523d82523d5f602084013e611f27565b606091505b5050905080610d475760405162461bcd60e51b815260206004820152601f60248201527f41413931206661696c65642073656e6420746f2062656e65666963696172790060448201526064016105d4565b6101008101516101208201515f9190808203611f95575092915050565b611fa182488301612617565b949350505050565b80518051602080840151928101516040519081526001600160a01b0390921692917f67b4fa9642f42120bf031f3051d1824b0fe25627945b27b8a6a65d5761d5482e910160405180910390a350565b835160e081015181516020808801519301516040516001600160a01b039384169492909316927f49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f916120659189908990899093845291151560208401526040830152606082015260800190565b60405180910390a450505050565b6060813560208301355f61209261208d604087018761314a565b61262e565b90505f6120a561208d606088018861314a565b9050608086013560a087013560c08801355f6120c761208d60e08c018c61314a565b604080516001600160a01b039a909a1660208b015289810198909852606089019690965250608087019390935260a086019190915260c085015260e08401526101008084019190915281518084039091018152610120909201905292915050565b6121356020830183612e13565b6001600160a01b03168152602082810135908201526001600160801b036080808401358281166060850152811c604084015260a084013560c0808501919091528401359182166101008401521c610120820152365f61219760e085018561314a565b9092509050801561221a5760348110156121f35760405162461bcd60e51b815260206004820152601d60248201527f4141393320696e76616c6964207061796d6173746572416e644461746100000060448201526064016105d4565b6121fd8282612640565b60a086015260808501526001600160a01b031660e0840152610b90565b5f60e084018190526080840181905260a084015250505050565b825180515f9190612252888761224d60408b018b61314a565b6126a7565b60e08201515f6001600160a01b038216612293576001600160a01b0383165f9081526020819052604090205487811161228d5780880361228f565b5f5b9150505b60208801516040516306608bdf60e21b81526001600160a01b038516916319822f7c9189916122c9918e919087906004016134d2565b6020604051808303815f8887f193505050508015612304575060408051601f3d908101601f19168201909252612301918101906134f6565b60015b61232f5789612314610800611616565b6040516365c8fd4d60e01b81526004016105d492919061350d565b94506001600160a01b0382166123b8576001600160a01b0383165f9081526020819052604090208054808911156123b2578b604051631101335b60e11b81526004016105d49181526040602082018190526017908201527f41413231206469646e2774207061792070726566756e64000000000000000000606082015260800190565b88900390555b5050505095945050505050565b6001600160a01b0382165f90815260016020908152604080832084821c80855292528220805484916001600160401b03831691908561240383612fee565b909155501495945050505050565b60605f805a855160e08101516001600160a01b0381165f9081526020819052604090208054939450919290919087811015612498578a604051631101335b60e11b81526004016105d4918152604060208201819052601e908201527f41413331207061796d6173746572206465706f73697420746f6f206c6f770000606082015260800190565b878103825f01819055505f84608001519050836001600160a01b03166352b7512c828d8d602001518d6040518563ffffffff1660e01b81526004016124df939291906134d2565b5f604051808303815f8887f19350505050801561251d57506040513d5f823e601f3d908101601f1916820160405261251a9190810190613549565b60015b612548578b61252d610800611616565b6040516365c8fd4d60e01b81526004016105d49291906135c4565b9098509650805a870311156125b9578b604051631101335b60e11b81526004016105d49181526040602082018190526027908201527f41413336206f766572207061796d6173746572566572696669636174696f6e47606082015266185cd31a5b5a5d60ca1b608082015260a00190565b50505050505094509492505050565b5f80825f036125db57505f928392509050565b5f6125e584612961565b9050806040015165ffffffffffff1642118061260c5750806020015165ffffffffffff1642105b905194909350915050565b5f8183106126255781612627565b825b9392505050565b5f604051828085833790209392505050565b5f80806126506014828688613600565b61265991613627565b60601c61266a602460148789613600565b6126739161365c565b60801c61268460346024888a613600565b61268d9161365c565b9194506001600160801b0316925060801c90509250925092565b8015610b90578251516001600160a01b0381163b156127125784604051631101335b60e11b81526004016105d4918152604060208201819052601f908201527f414131302073656e64657220616c726561647920636f6e737472756374656400606082015260800190565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663570e1a36865f01516040015186866040518463ffffffff1660e01b815260040161276992919061309d565b6020604051808303815f8887f1158015612785573d5f803e3d5ffd5b50505050506040513d601f19601f820116820180604052508101906127aa91906130b0565b90506001600160a01b03811661280c5785604051631101335b60e11b81526004016105d4918152604060208201819052601b908201527f4141313320696e6974436f6465206661696c6564206f72204f4f470000000000606082015260800190565b816001600160a01b0316816001600160a01b0316146128765785604051631101335b60e11b81526004016105d491815260406020808301829052908201527f4141313420696e6974436f6465206d7573742072657475726e2073656e646572606082015260800190565b806001600160a01b03163b5f036128d85785604051631101335b60e11b81526004016105d491815260406020808301829052908201527f4141313520696e6974436f6465206d757374206372656174652073656e646572606082015260800190565b5f6128e66014828688613600565b6128ef91613627565b60601c9050826001600160a01b031686602001517fd51a9c61267aa6196961883ecf5ff2da6619c37dac0fa92122513fb32c032d2d83895f015160e001516040516129509291906001600160a01b0392831681529116602082015260400190565b60405180910390a350505050505050565b604080516060810182525f80825260208201819052918101919091528160a081901c65ffffffffffff81165f0361299b575065ffffffffffff5b604080516060810182526001600160a01b03909316835260d09490941c602083015265ffffffffffff16928101929092525090565b6040518060a00160405280612a396040518061014001604052805f6001600160a01b031681526020015f81526020015f81526020015f81526020015f81526020015f81526020015f81526020015f6001600160a01b031681526020015f81526020015f81525090565b81526020015f80191681526020015f81526020015f81526020015f81525090565b634e487b7160e01b5f52604160045260245ffd5b60405160a081016001600160401b0381118282101715612a9057612a90612a5a565b60405290565b60405161014081016001600160401b0381118282101715612a9057612a90612a5a565b604051601f8201601f191681016001600160401b0381118282101715612ae157612ae1612a5a565b604052919050565b5f6001600160401b03821115612b0157612b01612a5a565b50601f01601f191660200190565b6001600160a01b0381168114612b23575f80fd5b50565b8035612b3181612b0f565b919050565b5f8183036101c0811215612b48575f80fd5b612b50612a6e565b915061014080821215612b61575f80fd5b612b69612a96565b9150612b7484612b26565b82526020840135602083015260408401356040830152606084013560608301526080840135608083015260a084013560a083015260c084013560c0830152612bbe60e08501612b26565b60e0830152610100848101359083015261012080850135908301529082528201356020820152610160820135604082015261018082013560608201526101a0909101356080820152919050565b5f8083601f840112612c1b575f80fd5b5081356001600160401b03811115612c31575f80fd5b602083019150836020828501011115612c48575f80fd5b9250929050565b5f805f806102008587031215612c63575f80fd5b84356001600160401b0380821115612c79575f80fd5b818701915087601f830112612c8c575f80fd5b8135612c9f612c9a82612ae9565b612ab9565b818152896020838601011115612cb3575f80fd5b816020850160208301375f602083830101528097505050612cd78860208901612b36565b94506101e0870135915080821115612ced575f80fd5b50612cfa87828801612c0b565b95989497509550505050565b5f60208284031215612d16575f80fd5b81356001600160e01b031981168114612627575f80fd5b5f60208284031215612d3d575f80fd5b813563ffffffff81168114612627575f80fd5b80356001600160c01b0381168114612b31575f80fd5b5f60208284031215612d76575f80fd5b61262782612d50565b5f8060408385031215612d90575f80fd5b8235612d9b81612b0f565b9150612da960208401612d50565b90509250929050565b5f8060408385031215612dc3575f80fd5b8235612dce81612b0f565b946020939093013593505050565b5f60208284031215612dec575f80fd5b81356001600160401b03811115612e01575f80fd5b82016101208185031215612627575f80fd5b5f60208284031215612e23575f80fd5b813561262781612b0f565b5f8083601f840112612e3e575f80fd5b5081356001600160401b03811115612e54575f80fd5b6020830191508360208260051b8501011115612c48575f80fd5b5f805f60408486031215612e80575f80fd5b83356001600160401b03811115612e95575f80fd5b612ea186828701612e2e565b9094509250506020840135612eb581612b0f565b809150509250925092565b5f805f60408486031215612ed2575f80fd5b8335612edd81612b0f565b925060208401356001600160401b03811115612ef7575f80fd5b612f0386828701612c0b565b9497909650939450505050565b5f8060208385031215612f21575f80fd5b82356001600160401b03811115612f36575f80fd5b612f4285828601612c0b565b90969095509350505050565b634e487b7160e01b5f52601260045260245ffd5b5f5b83811015612f7c578181015183820152602001612f64565b50505f910152565b5f8151808452612f9b816020860160208601612f62565b601f01601f19169290920160200192915050565b828152604060208201525f611fa16040830184612f84565b634e487b7160e01b5f52601160045260245ffd5b8082018082111561078357610783612fc7565b5f60018201612fff57612fff612fc7565b5060010190565b8181038181111561078357610783612fc7565b634e487b7160e01b5f52603260045260245ffd5b5f823561011e19833603018112613042575f80fd5b9190910192915050565b818382375f9101908152919050565b8215158152604060208201525f611fa16040830184612f84565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b602081525f611fa1602083018486613075565b5f602082840312156130c0575f80fd5b815161262781612b0f565b65ffffffffffff8181168382160190808211156130ea576130ea612fc7565b5092915050565b5f8235605e19833603018112613042575f80fd5b5f808335601e1984360301811261311a575f80fd5b8301803591506001600160401b03821115613133575f80fd5b6020019150600581901b3603821315612c48575f80fd5b5f808335601e1984360301811261315f575f80fd5b8301803591506001600160401b03821115613178575f80fd5b602001915036819003821315612c48575f80fd5b5f808335601e198436030181126131a1575f80fd5b83016020810192503590506001600160401b038111156131bf575f80fd5b803603821315612c48575f80fd5b5f6101206131eb846131de85612b26565b6001600160a01b03169052565b60208301356020850152613202604084018461318c565b8260408701526132158387018284613075565b92505050613226606084018461318c565b8583036060870152613239838284613075565b925050506080830135608085015260a083013560a085015260c083013560c085015261326860e084018461318c565b85830360e087015261327b838284613075565b9250505061010061328e8185018561318c565b868403838801526132a0848284613075565b979650505050505050565b604080825281018490525f6060600586901b8301810190830187835b8881101561330f57858403605f190183528135368b900361011e190181126132ed575f80fd5b6132f9858c83016131cd565b94505060209283019291909101906001016132c7565b50505082810360208401526132a0818587613075565b634e487b7160e01b5f52602160045260245ffd5b5f6003861061335657634e487b7160e01b5f52602160045260245ffd5b8582526080602083015261336d6080830186612f84565b6040830194909452506060015292915050565b602081525f6126276020830184612f84565b604081525f6133a460408301856131cd565b90508260208301529392505050565b805180516001600160a01b031683526020810151602084015260408101516040840152606081015160608401526080810151608084015260a081015160a084015260c081015160c084015260e081015161341860e08501826001600160a01b03169052565b5061010081810151908401526101209081015190830152602081015161014083015260408101516101608301526060810151610180830152608001516101a090910152565b5f61020080835261347081840187612f84565b905061347f60208401866133b3565b8281036101e08401526134928185612f84565b9695505050505050565b5f6102008083526134b08184018789613075565b90506134bf60208401866133b3565b8281036101e08401526132a08185612f84565b606081525f6134e460608301866131cd565b60208301949094525060400152919050565b5f60208284031215613506575f80fd5b5051919050565b82815260606020820152600d60608201526c10504c8cc81c995d995c9d1959609a1b608082015260a060408201525f611fa160a0830184612f84565b5f806040838503121561355a575f80fd5b82516001600160401b0381111561356f575f80fd5b8301601f8101851361357f575f80fd5b805161358d612c9a82612ae9565b8181528660208385010111156135a1575f80fd5b6135b2826020830160208601612f62565b60209590950151949694955050505050565b82815260606020820152600d60608201526c10504cccc81c995d995c9d1959609a1b608082015260a060408201525f611fa160a0830184612f84565b5f808585111561360e575f80fd5b8386111561361a575f80fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156136545780818660140360031b1b83161692505b505092915050565b6fffffffffffffffffffffffffffffffff1981358181169160108510156136545760109490940360031b84901b169092169291505056fea2646970667358221220397996f36f516bad9951ba1f23ade372bdd0ef7639623362f57652a7762031c164736f6c63430008170033608060405234801561000f575f80fd5b506101e28061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063570e1a361461002d575b5f80fd5b61004061003b3660046100e4565b61005c565b6040516001600160a01b03909116815260200160405180910390f35b5f8061006b6014828587610150565b61007491610177565b60601c90505f6100878460148188610150565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92018290525084519495509360209350849250905082850182875af190505f519350806100db575f93505b50505092915050565b5f80602083850312156100f5575f80fd5b823567ffffffffffffffff8082111561010c575f80fd5b818501915085601f83011261011f575f80fd5b81358181111561012d575f80fd5b86602082850101111561013e575f80fd5b60209290920196919550909350505050565b5f808585111561015e575f80fd5b8386111561016a575f80fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156101a45780818660140360031b1b83161692505b50509291505056fea264697066735822122078c1aaa9f040f8c523cf2b642dd06415593eec30d2e75021458af7e0c704e6fb64736f6c63430008170033" as const;