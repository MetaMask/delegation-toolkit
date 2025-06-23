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
    "name": "computeAddress",
    "inputs": [
      {
        "name": "_bytecodeHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "addr_",
        "type": "address",
        "internalType": "address"
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
        "name": "expectedAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt_",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "bytecode_",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "DeployedContract",
    "inputs": [
      {
        "name": "contractAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SkippedDeployment",
    "inputs": [
      {
        "name": "contractAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "Create2EmptyBytecode",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2FailedDeployment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Create2InsufficientBalance",
    "inputs": [
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "DeployedEmptyContract",
    "inputs": [
      {
        "name": "contractAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b50610748806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063414c3e3314610067578063481286e614610083578063a145832a146100b3578063b99deb0e146100c6578063d3eddcc514610067578063ed46336714610067575b600080fd5b6100816100753660046104fe565b50505050505050505050565b005b6100966100913660046105cb565b6100e8565b6040516001600160a01b0390911681526020015b60405180910390f35b6100816100c13660046104fe565b6100fd565b6100d96100d43660046105ed565b61026d565b6040516100aa9392919061062f565b60006100f48284610353565b90505b92915050565b85600881901b6001600160f81b031981161561016e5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b50600080600061017e8e8e61026d565b919450925090506001600160a01b0383163b156101d9576040516001600160a01b03841681527f641dafeb23238fae3ef71c64fced975da90c34dede63890507f3dda6b1e0dfef9060200160405180910390a1505050610260565b60006101e58284610360565b9050836001600160a01b0316816001600160a01b03161461025b5760405162461bcd60e51b815260206004820152602a60248201527f4465706c6f796564456e666f726365723a6465706c6f7965642d6164647265736044820152690e65adad2e6dac2e8c6d60b31b6064820152608401610165565b505050505b5050505050505050505050565b6000806060603484116102d05760405162461bcd60e51b815260206004820152602560248201527f4465706c6f796564456e666f726365723a696e76616c69642d7465726d732d6c6044820152640cadccee8d60db1b6064820152608401610165565b6102de601460008688610695565b6102e7916106bf565b60601c92506102fa603460148688610695565b610303916106f4565b91506103128460348188610695565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509598949750919550929350505050565b60006100f48383306103e8565b600061036e60008385610412565b9050806001600160a01b03163b6000036103a6576040516352c7cd4960e11b81526001600160a01b0382166004820152602401610165565b6040516001600160a01b03821681527faf3c4b03f515b5a38f3c238fdc24abf10854a2f27f2a85743a71de17e9bc7e7f9060200160405180910390a192915050565b6000604051836040820152846020820152828152600b8101905060ff815360559020949350505050565b60008347101561043e5760405163392efb2b60e21b815247600482015260248101859052604401610165565b815160000361046057604051631328927760e21b815260040160405180910390fd5b8282516020840186f590506001600160a01b03811661049257604051633a0ba96160e11b815260040160405180910390fd5b9392505050565b60008083601f8401126104ab57600080fd5b50813567ffffffffffffffff8111156104c357600080fd5b6020830191508360208285010111156104db57600080fd5b9250929050565b80356001600160a01b03811681146104f957600080fd5b919050565b60008060008060008060008060008060e08b8d03121561051d57600080fd5b8a3567ffffffffffffffff8082111561053557600080fd5b6105418e838f01610499565b909c509a5060208d013591508082111561055a57600080fd5b6105668e838f01610499565b909a50985060408d0135975060608d013591508082111561058657600080fd5b506105938d828e01610499565b90965094505060808b013592506105ac60a08c016104e2565b91506105ba60c08c016104e2565b90509295989b9194979a5092959850565b600080604083850312156105de57600080fd5b50508035926020909101359150565b6000806020838503121561060057600080fd5b823567ffffffffffffffff81111561061757600080fd5b61062385828601610499565b90969095509350505050565b60018060a01b03841681526000602084602084015260606040840152835180606085015260005b8181101561067257858101830151858201608001528201610656565b506000608082860101526080601f19601f83011685010192505050949350505050565b600080858511156106a557600080fd5b838611156106b257600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156106ec5780818660140360031b1b83161692505b505092915050565b803560208310156100f757600019602084900360031b1b169291505056fea264697066735822122012632a27b82f8f9b4b083a1f26c705dcd1ceb840e52519ff7902232eb956870464736f6c63430008170033" as const;