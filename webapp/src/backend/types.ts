export type Me = {
  id: string;
  email: string;
  name: string;
  hasOnboarded: boolean;
};

export type Session = {
  token: string;
};

export type ActualError = {
  message: string;
  path: string[];
  extensions?: {
    code?: string;
    field?: string;
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
