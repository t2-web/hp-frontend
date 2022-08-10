import { env } from '@/constants';
import { getWeb3 } from './web3';
import erc20Abi from './abi/ERC20.json';
import disperseAbi from './abi/Disperse.json';
import { getNetworkCode } from './nft';
import { unitMap } from '../unit';

const getBalanceNativeCoin = async (provider, wallet) => {
  try {
    const web3 = getWeb3(provider);
    const wei = await web3.eth.getBalance(wallet);
    return parseFloat(web3.utils.fromWei(wei, 'ether'));
  } catch (ex) {
    return 0;
  }
};

const getBalanceCoin = async (provider, wallet, token, decimals = 18) => {
  if (!token || token === '0x0000000000000000000000000000000000000000')
    return getBalanceNativeCoin(provider, wallet);

  try {
    const web3 = getWeb3(provider);
    const contract = new web3.eth.Contract(erc20Abi, token);
    const balance = await contract.methods.balanceOf(wallet).call();
    return parseFloat(
      web3.utils.fromWei(balance, unitMap[decimals] || 'ether'),
    );
  } catch (error) {
    console.log('err', error);
    return 0;
  }
};

export const getContractAddress = chainId => {
  const network = getNetworkCode(chainId);
  if (network) {
    return env.app.contractAddress[network]['disperse'];
  }
  return '';
};

async function getAllowance(provider, walletAddress, token, decimals = 18) {
  const contractAddress = getContractAddress(provider.chainId);

  const web3 = getWeb3(provider);
  const contract = new web3.eth.Contract(erc20Abi, token);
  const rs = await contract.methods
    .allowance(walletAddress, contractAddress)
    .call();
  return parseFloat(web3.utils.fromWei(rs, unitMap[decimals] || 'ether'));
}

async function approveERC20(provider, walletAddress, token, amount) {
  const contractAddress = getContractAddress(provider.chainId);

  const web3 = getWeb3(provider);
  const contract = new web3.eth.Contract(erc20Abi, token);
  return await contract.methods.approve(contractAddress, amount).send({
    from: walletAddress,
  });
}

async function disperseToken(
  provider,
  walletAddress,
  token,
  recipients,
  amounts,
) {
  const web3 = getWeb3(provider);
  const contractAddress = getContractAddress(provider.chainId);
  const contract = new web3.eth.Contract(disperseAbi, contractAddress);
  return await contract.methods.disperseToken(token, recipients, amounts).send({
    from: walletAddress,
  });
}

async function getTokenInfo(provider, token) {
  const web3 = getWeb3(provider);
  try {
    const contract = new web3.eth.Contract(erc20Abi, token);
    if (!contract) return null;
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
    return {
      name,
      symbol,
      decimals,
      address: token,
    };
  } catch (ex) {
    return null;
  }
}

export default {
  getTokenInfo,
  getAllowance,
  getBalanceCoin,
  disperseToken,
  approveERC20,
};
