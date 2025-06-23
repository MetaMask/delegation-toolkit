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
        "name": "_args",
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
    "type": "event",
    "name": "DifferentArgsAndTerms",
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
        "name": "terms",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      },
      {
        "name": "args",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b506103b7806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063414c3e3314610051578063a145832a1461006d578063d3eddcc514610051578063ed46336714610051575b600080fd5b61006b61005f366004610249565b50505050505050505050565b005b61006b61007b366004610249565b85600881901b6001600160f81b03198116156100ec5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5088886040516100fd929190610316565b60405180910390208b8b604051610115929190610316565b6040518091039020146101d75783826001600160a01b0316336001600160a01b03167f07fc5f2898fc1f1cf9d6012177b7abb8d010b9e64055979af3a5bcd274e2a11a8e8e8e8e60405161016c949392919061034f565b60405180910390a460405162461bcd60e51b815260206004820152603260248201527f41726773457175616c697479436865636b456e666f726365723a646966666572604482015271656e742d617267732d616e642d7465726d7360701b60648201526084016100e3565b5050505050505050505050565b60008083601f8401126101f657600080fd5b50813567ffffffffffffffff81111561020e57600080fd5b60208301915083602082850101111561022657600080fd5b9250929050565b80356001600160a01b038116811461024457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561026857600080fd5b8a3567ffffffffffffffff8082111561028057600080fd5b61028c8e838f016101e4565b909c509a5060208d01359150808211156102a557600080fd5b6102b18e838f016101e4565b909a50985060408d0135975060608d01359150808211156102d157600080fd5b506102de8d828e016101e4565b90965094505060808b013592506102f760a08c0161022d565b915061030560c08c0161022d565b90509295989b9194979a5092959850565b8183823760009101908152919050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b604081526000610363604083018688610326565b8281036020840152610376818587610326565b97965050505050505056fea264697066735822122078e67ed2011e86335117ad2962f5a7ffbe2179a19bda7b4e0f3c3beff2ca893c64736f6c63430008170033" as const;