import store from '@/store';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { unitMap } from '../unit';

const getWeb3 = provider => {
  let web3 = null;
  if (provider && provider.isMetaMask) {
    provider = window.ethereum;
    web3 = new Web3(provider);
  } else if (provider && provider.address) {
    web3 = new Web3(window.wallet.currentProvider);
  }

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
};

const getBalanceCoin = async (provider, address) => {
  try {
    const web3 = getWeb3(provider);
    const wei = await web3.eth.getBalance(address);
    return web3.utils.fromWei(wei, 'ether');
  } catch (error) {
    return 0;
  }
};

const getGasPrice = async (provider = null) => {
  try {
    const myWeb3 = getWeb3(provider);
    const rawGasPrice = await myWeb3.eth.getGasPrice();
    console.log('---->rawGasPrice', rawGasPrice);
    return new BigNumber(rawGasPrice).times(1.3).toFixed(0);
  } catch (error) {
    return null;
  }
};
const estimateGas = async (myContract, action, params, overwrite) => {
  try {
    const gas = await myContract.methods[action](...params).estimateGas(
      overwrite,
    );
    return gas;
  } catch (error) {
    let _error = error;
    try {
      let tmp = error.toString().replace('Error: Internal JSON-RPC error.', '');
      _error = JSON.parse(tmp);
    } catch (e) {
      _error = error;
    }
    throw _error;
  }
};

const sendRawTx = async (
  provider,
  abi,
  addressContract,
  action,
  params,
  overwrite,
) => {
  console.log('---->params', params);
  const myWeb3 = getWeb3(provider);
  const myContract = new myWeb3.eth.Contract(abi, addressContract);
  // if (provider && !provider.isMetaMask) {
  const gas = await estimateGas(
    myContract,
    action,
    params,
    overwrite,
    provider,
  );
  console.log('--->gas: ', gas);
  // overwrite.gasLimit = gas;
  // }
  overwrite.maxPriorityFeePerGas = null;
  overwrite.maxFeePerGas = null;

  const gasPrice = await getGasPrice(provider);
  console.log('----->gasPrice', gasPrice);
  if (gasPrice) {
    overwrite.maxPriorityFeePerGas = gasPrice;
    overwrite.maxFeePerGas = gasPrice;
  }
  const rs = myContract.methods[action](...params).send(overwrite);
  // update balancce user in header
  store.dispatch('wallet/updateBalance');
  return rs;
};

const getCurrentBlock = async () => {
  try {
    const myWeb3 = getWeb3(null);
    const currentBlock = await myWeb3.eth.getBlockNumber();
    return currentBlock;
  } catch (error) {
    console.log('getCurrentBlock: ', error);
    return error;
  }
};

const fromWei = (value, decimals = 18) => {
  try {
    return Web3.utils.fromWei(value, unitMap[decimals] || 'ether');
  } catch (error) {
    console.log('fromWei:', error);
    return 0;
  }
};

const toWei = (value, decimals = 18) => {
  try {
    return Web3.utils.toWei(value, unitMap[decimals] || 'ether');
  } catch (error) {
    console.log('toWei:', error);
    return '0';
  }
};

const coverDecimals = decimals => {
  return new BigNumber(10).pow(decimals);
};

export {
  toWei,
  fromWei,
  coverDecimals,
  getCurrentBlock,
  getWeb3,
  getBalanceCoin,
  getGasPrice,
  sendRawTx,
};
