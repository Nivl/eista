import { act, render, screen, waitFor } from '@testing-library/react';
import {
  Navigate as NavigateOriginal,
  useNavigate as useNavigateOriginal,
} from 'react-router-dom';

import MeContext from 'contexts/MeContext';

jest.mock('react-router-dom');
const Navigate = NavigateOriginal as jest.Mock;
const useNavigate = useNavigateOriginal as jest.Mock;
const navigate = jest.fn();
useNavigate.mockReturnValue({
  navigate,
});

import LoadingOriginal from 'components/Loader';
jest.mock('components/Loader');
const Loading = LoadingOriginal as jest.Mock;

import useSignInOriginal from 'hooks/useSignIn';
jest.mock('hooks/useSignIn');
const useSignIn = useSignInOriginal as jest.Mock;

import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    Loading.mockReset();
    Navigate.mockReset();
    useSignIn.mockReset();
    navigate.mockReset();
  });

  it('Should show a loader if fetching user state', async () => {
    const signInFunc = jest.fn();
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });
    Loading.mockReturnValue(<div data-testid="loading" />);
    Navigate.mockReturnValue(<div data-testid="redirect" />);

    act(() => {
      render(
        <MeContext.Provider
          value={{
            me: null,
            isLoading: true,
            isError: false,
            setMe: setMe,
          }}
        >
          <Login />
        </MeContext.Provider>,
      );
    });

    await waitFor(() => expect(screen.queryByTestId('redirect')).toBeNull());

    // make sure the loader got displayed
    await waitFor(() =>
      expect(screen.queryByTestId('loading')).toBeInTheDocument(),
    );

    expect(signInFunc).not.toBeCalled();
    expect(setMe).not.toBeCalled();
    expect(navigate).not.toBeCalled();
  });

  // it('Should show a login page with a login button if user not logged in', () => {
  //   const loginWithRedirect = jest.fn();
  //   useAuth0O.mockReturnValue({
  //     isAuthenticated: false,
  //     isLoading: false,
  //     loginWithRedirect,
  //   });
  //   Loading.mockReturnValue(<div data-testid="loading" />);
  //   Navigate.mockReturnValue(<div data-testid="redirect" />);

  //   act(() => {
  //     render(<Login />);
  //   });

  //   expect(useAuth0O).toBeCalledTimes(1);

  //   const redirect = screen.queryByTestId('redirect');
  //   expect(redirect).not.toBeInTheDocument();

  //   // make sure the loader wasn't displayed
  //   const loader = screen.queryByTestId('loading');
  //   expect(loader).not.toBeInTheDocument();

  //   const signInButton = screen.queryByText('Login', { exact: false });
  //   expect(signInButton).toBeInTheDocument();

  //   act(() => {
  //     fireEvent.click(signInButton as HTMLElement);
  //   });
  //   expect(loginWithRedirect).toBeCalledTimes(1);
  // });

  // it('Should redirect logged in users', () => {
  //   const loginWithRedirect = jest.fn();
  //   useAuth0O.mockReturnValue({
  //     isAuthenticated: true,
  //     isLoading: false,
  //     loginWithRedirect,
  //   });
  //   Loading.mockReturnValue(<div data-testid="loading" />);
  //   Navigate.mockReturnValue(<div data-testid="redirect" />);

  //   act(() => {
  //     render(<Login />);
  //   });

  //   expect(useAuth0O).toBeCalledTimes(1);

  //   const redirect = screen.queryByTestId('redirect');
  //   expect(redirect).toBeInTheDocument();

  //   // make sure the loader wasn't displayed
  //   const loader = screen.queryByTestId('loading');
  //   expect(loader).not.toBeInTheDocument();

  //   // there should be no login button
  //   const signInButton = screen.queryByText('Login', { exact: false });
  //   expect(signInButton).not.toBeInTheDocument();

  //   expect(loginWithRedirect).toBeCalledTimes(0);
  // });
});
