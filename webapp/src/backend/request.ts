import { GraphQLClient } from 'graphql-request';

const request = (query: string) => {
  const url = `${process.env.REACT_APP_API_URL}/query`;
  const graphQLClient = new GraphQLClient(url);

  // TODO(melvin): remove token
  const token =
    window.localStorage.getItem('api_access_token') ||
    'd86ab1dc-9b54-4073-a831-fbb2a4bb1572';
  if (token) {
    graphQLClient.setHeader('Authorization', `Bearer ${token}`);
  }

  return graphQLClient.request(query);
};

export default request;
