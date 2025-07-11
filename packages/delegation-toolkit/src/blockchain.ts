import { CHAIN_ID } from '@metamask/delegation-deployments';

const CHAIN_EXPLORERS = {
  [CHAIN_ID.arbitrum]: 'https://arbiscan.io',
  [CHAIN_ID.arbitrumNova]: 'https://nova.arbiscan.io',
  [CHAIN_ID.arbitrumSepolia]: 'https://sepolia.arbiscan.io',
  [CHAIN_ID.base]: 'https://basescan.org',
  [CHAIN_ID.baseSepolia]: 'https://sepolia.basescan.org',
  [CHAIN_ID.berachain]: 'https://berascan.com',
  [CHAIN_ID.berachainBepolia]: 'https://testnet.berascan.com',
  [CHAIN_ID.bsc]: 'https://bscscan.com',
  [CHAIN_ID.bscTestnet]: 'https://testnet.bscscan.com',
  [CHAIN_ID.gnosis]: 'https://gnosisscan.io',
  [CHAIN_ID.linea]: 'https://lineascan.build',
  [CHAIN_ID.lineaSepolia]: 'https://sepolia.lineascan.build',
  [CHAIN_ID.mainnet]: 'https://etherscan.io',
  [CHAIN_ID.monadTestnet]: 'https://testnet.monadscan.com',
  [CHAIN_ID.optimism]: 'https://optimistic.etherscan.io',
  [CHAIN_ID.optimismSepolia]: 'https://sepolia-optimism.etherscan.io',
  [CHAIN_ID.polygon]: 'https://polygonscan.com',
  [CHAIN_ID.polygonAmoy]: 'https://amoy.polygonscan.com',
  [CHAIN_ID.sepolia]: 'https://sepolia.etherscan.io',
  [CHAIN_ID.unichain]: 'https://uniscan.xyz',
  [CHAIN_ID.unichainSepolia]: 'https://sepolia.uniscan.xyz',
};

const getExplorerLink = (chainId: number) => {
  const url = CHAIN_EXPLORERS[chainId];
  if (!url) {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }
  return url;
};

export const getExplorerAddressLink = (chainId: number, address: string) => {
  const prefix = getExplorerLink(chainId);
  return `${prefix}/address/${address}`;
};

export const getExplorerTransactionLink = (chainId: number, hash: string) => {
  const prefix = getExplorerLink(chainId);
  return `${prefix}/tx/${hash}`;
};

export const shortenHash = (address: string | undefined) =>
  address ? `${address.slice(0, 6)}...` : '';

/**
 * Returns the Infura RPC URL for a given chainId and API key.
 * @param chainId - The chain ID.
 * @param apiKey - Infura API key.
 * @returns The Infura RPC URL.
 * @throws If the API key is missing or the chain is unsupported.
 */
export const getInfuraRpcUrl = (chainId: number, apiKey?: string): string => {
  if (!apiKey) {
    throw new Error('Infura API key is required');
  }
  switch (chainId) {
    case CHAIN_ID.arbitrum:
      return `https://arbitrum-mainnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.arbitrumSepolia:
      return `https://arbitrum-sepolia.infura.io/v3/${apiKey}`;
    case CHAIN_ID.base:
      return `https://base-mainnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.baseSepolia:
      return `https://base-sepolia.infura.io/v3/${apiKey}`;
    case CHAIN_ID.bsc:
      return `https://bsc-mainnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.bscTestnet:
      return `https://bsc-testnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.linea:
      return `https://linea-mainnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.lineaSepolia:
      return `https://linea-sepolia.infura.io/v3/${apiKey}`;
    case CHAIN_ID.mainnet:
      return `https://mainnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.optimism:
      return `https://optimism-mainnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.optimismSepolia:
      return `https://optimism-sepolia.infura.io/v3/${apiKey}`;
    case CHAIN_ID.polygon:
      return `https://polygon-mainnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.polygonAmoy:
      return `https://polygon-amoy.infura.io/v3/${apiKey}`;
    case CHAIN_ID.sepolia:
      return `https://sepolia.infura.io/v3/${apiKey}`;
    case CHAIN_ID.unichain:
      return `https://unichain-mainnet.infura.io/v3/${apiKey}`;
    case CHAIN_ID.unichainSepolia:
      return `https://unichain-sepolia.infura.io/v3/${apiKey}`;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
};
