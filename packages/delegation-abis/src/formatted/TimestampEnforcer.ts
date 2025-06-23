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
        "name": "timestampAfterThreshold_",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "timestampBeforeThreshold_",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "stateMutability": "pure"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b506104e7806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a36600461033f565b50505050505050505050565b005b61007661008636600461033f565b6100c2565b61009e61009936600461040c565b61023a565b604080516001600160801b0393841681529290911660208301520160405180910390f35b85600881901b6001600160f81b03198116156101335760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b506000806101418d8d61023a565b90925090506001600160801b038216156101b857816001600160801b031642116101b85760405162461bcd60e51b815260206004820152602260248201527f54696d657374616d70456e666f726365723a6561726c792d64656c656761746960448201526137b760f11b606482015260840161012a565b6001600160801b0381161561022b57806001600160801b0316421061022b5760405162461bcd60e51b8152602060048201526024808201527f54696d657374616d70456e666f726365723a657870697265642d64656c6567616044820152633a34b7b760e11b606482015260840161012a565b50505050505050505050505050565b6000806020831461029c5760405162461bcd60e51b815260206004820152602660248201527f54696d657374616d70456e666f726365723a696e76616c69642d7465726d732d6044820152650d8cadccee8d60d31b606482015260840161012a565b6102a9836010818761044e565b6102b291610478565b60801c90506102c560106000858761044e565b6102ce91610478565b60801c91509250929050565b60008083601f8401126102ec57600080fd5b50813567ffffffffffffffff81111561030457600080fd5b60208301915083602082850101111561031c57600080fd5b9250929050565b80356001600160a01b038116811461033a57600080fd5b919050565b60008060008060008060008060008060e08b8d03121561035e57600080fd5b8a3567ffffffffffffffff8082111561037657600080fd5b6103828e838f016102da565b909c509a5060208d013591508082111561039b57600080fd5b6103a78e838f016102da565b909a50985060408d0135975060608d01359150808211156103c757600080fd5b506103d48d828e016102da565b90965094505060808b013592506103ed60a08c01610323565b91506103fb60c08c01610323565b90509295989b9194979a5092959850565b6000806020838503121561041f57600080fd5b823567ffffffffffffffff81111561043657600080fd5b610442858286016102da565b90969095509350505050565b6000808585111561045e57600080fd5b8386111561046b57600080fd5b5050820193919092039150565b6fffffffffffffffffffffffffffffffff1981358181169160108510156104a95780818660100360031b1b83161692505b50509291505056fea2646970667358221220493f1dd46bf21857fc13b6e41e6f29c1c53fbb939ca84fcd1536c7cf1000d18064736f6c63430008170033" as const;