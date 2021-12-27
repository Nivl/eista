import { Me } from 'backend/types';

type testUser = {
  me: Me;
  token: string;
};

export const defaultUser: testUser = {
  me: {
    id: 'd4349a87-9b9a-45fc-aea7-b036211aa5d7',
    name: 'John Doe',
    email: 'john.doe@domain.tld',
  },
  token: '094b9bc8-012a-4308-923d-0047b1e9702f',
};

export const users = [defaultUser];

export const userFromToken = (token: string | null): testUser | undefined =>
  users.find(user => user.token === token);
