import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { env } from '@/constants';

const createApolloClient = endpoint => {
  if (!endpoint) return null;

  const httpLink = createHttpLink({
    uri: endpoint,
  });
  const cache = new InMemoryCache();
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  });
  return apolloClient;
};

export const apolloClients = {
  eth: createApolloClient(env.app.subgraphs.eth),
  polygon: createApolloClient(env.app.subgraphs.polygon),
  bsc: createApolloClient(env.app.subgraphs.bsc),
  astar: createApolloClient(env.app.subgraphs.astar),
};
