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
    "stateMutability": "pure"
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
    "name": "beforeHookCallCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b50610263806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063d3eddcc51461008b578063e38ad59014610099578063ed4633671461005c575b600080fd5b61007661006a366004610139565b50505050505050505050565b005b610076610086366004610139565b6100b4565b610076610057366004610139565b6100a260005481565b60405190815260200160405180910390f35b6000805490806100c383610206565b919050555050505050505050505050565b60008083601f8401126100e657600080fd5b50813567ffffffffffffffff8111156100fe57600080fd5b60208301915083602082850101111561011657600080fd5b9250929050565b80356001600160a01b038116811461013457600080fd5b919050565b60008060008060008060008060008060e08b8d03121561015857600080fd5b8a3567ffffffffffffffff8082111561017057600080fd5b61017c8e838f016100d4565b909c509a5060208d013591508082111561019557600080fd5b6101a18e838f016100d4565b909a50985060408d0135975060608d01359150808211156101c157600080fd5b506101ce8d828e016100d4565b90965094505060808b013592506101e760a08c0161011d565b91506101f560c08c0161011d565b90509295989b9194979a5092959850565b60006001820161022657634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220bcf0049f14343021d3eb32b64d949a39aec074b673cc386de61163856ad518a964736f6c63430008170033" as const;