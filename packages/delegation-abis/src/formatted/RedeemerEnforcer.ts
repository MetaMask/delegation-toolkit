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
        "name": "_redeemer",
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
        "name": "allowedRedeemers_",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "pure"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b5061064b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a3660046103ae565b50505050505050505050565b005b6100766100863660046103ae565b6100b4565b61009e61009936600461047b565b6101e8565b6040516100ab91906104bd565b60405180910390f35b85600881901b6100c5816000610332565b6101245760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b60648201526084015b60405180910390fd5b5060006101318c8c6101e8565b805190915060005b81811015610183578281815181106101535761015361050a565b60200260200101516001600160a01b0316856001600160a01b03160361017b575050506101db565b600101610139565b5060405162461bcd60e51b815260206004820152602660248201527f52656465656d6572456e666f726365723a756e617574686f72697a65642d72656044820152653232b2b6b2b960d11b606482015260840161011b565b5050505050505050505050565b606060008280158015906102045750610202601482610536565b155b61025e5760405162461bcd60e51b815260206004820152602560248201527f52656465656d6572456e666f726365723a696e76616c69642d7465726d732d6c6044820152640cadccee8d60db1b606482015260840161011b565b610269601482610560565b67ffffffffffffffff81111561028157610281610574565b6040519080825280602002602001820160405280156102aa578160200160208202803683370190505b50925060005b81811015610329578581866102c682601461058a565b926102d39392919061059d565b6102dc916105c7565b60601c8484815181106102f1576102f161050a565b6001600160a01b039092166020928302919091019091015282610313816105fc565b9350610322905060148261058a565b90506102b0565b50505092915050565b6001600160f81b0319828116908216145b92915050565b60008083601f84011261035b57600080fd5b50813567ffffffffffffffff81111561037357600080fd5b60208301915083602082850101111561038b57600080fd5b9250929050565b80356001600160a01b03811681146103a957600080fd5b919050565b60008060008060008060008060008060e08b8d0312156103cd57600080fd5b8a3567ffffffffffffffff808211156103e557600080fd5b6103f18e838f01610349565b909c509a5060208d013591508082111561040a57600080fd5b6104168e838f01610349565b909a50985060408d0135975060608d013591508082111561043657600080fd5b506104438d828e01610349565b90965094505060808b0135925061045c60a08c01610392565b915061046a60c08c01610392565b90509295989b9194979a5092959850565b6000806020838503121561048e57600080fd5b823567ffffffffffffffff8111156104a557600080fd5b6104b185828601610349565b90969095509350505050565b6020808252825182820181905260009190848201906040850190845b818110156104fe5783516001600160a01b0316835292840192918401916001016104d9565b50909695505050505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601260045260246000fd5b60008261054557610545610520565b500690565b634e487b7160e01b600052601160045260246000fd5b60008261056f5761056f610520565b500490565b634e487b7160e01b600052604160045260246000fd5b808201808211156103435761034361054a565b600080858511156105ad57600080fd5b838611156105ba57600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156105f45780818660140360031b1b83161692505b505092915050565b60006001820161060e5761060e61054a565b506001019056fea264697066735822122021c89a0ebcdb2523c453552212243b747d81b7c16f2f3e22d20bb9692240f3a364736f6c63430008170033" as const;