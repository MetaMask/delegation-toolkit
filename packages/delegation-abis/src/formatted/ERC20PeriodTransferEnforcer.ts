export const abi = [
  {
    "type": "function",
    "name": "afterAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeAllHook",
    "inputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeHook",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_mode",
        "type": "bytes32",
        "internalType": "ModeCode"
      },
      {
        "name": "_executionCallData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_redeemer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAvailableAmount",
    "inputs": [
      {
        "name": "_delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "availableAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isNewPeriod_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "currentPeriod_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTermsInfo",
    "inputs": [
      {
        "name": "_terms",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "periodAmount_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodDuration_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startDate_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "periodicAllowances",
    "inputs": [
      {
        "name": "delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "periodAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "periodDuration",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startDate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "lastTransferPeriod",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "transferredInCurrentPeriod",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "TransferredInPeriod",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "redeemer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegationHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "periodAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "periodDuration",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startDate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "transferredInCurrentPeriod",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "transferTimestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b50610d12806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063a145832a1161005b578063a145832a1461013e578063b99deb0e14610151578063d3eddcc514610082578063ed4633671461008257600080fd5b8063414c3e33146100825780636a9843f61461009e5780637b91dc78146100d1575b600080fd5b61009c610090366004610a20565b50505050505050505050565b005b6100b16100ac366004610aed565b61018e565b604080519384529115156020840152908201526060015b60405180910390f35b6101166100df366004610b47565b6000602081815292815260408082209093529081522080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100c8565b61009c61014c366004610a20565b610265565b61016461015f366004610b71565b61034a565b604080516001600160a01b03909516855260208501939093529183015260608201526080016100c8565b6001600160a01b0383166000908152602081815260408083208784528252808320815160a081018352815481526001820154938101939093526002810154918301829052600381015460608401526004015460808301528291829115610203576101f781610416565b9350935093505061025b565b6000806000610212898961034a565b9350935093505060006040518060a00160405280858152602001848152602001838152602001600081526020016000815250905061024f81610416565b97509750975050505050505b9450945094915050565b856102718160006104aa565b6102c25760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6102d38160006104aa565b61032d5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016102b9565b5061033c8c8c898989886104c1565b505050505050505050505050565b6000808080607485146103a65760405162461bcd60e51b81526020600482015260306024820152600080516020610cbd83398151915260448201526f0d8d2c85ae8cae4dae65ad8cadccee8d60831b60648201526084016102b9565b6103b4601460008789610bb3565b6103bd91610bdd565b60601c93506103d0603460148789610bb3565b6103d991610c12565b92506103e9605460348789610bb3565b6103f291610c12565b9150610402607460548789610bb3565b61040b91610c12565b939692955090935050565b60008060008360400151421015610435575060009150819050806104a3565b602084015160408501516104499042610c46565b6104539190610c59565b61045e906001610c7b565b90508084606001511415915060008261047b57846080015161047e565b60005b90508085600001511161049257600061049f565b845161049f908290610c46565b9350505b9193909250565b6001600160f81b0319828116908216145b92915050565b60003660006104d0878761096a565b929550935090915050604481146105345760405162461bcd60e51b81526020600482015260346024820152600080516020610cbd8339815191526044820152730d8d2c85acaf0cac6eae8d2dedc5ad8cadccee8d60631b60648201526084016102b9565b6000806000806105448d8d61034a565b9350935093509350866001600160a01b0316846001600160a01b0316146105b05760405162461bcd60e51b815260206004820152602c6024820152600080516020610cbd83398151915260448201526b1b1a590b58dbdb9d1c9858dd60a21b60648201526084016102b9565b63a9059cbb60e01b6105c660046000888a610bb3565b6105cf91610c8e565b6001600160e01b031916146106275760405162461bcd60e51b815260206004820152602a6024820152600080516020610cbd8339815191526044820152691b1a590b5b595d1a1bd960b21b60648201526084016102b9565b336000908152602081815260408083208c8452909152812060028101549091036107e157600082116106a55760405162461bcd60e51b81526020600482015260336024820152600080516020610cbd8339815191526044820152726c69642d7a65726f2d73746172742d6461746560681b60648201526084016102b9565b600084116107025760405162461bcd60e51b81526020600482015260366024820152600080516020610cbd8339815191526044820152751b1a590b5e995c9bcb5c195c9a5bd90b585b5bdd5b9d60521b60648201526084016102b9565b600083116107665760405162461bcd60e51b81526020600482015260386024820152600080516020610cbd83398151915260448201527f6c69642d7a65726f2d706572696f642d6475726174696f6e000000000000000060648201526084016102b9565b814210156107cf5760405162461bcd60e51b815260206004820152603060248201527f4552433230506572696f645472616e73666572456e666f726365723a7472616e60448201526f1cd9995c8b5b9bdd0b5cdd185c9d195960821b60648201526084016102b9565b83815560018101839055600281018290555b600080600061082c846040518060a001604052908160008201548152602001600182015481526020016002820154815260200160038201548152602001600482015481525050610416565b919450925090506000610843604460248c8e610bb3565b61084c91610c12565b9050838111156108bb5760405162461bcd60e51b815260206004820152603460248201527f4552433230506572696f645472616e73666572456e666f726365723a7472616e6044820152731cd9995c8b585b5bdd5b9d0b595e18d95959195960621b60648201526084016102b9565b82156108d05760038501829055600060048601555b808560040160008282546108e49190610c7b565b90915550506004850154604080516001600160a01b038c81168252602082018c90529181018a90526060810189905260808101929092524260a08301528f91908f169033907fb2a345c7f80b4be490c405f4a994faf85384dd05da7d70be0801dc31a8c253af9060c00160405180910390a4505050505050505050505050505050505050565b600080368161097c6014828789610bb3565b61098591610bdd565b60601c9350610998603460148789610bb3565b6109a191610c12565b92506109b08560348189610bb3565b949793965094505050565b60008083601f8401126109cd57600080fd5b50813567ffffffffffffffff8111156109e557600080fd5b6020830191508360208285010111156109fd57600080fd5b9250929050565b80356001600160a01b0381168114610a1b57600080fd5b919050565b60008060008060008060008060008060e08b8d031215610a3f57600080fd5b8a3567ffffffffffffffff80821115610a5757600080fd5b610a638e838f016109bb565b909c509a5060208d0135915080821115610a7c57600080fd5b610a888e838f016109bb565b909a50985060408d0135975060608d0135915080821115610aa857600080fd5b50610ab58d828e016109bb565b90965094505060808b01359250610ace60a08c01610a04565b9150610adc60c08c01610a04565b90509295989b9194979a5092959850565b60008060008060608587031215610b0357600080fd5b84359350610b1360208601610a04565b9250604085013567ffffffffffffffff811115610b2f57600080fd5b610b3b878288016109bb565b95989497509550505050565b60008060408385031215610b5a57600080fd5b610b6383610a04565b946020939093013593505050565b60008060208385031215610b8457600080fd5b823567ffffffffffffffff811115610b9b57600080fd5b610ba7858286016109bb565b90969095509350505050565b60008085851115610bc357600080fd5b83861115610bd057600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff198135818116916014851015610c0a5780818660140360031b1b83161692505b505092915050565b803560208310156104bb57600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b818103818111156104bb576104bb610c30565b600082610c7657634e487b7160e01b600052601260045260246000fd5b500490565b808201808211156104bb576104bb610c30565b6001600160e01b03198135818116916004851015610c0a5760049490940360031b84901b169092169291505056fe4552433230506572696f645472616e73666572456e666f726365723a696e7661a264697066735822122078259b929dc2fea71614ebe238bd74e88ff3ea3542e0d11a18122c300122d3f664736f6c63430008170033" as const;