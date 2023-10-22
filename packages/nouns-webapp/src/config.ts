import {
  ContractAddresses as NounsContractAddresses,
  getContractAddressesForChainOrThrow,
} from '@nouns/sdk';
import { ChainId } from '@usedapp/core';

interface ExternalContractAddresses {
  lidoToken: string | undefined;
  usdcToken: string | undefined;
  chainlinkEthUsdc: string | undefined;
  payerContract: string | undefined;
  tokenBuyer: string | undefined;
  nounsStreamFactory: string | undefined;
  weth: string | undefined;
  steth: string | undefined;
}

export type ContractAddresses = NounsContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | ChainId.Hardhat;

interface CacheBucket {
  name: string;
  version: string;
}

export const cache: Record<string, CacheBucket> = {
  seed: {
    name: 'seed',
    version: 'v1',
  },
  ens: {
    name: 'ens',
    version: 'v1',
  },
};

export const cacheKey = (bucket: CacheBucket, ...parts: (string | number)[]) => {
  return [bucket.name, bucket.version, ...parts].join('-').toLowerCase();
};

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];
  return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];
  return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
};

const app: {
  nouns: Record<SupportedChains, AppConfig>,
  foodnouns: Record<SupportedChains, AppConfig>
} = {
  nouns: {
    [ChainId.Rinkeby]: {
      jsonRpcUri: createNetworkHttpUrl('rinkeby'),
      wsRpcUri: createNetworkWsUrl('rinkeby'),
      subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/yanuar-ar/foodnouns',
      enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    },
    [ChainId.Mainnet]: {
      jsonRpcUri: createNetworkHttpUrl('mainnet'),
      wsRpcUri: createNetworkWsUrl('mainnet'),
      subgraphApiUri:
        'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/prod/gn',
      enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    },
    [ChainId.Hardhat]: {
      jsonRpcUri: createNetworkHttpUrl('mainnet'),
      wsRpcUri: createNetworkWsUrl('mainnet'),
      subgraphApiUri:
        'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/prod/gn',
      enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    },
  },
  foodnouns: {
    [ChainId.Rinkeby]: {
      jsonRpcUri: createNetworkHttpUrl('rinkeby'),
      wsRpcUri: createNetworkWsUrl('rinkeby'),
      subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/yanuar-ar/foodnouns',
      enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    },
    [ChainId.Mainnet]: {
      jsonRpcUri: createNetworkHttpUrl('mainnet'),
      wsRpcUri: createNetworkWsUrl('mainnet'),
      subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/yanuar-ar/foodnouns',
      enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    },
    [ChainId.Hardhat]: {
      jsonRpcUri: 'http://localhost:8545',
      wsRpcUri: 'ws://localhost:8545',
      subgraphApiUri: '',
      enableHistory: false,
    },
  }
};

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [ChainId.Rinkeby]: {
    lidoToken: '0xF4242f9d78DB7218Ad72Ee3aE14469DBDE8731eD',
    usdcToken: undefined,
    chainlinkEthUsdc: undefined,
    payerContract: undefined,
    tokenBuyer: undefined,
    weth: undefined,
    steth: undefined,
    nounsStreamFactory: undefined,
  },
  [ChainId.Mainnet]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    usdcToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainlinkEthUsdc: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    payerContract: '0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D',
    tokenBuyer: '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    nounsStreamFactory: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
  },
  [ChainId.Hardhat]: {
    lidoToken: undefined,
    usdcToken: undefined,
    chainlinkEthUsdc: undefined,
    payerContract: undefined,
    tokenBuyer: undefined,
    weth: undefined,
    steth: undefined,
    nounsStreamFactory: undefined,
  },
};

const getAddresses = (): ContractAddresses => {
  let nounsAddresses = {} as NounsContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch { }
  return { ...nounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const config = {
  nounsApp: app.nouns['1'],
  foodnounsApp: app.foodnouns[CHAIN_ID],
  addresses: getAddresses(),
};

export default config;
