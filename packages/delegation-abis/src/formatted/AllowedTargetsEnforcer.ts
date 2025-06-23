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
        "name": "allowedTargets_",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "pure"
  }
] as const;


export const bytecode = "0x608060405234801561001057600080fd5b50610736806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063414c3e331461005c578063a145832a14610078578063b99deb0e1461008b578063d3eddcc51461005c578063ed4633671461005c575b600080fd5b61007661006a36600461047b565b50505050505050505050565b005b61007661008636600461047b565b6100b4565b61009e610099366004610548565b61025e565b6040516100ab919061058a565b60405180910390f35b856100c08160006103ae565b6101115760405162461bcd60e51b815260206004820181905260248201527f436176656174456e666f726365723a696e76616c69642d63616c6c2d7479706560448201526064015b60405180910390fd5b86600881901b6101228160006103ae565b61017c5760405162461bcd60e51b815260206004820152602560248201527f436176656174456e666f726365723a696e76616c69642d657865637574696f6e6044820152642d7479706560d81b6064820152608401610108565b50600061018988886103c5565b5050509050600061019a8e8e61025e565b805190915060005b818110156101ed578281815181106101bc576101bc6105d7565b60200260200101516001600160a01b0316846001600160a01b0316036101e55750505050610250565b6001016101a2565b5060405162461bcd60e51b815260206004820152603160248201527f416c6c6f77656454617267657473456e666f726365723a7461726765742d6164604482015270191c995cdccb5b9bdd0b585b1b1bddd959607a1b6064820152608401610108565b505050505050505050505050565b606060008261026e601482610603565b15801561027a57508015155b6102da5760405162461bcd60e51b815260206004820152602b60248201527f416c6c6f77656454617267657473456e666f726365723a696e76616c69642d7460448201526a0cae4dae65ad8cadccee8d60ab1b6064820152608401610108565b6102e560148261062d565b67ffffffffffffffff8111156102fd576102fd610641565b604051908082528060200260200182016040528015610326578160200160208202803683370190505b50925060005b818110156103a557858186610342826014610657565b9261034f9392919061066a565b61035891610694565b60601c84848151811061036d5761036d6105d7565b6001600160a01b03909216602092830291909101909101528261038f816106c9565b935061039e9050601482610657565b905061032c565b50505092915050565b6001600160f81b0319828116908216145b92915050565b60008036816103d7601482878961066a565b6103e091610694565b60601c93506103f360346014878961066a565b6103fc916106e2565b925061040b856034818961066a565b949793965094505050565b60008083601f84011261042857600080fd5b50813567ffffffffffffffff81111561044057600080fd5b60208301915083602082850101111561045857600080fd5b9250929050565b80356001600160a01b038116811461047657600080fd5b919050565b60008060008060008060008060008060e08b8d03121561049a57600080fd5b8a3567ffffffffffffffff808211156104b257600080fd5b6104be8e838f01610416565b909c509a5060208d01359150808211156104d757600080fd5b6104e38e838f01610416565b909a50985060408d0135975060608d013591508082111561050357600080fd5b506105108d828e01610416565b90965094505060808b0135925061052960a08c0161045f565b915061053760c08c0161045f565b90509295989b9194979a5092959850565b6000806020838503121561055b57600080fd5b823567ffffffffffffffff81111561057257600080fd5b61057e85828601610416565b90969095509350505050565b6020808252825182820181905260009190848201906040850190845b818110156105cb5783516001600160a01b0316835292840192918401916001016105a6565b50909695505050505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601260045260246000fd5b600082610612576106126105ed565b500690565b634e487b7160e01b600052601160045260246000fd5b60008261063c5761063c6105ed565b500490565b634e487b7160e01b600052604160045260246000fd5b808201808211156103bf576103bf610617565b6000808585111561067a57600080fd5b8386111561068757600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff1981358181169160148510156106c15780818660140360031b1b83161692505b505092915050565b6000600182016106db576106db610617565b5060010190565b803560208310156103bf57600019602084900360031b1b169291505056fea2646970667358221220192854344f7cbe5e3a46630068ff1c57d1382d110f4c7dae36ce8f18206bd1c864736f6c63430008170033" as const;