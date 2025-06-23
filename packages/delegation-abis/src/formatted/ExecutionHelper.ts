export const abi = [
  {
    "type": "event",
    "name": "TryExecuteUnsuccessful",
    "inputs": [
      {
        "name": "batchExecutionindex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "result",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ExecutionFailed",
    "inputs": []
  }
] as const;


export const bytecode = "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea264697066735822122070e8319b78da08f58cb6bf69f50e33c8c919ae6c2113f3ef3b34f1da6bf44c5f64736f6c63430008170033" as const;