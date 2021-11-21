import { GraphQLClient } from 'graphql-request';

const request = (query: string, variables: unknown = {}) => {
  const url = `${process.env.REACT_APP_API_URL}/query`;
  const graphQLClient = new GraphQLClient(url);

  const token = window.localStorage.getItem('api_access_token');
  if (token) {
    graphQLClient.setHeader('Authorization', `Bearer ${token}`);
  }

  return graphQLClient.request(query, variables);
};

export default request;
