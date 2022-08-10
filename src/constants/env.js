export const env = {
  app: {
    name: process.env.VUE_APP_NAME || 'T2WEB Crypto Tool',
    version: process.env.VUE_APP_VERSION || '1.0.0',
    apiUrl:
      process.env.VUE_APP_BASE_URL || 'https://stage-dodo-api.vinaweb.app',
    apiKey: process.env.VUE_APP_API_KEY || '',
    apiSecretKey: process.env.VUE_APP_API_SECRET_KEY || '',
    locale: process.env.VUE_APP_I18N_LOCALE || 'en',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    ipfsGateway:
      process.env.VUE_APP_IPFS_GATEWAY || 'https://dodo.mypinata.cloud/ipfs/',
    sendnftUrl:
      process.env.VUE_APP_SENDNFT_URL || 'https://dev.d1vtc1wu27va80.amplifyapp.com/nftTransfer',
    contractAddress: {
      polygon: {
        nft_721: process.env.VUE_APP_CONTRACT_ADDRESS_POLYGON_NFT_721,
        nft_1155: process.env.VUE_APP_CONTRACT_ADDRESS_POLYGON_NFT_1155,
        disperse: process.env.VUE_APP_CONTRACT_ADDRESS_POLYGON_DISPERSE || '0xB6d07BF32aBb4C5F22Ae2DC6D89E676289a6158f',
      },
      eth: {
        nft_721: process.env.VUE_APP_CONTRACT_ADDRESS_ETH_NFT_721,
        nft_1155: process.env.VUE_APP_CONTRACT_ADDRESS_ETH_NFT_1155,
        disperse: process.env.VUE_APP_CONTRACT_ADDRESS_ETH_DISPERSE || '0x9aB8D8e0A61c1cf6bD26bf2209c25212a2390276',
      },
      bsc: {
        nft_721: process.env.VUE_APP_CONTRACT_ADDRESS_BSC_NFT_721,
        nft_1155: process.env.VUE_APP_CONTRACT_ADDRESS_BSC_NFT_1155,
        disperse: process.env.VUE_APP_CONTRACT_ADDRESS_BSC_DISPERSE || '0x265a33Ba6B601D20100BE0198e42a44A7aFCc8ea',
      },
      astar: {
        nft_721: process.env.VUE_APP_CONTRACT_ADDRESS_ASTAR_NFT_721,
        nft_1155: process.env.VUE_APP_CONTRACT_ADDRESS_ASTAR_NFT_1155,
        disperse: process.env.VUE_APP_CONTRACT_ADDRESS_ASTAR_DISPERSE || '0x0855eA6187dE973Bc5849d67C14f59c6fE2cF039',
      },
    },
    subgraphs: {
      polygon: process.env.VUE_APP_SUBGRAPH_ENDPOINT_POLYGON,
      eth: process.env.VUE_APP_SUBGRAPH_ENDPOINT_ETH,
      bsc: process.env.VUE_APP_SUBGRAPH_ENDPOINT_BSC,
      astar: process.env.VUE_APP_SUBGRAPH_ENDPOINT_ASTAR,
    },
    rpcMetamask: {
      chainId: process.env.VUE_APP_CHAINID || 4,
      chainIds: process.env.VUE_APP_CHAINID_LIST.split(',').map(s => parseInt(s)),
    },
  },
};
