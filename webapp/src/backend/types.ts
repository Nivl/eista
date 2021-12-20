export type Me = {
  id: string;
  email: string;
  name: string;
};

export type Session = {
  token: string;
};

type ActualError = {
  message: string;
  path: string[];
  extensions?: {
    code: string;
    field: string;
  };
};

export type GraphQLError = {
  response: {
    errors: ActualError[];
  };
};

export function isGraphQLError(e: GraphQLError | Error): e is GraphQLError {
  return (e as GraphQLError).response !== undefined;
}
