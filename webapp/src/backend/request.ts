import { GraphQLClient } from 'graphql-request';

export const request = (query: string, variables: unknown = {}) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/query`;
  const graphQLClient = new GraphQLClient(url);

  const token = window.localStorage.getItem('user_access_token');
  if (token) {
    graphQLClient.setHeader('Authorization', `Bearer ${token}`);
  }

  return graphQLClient.request(query, variables);
};
