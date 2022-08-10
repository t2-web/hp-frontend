
import { env } from "@/constants/env.js";

const CHAIN_ID = env.app.rpcMetamask.chainId;

export const metamaskConnect = {
  97: {
    chainId: "0x61",
    chainName: "Binance Smart Chain - Testnet",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"]
  },
  56: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"]
  },
  //
  4: {
    chainId: "0x4",
    chainName: "Rinkeby Test Network",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"]
  },
  1: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://etherscan.io/"]
  },
  //
  43113: {
    chainId: "0xa869",
    chainName: "Avalancheche Network- Testnet",
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"]
  },
  43114: {
    chainId: "0xA86A",
    chainName: "Avalancheche Network",
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io/"]
  },
  //
  137: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  80001: {
    chainId: "0x13881",
    chainName: "Mumbai-Testnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://rpc-mumbai.matic.today/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
  },
  81: {
    // Shibuya (Astar testnet)
    chainId: "0x51",
    chainName: "Shibuya (Astar-Testnet)",
    nativeCurrency: { name: "SBY", symbol: "SBY", decimals: 18 },
    rpcUrls: ["https://evm.shibuya.astar.network"],
    blockExplorerUrls: ["https://blockscout.com/shibuya/"]
  },
  592: {
    // Astar mainnet
    chainId: "0x250",
    chainName: "Astar Network",
    nativeCurrency: { name: "ASTR", symbol: "ASTR", decimals: 18 },
    rpcUrls: ["https://evm.astar.network"],
    blockExplorerUrls: ["https://blockscout.com/astar/"]
  },
  336: {
    chainId: "0x150",
    chainName: "Shiden Network",
    nativeCurrency: { name: "SDN", symbol: "SDN", decimals: 18 },
    rpcUrls: ["https://evm.shiden.astar.network"],
    blockExplorerUrls: ["https://blockscout.com/shiden/"]
  }
};

export const metamask = metamaskConnect[CHAIN_ID];
