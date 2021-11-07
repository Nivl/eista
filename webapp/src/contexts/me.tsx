import { createContext } from 'react';

import { Me } from '../backend/types';

// The context is a noop by default
const MeContext = createContext<{
  me: Me | null;
  setMe: (me: Me | null) => void;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}>({
  me: null,
  setMe: _ => null,
  isLoading: false,
  isError: false,
});

export default MeContext;
