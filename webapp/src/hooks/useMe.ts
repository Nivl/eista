import { useContext } from 'react';

import MeContext from 'contexts/me';

const useMe = () => useContext(MeContext);

export default useMe;
