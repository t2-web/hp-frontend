import { env } from '@/constants';
import { getWeb3 } from './web3';
import uniqueNFTAbi from './abi/UniqueNFT.json';
import multiNFTAbi from './abi/MultiNFT.json';

const _initContract = (provider, abi, address) => {
  const myWeb3 = getWeb3(provider);
  return new myWeb3.eth.Contract(abi, address);
};

const networkCodes = {
  1: 'eth',
  4: 'eth',
  56: 'bsc',
  97: 'bsc',
  137: 'polygon',
  80001: 'polygon',
  592: 'astar',
  81: 'astar',
};

export const getNetworkCode = chainId => {
  return networkCodes[chainId] || '';
};

// type = 721 | 1155
export const getContractAddress = (chainId, type) => {
  const network = getNetworkCode(chainId);
  if (network) {
    return env.app.contractAddress[network][`nft_${type}`];
  }
  return '';
};

const burnERC721 = async (provider, fromAddress, tokenId) => {
  const contractAddress = getContractAddress(provider.chainId, '721');
  const myContract = _initContract(provider, uniqueNFTAbi, contractAddress);
  console.log(`burnERC721: ${contractAddress} - ${tokenId}`);
  const rs = await myContract.methods.burn(tokenId).send({ from: fromAddress });
  return rs;
};

const burnERC1155 = async (provider, fromAddress, tokenId, amount) => {
  const contractAddress = getContractAddress(provider.chainId, '1155');
  const myContract = _initContract(provider, multiNFTAbi, contractAddress);
  console.log(`burnERC1155: ${contractAddress} - ${tokenId}`);
  const rs = await myContract.methods
    .burn(fromAddress, tokenId, amount)
    .send({ from: fromAddress });
  return rs;
};

const transferERC721 = async (provider, fromAddress, toAddress, tokenId) => {
  const contractAddress = getContractAddress(provider.chainId, '721');
  const myContract = _initContract(provider, uniqueNFTAbi, contractAddress);
  console.log(`transferERC721: ${contractAddress} - ${tokenId}`);
  const rs = await myContract.methods
    .transferFrom(fromAddress, toAddress, tokenId)
    .send({ from: fromAddress });
  return rs;
};

const transferERC1155 = async (
  provider,
  fromAddress,
  toAddress,
  tokenId,
  amount,
) => {
  const contractAddress = getContractAddress(provider.chainId, '1155');
  const myContract = _initContract(provider, multiNFTAbi, contractAddress);
  console.log(`transferERC1155: ${contractAddress} - ${tokenId}`);
  const rs = await myContract.methods
    .safeTransferFrom(fromAddress, toAddress, tokenId, amount, [])
    .send({ from: fromAddress });
  return rs;
};

const mintERC721 = async (provider, toAddress, metadataURI) => {
  const contractAddress = getContractAddress(provider.chainId, '721');
  const myContract = _initContract(provider, uniqueNFTAbi, contractAddress);
  console.log(`mintERC721: ${contractAddress}`);
  const rs = await myContract.methods
    .mintItem(toAddress, metadataURI)
    .send({ from: toAddress });
  return rs;
};

const mintERC1155 = async (provider, toAddress, metadataURI, quantity) => {
  const contractAddress = getContractAddress(provider.chainId, '1155');
  const myContract = _initContract(provider, multiNFTAbi, contractAddress);
  console.log(`mintERC1155: ${contractAddress}`);
  const rs = await myContract.methods
    .mintItem(toAddress, metadataURI, quantity)
    .send({ from: toAddress });
  return rs;
};

export default {
  mintERC721,
  mintERC1155,
  transferERC721,
  transferERC1155,
  burnERC721,
  burnERC1155,
};
