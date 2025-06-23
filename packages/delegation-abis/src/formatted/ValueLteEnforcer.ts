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
        "name": "value_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "pure"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b506104f8806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a366004610336565b50505050505050505050565b005b610076610086366004610336565b6100b0565b61009e610099366004610403565b6101f8565b60405190815260200160405180910390f35b856100bc816000610269565b61010d5760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b61011e816000610269565b6101785760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610104565b5060006101858888610280565b505091505060006101968e8e6101f8565b9050808211156101e85760405162461bcd60e51b815260206004820152601f60248201527f56616c75654c7465456e666f726365723a76616c75652d746f6f2d68696768006044820152606401610104565b5050505050505050505050505050565b6000602082146102585760405162461bcd60e51b815260206004820152602560248201527f56616c75654c7465456e666f726365723a696e76616c69642d7465726d732d6c6044820152640cadccee8d60db1b6064820152608401610104565b6102628284610445565b9392505050565b6001600160f81b0319828116908216145b92915050565b60008036816102926014828789610463565b61029b9161048d565b60601c93506102ae603460148789610463565b6102b791610445565b92506102c68560348189610463565b949793965094505050565b60008083601f8401126102e357600080fd5b50813567ffffffffffffffff8111156102fb57600080fd5b60208301915083602082850101111561031357600080fd5b9250929050565b80356001600160a01b038116811461033157600080fd5b919050565b60008060008060008060008060008060e08b8d03121561035557600080fd5b8a3567ffffffffffffffff8082111561036d57600080fd5b6103798e838f016102d1565b909c509a5060208d013591508082111561039257600080fd5b61039e8e838f016102d1565b909a50985060408d0135975060608d01359150808211156103be57600080fd5b506103cb8d828e016102d1565b90965094505060808b013592506103e460a08c0161031a565b91506103f260c08c0161031a565b90509295989b9194979a5092959850565b6000806020838503121561041657600080fd5b823567ffffffffffffffff81111561042d57600080fd5b610439858286016102d1565b90969095509350505050565b8035602083101561027a57600019602084900360031b1b1692915050565b6000808585111561047357600080fd5b8386111561048057600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156104ba5780818660140360031b1b83161692505b50509291505056fea26469706673582212201b32f956e1bfeecade9436bbfc83066c0610b5679c49ae7d06d58eaeb4e24ff564736f6c63430008170033" as const;