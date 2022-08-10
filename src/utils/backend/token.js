const tokens = {
  1: [],
  4: [
    {
      name: 'LINK',
      symbol: 'LINK',
      decimals: 18,
      address: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      address: '0xd8fe2dbcb02f6e69c8572b992475bc7821a831e4',
    },
  ],
  56: [],
  97: [
    {
      name: 'BSCUSD',
      symbol: 'BUSD',
      decimals: 18,
      address: '0xB425dA01b4A353fF9f36f6Cae4acD32911046fE5',
    },
  ],
  137: [],
  80001: [
    {
      name: 'ChainLink',
      symbol: 'LINK',
      decimals: 18,
      address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      address: '0xD33572f6DD1bb0D99C8397c8efE640Cf973EaF3B',
    },
  ],
  592: [],
  81: [
    {
      name: 'BUSD',
      symbol: 'BUSD',
      decimals: 18,
      address: '0x3099daC30217E92b26a9e53aaA5Ef975D530138f',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      address: '0x37B76d58FAFc3Bc32E12E2e720F7a57Fc94bE871',
    },
    {
      name: 'Binance USD',
      symbol: 'BUSD',
      decimals: 18,
      address: '0x8E2882fd1C059B30648A8e2767e769F7029D3893',
    },
  ],
};

const getList = async (_, chainId) => {
  return Promise.resolve(tokens[chainId] || []);
};

export default {
  getList,
};
