
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://ecommercesite-backend.vercel.app/graphql', // URL of your GraphQL server
  cache: new InMemoryCache(),
});

export default client;
