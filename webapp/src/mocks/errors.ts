import { ActualError } from 'backend/types';

export const newForbidenError = ({
  message,
}: {
  message: string;
}): ActualError => ({
  message: message,
  path: [],
  extensions: {
    code: 'ForbiddenError',
    field: '',
  },
});

export const newValidationError = ({
  field,
  message,
}: {
  field: string;
  message: string;
}): ActualError => ({
  message: message,
  path: [],
  extensions: {
    code: 'ValidationError',
    field: field,
  },
});

export const newConflictError = ({
  field,
  message,
}: {
  field: string;
  message: string;
}): ActualError => ({
  message: message,
  path: [],
  extensions: {
    code: 'ConflictError',
    field: field,
  },
});

export const newAuthenticationError = (): ActualError => ({
  message: 'Not authenticated',
  path: [],
  extensions: {
    code: 'AuthenticationError',
  },
});
