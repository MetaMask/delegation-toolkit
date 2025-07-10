import {
  deployments_1_3_0,
  deployments_1_1_0,
  deployments_1_0_0,
} from './contractAddresses';

export const CHAIN_ID = {
  // Mainnets
  mainnet: 1,
  optimism: 10,
  bsc: 56,
  gnosis: 100,
  polygon: 137,
  base: 8453,
  arbitrum: 42161,
  inkMainnet: 57073,
  linea: 59144,
  berachain: 80094,
  unichain: 130,
  arbitrumNova: 42170,
  // Testnets
  bscTestnet: 97,
  citreaTestnet: 5115,
  megaEthTestnet: 6342,
  chiado: 10200,
  lineaSepolia: 59141,
  berachainBepolia: 80069,
  baseSepolia: 84532,
  arbitrumSepolia: 421614,
  sepolia: 11155111,
  optimismSepolia: 11155420,
  unichainSepolia: 1301,
  polygonAmoy: 80002,
  inkSepolia: 763373,
  monadTestnet: 10143,
  // decommissioned
  lineaGoerli: 59140,
};

type DeployedContracts = Record<
  string,
  Record<number, Record<string, `0x${string}`>>
>;

export const DELEGATOR_CONTRACTS: DeployedContracts = {
  '1.0.0': {
    // Mainnets
    [CHAIN_ID.optimism]: deployments_1_0_0,
    [CHAIN_ID.polygon]: deployments_1_0_0,
    [CHAIN_ID.base]: deployments_1_0_0,
    [CHAIN_ID.arbitrum]: deployments_1_0_0,
    [CHAIN_ID.linea]: deployments_1_0_0,
    // Testnets
    [CHAIN_ID.sepolia]: {
      ...deployments_1_0_0,
      HybridDeleGatorImpl: '0x5989F5D13DF8fc818EdA65e417AED90459fD67F7',
    },
    [CHAIN_ID.lineaSepolia]: {
      ...deployments_1_0_0,
      HybridDeleGatorImpl: '0x5989F5D13DF8fc818EdA65e417AED90459fD67F7',
    },
  },
  '1.1.0': {
    // Mainnets
    [CHAIN_ID.arbitrum]: deployments_1_1_0,
    [CHAIN_ID.base]: deployments_1_1_0,
    [CHAIN_ID.linea]: deployments_1_1_0,
    [CHAIN_ID.optimism]: deployments_1_1_0,
    [CHAIN_ID.polygon]: deployments_1_1_0,
    // Testnets
    [CHAIN_ID.sepolia]: deployments_1_1_0,
    [CHAIN_ID.lineaSepolia]: deployments_1_1_0,
    [CHAIN_ID.baseSepolia]: {
      ...deployments_1_1_0,
      SimpleFactory: '0xE8eA1DE8D6AfE400B7C8C1A81B7C29B7876b4d02',
    },
  },
  '1.3.0': {
    // Mainnets
    [CHAIN_ID.mainnet]: deployments_1_3_0,
    [CHAIN_ID.polygon]: deployments_1_3_0,
    [CHAIN_ID.bsc]: deployments_1_3_0,
    [CHAIN_ID.optimism]: deployments_1_3_0,
    [CHAIN_ID.arbitrum]: deployments_1_3_0,
    [CHAIN_ID.inkMainnet]: deployments_1_3_0,
    [CHAIN_ID.linea]: deployments_1_3_0,
    [CHAIN_ID.base]: deployments_1_3_0,
    [CHAIN_ID.gnosis]: deployments_1_3_0,
    [CHAIN_ID.berachain]: deployments_1_3_0,
    [CHAIN_ID.unichain]: deployments_1_3_0,
    [CHAIN_ID.arbitrumNova]: deployments_1_3_0,
    // Testnets
    [CHAIN_ID.sepolia]: deployments_1_3_0,
    [CHAIN_ID.citreaTestnet]: deployments_1_3_0,
    [CHAIN_ID.lineaSepolia]: deployments_1_3_0,
    [CHAIN_ID.baseSepolia]: deployments_1_3_0,
    [CHAIN_ID.megaEthTestnet]: deployments_1_3_0,
    [CHAIN_ID.chiado]: deployments_1_3_0,
    [CHAIN_ID.bscTestnet]: deployments_1_3_0,
    [CHAIN_ID.optimismSepolia]: deployments_1_3_0,
    [CHAIN_ID.arbitrumSepolia]: deployments_1_3_0,
    [CHAIN_ID.berachainBepolia]: deployments_1_3_0,
    [CHAIN_ID.unichainSepolia]: deployments_1_3_0,
    [CHAIN_ID.polygonAmoy]: deployments_1_3_0,
    [CHAIN_ID.inkSepolia]: deployments_1_3_0,
    [CHAIN_ID.monadTestnet]: deployments_1_3_0,
  },
};
