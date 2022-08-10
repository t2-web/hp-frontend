import _ from 'lodash';
import gql from 'graphql-tag';
import { apolloClients } from './apollo';
import { metamaskConnect } from '@/constants';
import { getContractAddress } from '../contracts/nft';

const QUERY_721 = gql`
  query erc721S($where: Erc721_filter) {
    erc721S(where: $where) {
      id
      tokenId
      owner
      name
      symbol
      tokenURI
      author
      timestamp
    }
  }
`;

const QUERY_1155 = gql`
  query erc1155S($where: Erc1155_filter) {
    erc1155S(where: $where) {
      id
      tokenId
      tokenURI
      amount
      owner
      author
      timestamp
    }
  }
`;

const getClient = chainId => {
  if (chainId === 137 || chainId === 80001) return apolloClients['polygon'];
  if (chainId === 1 || chainId === 4) return apolloClients['eth'];
  if (chainId === 56 || chainId === 97) return apolloClients['bsc'];
  if (chainId === 592 || chainId === 81) return apolloClients['astar'];
  return null;
};

const getExplorerUrl = (chainId, contract, tokenId) => {
  if (chainId === 81 || chainId === 592) {
    return `${metamaskConnect[chainId].blockExplorerUrls[0]}token/${contract}/instance/${tokenId}`;
  }
  if (metamaskConnect[chainId] && metamaskConnect[chainId].blockExplorerUrls) {
    return `${metamaskConnect[chainId].blockExplorerUrls[0]}token/${contract}?a=${tokenId}`;
  }
  return '';
};

// type = 721 | 1155
const loadData = async (owner, chainId, type) => {
  const ownerAddress = _.toLower(owner);
  const contractAddress = getContractAddress(chainId, type);

  let list = [];
  try {
    const client = getClient(chainId);
    if (!client) return [];

    const res = await client.query({
      query: type === '1155' ? QUERY_1155 : QUERY_721,
      variables: {
        where: {
          owner_contains_nocase: ownerAddress,
        },
      },
      fetchPolicy: 'network-only',
    });
    if (res.data) {
      list = res.data.erc721S || res.data.erc1155S || [];
    }
  } catch (error) {
    console.log('Load data error: ', error);
  }

  return list
    .filter(item => {
      if (type === '1155' && item.amount < 1) return false;
      return true;
    })
    .map(item => {
      return {
        ...item,
        explorerUrl: getExplorerUrl(chainId, contractAddress, item.tokenId),
      };
    });
};

export default {
  loadData,
};
