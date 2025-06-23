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
        "name": "_delegator",
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
    "name": "getIsUsed",
    "inputs": [
      {
        "name": "_delegationManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_delegator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_id",
        "type": "uint256",
        "internalType": "uint256"
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
        "name": "id_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "UsedId",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "delegator",
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
        "name": "id",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b50610518806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e3314610067578063595dce4814610083578063a145832a146100ab578063b99deb0e146100be578063d3eddcc514610067578063ed46336714610067575b600080fd5b610081610075366004610379565b50505050505050505050565b005b610096610091366004610446565b6100df565b60405190151581526020015b60405180910390f35b6100816100b9366004610379565b610116565b6100d16100cc366004610482565b61028c565b6040519081526020016100a2565b6001600160a01b03808416600090815260208181526040808320938616835292905290812061010e90836102ef565b949350505050565b85600881901b6001600160f81b03198116156101875760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060006101948c8c61028c565b90506101a13385836100df565b156101ee5760405162461bcd60e51b815260206004820152601a60248201527f4964456e666f726365723a69642d616c72656164792d75736564000000000000604482015260640161017e565b336000908152602081815260408083206001600160a01b03881684528252808320600885901c845290915290208054600160ff84161b179055826001600160a01b0316846001600160a01b0316336001600160a01b03167f6286af1aaf28b34723a53056e5608eabb40c823d1ce093ff371cf08c502431d68460405161027691815260200190565b60405180910390a4505050505050505050505050565b6000602082146102de5760405162461bcd60e51b815260206004820152601f60248201527f4964456e666f726365723a696e76616c69642d7465726d732d6c656e67746800604482015260640161017e565b6102e882846104c4565b9392505050565b600881901c600090815260208390526040902054600160ff83161b1615155b92915050565b60008083601f84011261032657600080fd5b50813567ffffffffffffffff81111561033e57600080fd5b60208301915083602082850101111561035657600080fd5b9250929050565b80356001600160a01b038116811461037457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561039857600080fd5b8a3567ffffffffffffffff808211156103b057600080fd5b6103bc8e838f01610314565b909c509a5060208d01359150808211156103d557600080fd5b6103e18e838f01610314565b909a50985060408d0135975060608d013591508082111561040157600080fd5b5061040e8d828e01610314565b90965094505060808b0135925061042760a08c0161035d565b915061043560c08c0161035d565b90509295989b9194979a5092959850565b60008060006060848603121561045b57600080fd5b6104648461035d565b92506104726020850161035d565b9150604084013590509250925092565b6000806020838503121561049557600080fd5b823567ffffffffffffffff8111156104ac57600080fd5b6104b885828601610314565b90969095509350505050565b8035602083101561030e57600019602084900360031b1b169291505056fea26469706673582212204a96dd3b9054d6055c3a36da342d1ecb848915fb596c41cf0571e73299243bf864736f6c63430008170033" as const;