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


export const bytecode = "0x608060405234801561001057600080fd5b50610b57806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063a145832a1161005b578063a145832a1461013e578063b99deb0e14610151578063d3eddcc514610082578063ed4633671461008257600080fd5b8063414c3e33146100825780636a9843f61461009e5780637b91dc78146100d1575b600080fd5b61009c610090366004610893565b50505050505050505050565b005b6100b16100ac366004610960565b61017f565b604080519384529115156020840152908201526060015b60405180910390f35b6101166100df3660046109ba565b6000602081815292815260408082209093529081522080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016100c8565b61009c61014c366004610893565b610255565b61016461015f3660046109e4565b61033a565b604080519384526020840192909252908201526060016100c8565b6001600160a01b0383166000908152602081815260408083208784528252808320815160a0810183528154815260018201549381019390935260028101549183018290526003810154606084015260040154608083015282918291156101f4576101e8816103f0565b9350935093505061024b565b6000806000610203898961033a565b92509250925060006040518060a00160405280858152602001848152602001838152602001600081526020016000815250905061023f816103f0565b97509750975050505050505b9450945094915050565b85610261816000610484565b6102b25760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6102c3816000610484565b61031d5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084016102a9565b5061032c8c8c8989898861049b565b505050505050505050505050565b600080806060841461039b5760405162461bcd60e51b81526020600482015260366024820152600080516020610b028339815191526044820152750e474d2dcecc2d8d2c85ae8cae4dae65ad8cadccee8d60531b60648201526084016102a9565b6103a9602060008688610a26565b6103b291610a50565b92506103c2604060208688610a26565b6103cb91610a50565b91506103db606060408688610a26565b6103e491610a50565b60001c90509250925092565b6000806000836040015142101561040f5750600091508190508061047d565b602084015160408501516104239042610a84565b61042d9190610a97565b610438906001610ab9565b905080846060015114159150600082610455578460800151610458565b60005b90508085600001511161046c576000610479565b8451610479908290610a84565b9350505b9193909250565b6001600160f81b0319828116908216145b92915050565b60006104a785856107dd565b505091505060008060006104bb8a8a61033a565b336000908152602081815260408083208c84529091528120600281015494975092955090935090919003610684576000821161054d5760405162461bcd60e51b81526020600482015260396024820152600080516020610b0283398151915260448201527f723a696e76616c69642d7a65726f2d73746172742d646174650000000000000060648201526084016102a9565b600084116105b15760405162461bcd60e51b815260206004820152603c6024820152600080516020610b0283398151915260448201527f723a696e76616c69642d7a65726f2d706572696f642d616d6f756e740000000060648201526084016102a9565b600083116106155760405162461bcd60e51b815260206004820152603e6024820152600080516020610b0283398151915260448201527f723a696e76616c69642d7a65726f2d706572696f642d6475726174696f6e000060648201526084016102a9565b814210156106725760405162461bcd60e51b81526020600482015260366024820152600080516020610b028339815191526044820152751c8e9d1c985b9cd9995c8b5b9bdd0b5cdd185c9d195960521b60648201526084016102a9565b83815560018101839055600281018290555b60008060006106cf846040518060a0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820154815250506103f0565b925092509250828811156107395760405162461bcd60e51b815260206004820152603a6024820152600080516020610b0283398151915260448201527f723a7472616e736665722d616d6f756e742d657863656564656400000000000060648201526084016102a9565b811561074e5760038401819055600060048501555b878460040160008282546107629190610ab9565b909155505060028401546004850154604080518a8152602081018a90529081019290925260608201524260808201528a906001600160a01b038b169033907f22e1bbd8bc0380d336958afc37cd8cb128d6c43891ed276162c30e8df467734d9060a00160405180910390a45050505050505050505050505050565b60008036816107ef6014828789610a26565b6107f891610acc565b60601c935061080b603460148789610a26565b61081491610a50565b92506108238560348189610a26565b949793965094505050565b60008083601f84011261084057600080fd5b50813567ffffffffffffffff81111561085857600080fd5b60208301915083602082850101111561087057600080fd5b9250929050565b80356001600160a01b038116811461088e57600080fd5b919050565b60008060008060008060008060008060e08b8d0312156108b257600080fd5b8a3567ffffffffffffffff808211156108ca57600080fd5b6108d68e838f0161082e565b909c509a5060208d01359150808211156108ef57600080fd5b6108fb8e838f0161082e565b909a50985060408d0135975060608d013591508082111561091b57600080fd5b506109288d828e0161082e565b90965094505060808b0135925061094160a08c01610877565b915061094f60c08c01610877565b90509295989b9194979a5092959850565b6000806000806060858703121561097657600080fd5b8435935061098660208601610877565b9250604085013567ffffffffffffffff8111156109a257600080fd5b6109ae8782880161082e565b95989497509550505050565b600080604083850312156109cd57600080fd5b6109d683610877565b946020939093013593505050565b600080602083850312156109f757600080fd5b823567ffffffffffffffff811115610a0e57600080fd5b610a1a8582860161082e565b90969095509350505050565b60008085851115610a3657600080fd5b83861115610a4357600080fd5b5050820193919092039150565b8035602083101561049557600019602084900360031b1b1692915050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561049557610495610a6e565b600082610ab457634e487b7160e01b600052601260045260246000fd5b500490565b8082018082111561049557610495610a6e565b6bffffffffffffffffffffffff198135818116916014851015610af95780818660140360031b1b83161692505b50509291505056fe4e6174697665546f6b656e506572696f645472616e73666572456e666f726365a2646970667358221220ddbfb33bfc3119eae666e9c14c2e492d38eed690114f0ed176d6eb49d0bc21a364736f6c63430008170033" as const;