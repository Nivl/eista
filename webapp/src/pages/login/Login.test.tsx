/**
 * @jest-environment jsdom
 */

import { render, screen, act, fireEvent } from '@testing-library/react';

import { Redirect as RedirectOriginal } from 'react-router';
jest.mock('react-router');
const Redirect = RedirectOriginal as jest.Mock;

import { useAuth0 as useAuth0Original } from '@auth0/auth0-react';
jest.mock('@auth0/auth0-react');
const useAuth0O = useAuth0Original as jest.Mock;

import LoadingOriginal from 'components/design-system/Loading';
jest.mock('components/design-system/Loading');
const Loading = LoadingOriginal as jest.Mock;

import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    useAuth0O.mockReset();
    Loading.mockReset();
    Redirect.mockReset();
  });

  it('Should show a loader if fetching user state', () => {
    const loginWithRedirect = jest.fn();
    useAuth0O.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      loginWithRedirect,
    });
    Loading.mockReturnValue(<div data-testid="loading" />);
    Redirect.mockReturnValue(<div data-testid="redirect" />);

    act(() => {
      render(<Login />);
    });

    const redirect = screen.queryByTestId('redirect');
    expect(redirect).not.toBeInTheDocument();

    // make sure the loader got displayed
    const loader = screen.queryByTestId('loading');
    expect(loader).toBeInTheDocument();

    expect(useAuth0O).toBeCalledTimes(1);
    expect(loginWithRedirect).toBeCalledTimes(0);
  });

  it('Should show a login page with a login button if user not logged in', () => {
    const loginWithRedirect = jest.fn();
    useAuth0O.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      loginWithRedirect,
    });
    Loading.mockReturnValue(<div data-testid="loading" />);
    Redirect.mockReturnValue(<div data-testid="redirect" />);

    act(() => {
      render(<Login />);
    });

    expect(useAuth0O).toBeCalledTimes(1);

    const redirect = screen.queryByTestId('redirect');
    expect(redirect).not.toBeInTheDocument();

    // make sure the loader wasn't displayed
    const loader = screen.queryByTestId('loading');
    expect(loader).not.toBeInTheDocument();

    const signInButton = screen.queryByText('Login', { exact: false });
    expect(signInButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(signInButton as HTMLElement);
    });
    expect(loginWithRedirect).toBeCalledTimes(1);
  });

  it('Should redirect logged in users', () => {
    const loginWithRedirect = jest.fn();
    useAuth0O.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      loginWithRedirect,
    });
    Loading.mockReturnValue(<div data-testid="loading" />);
    Redirect.mockReturnValue(<div data-testid="redirect" />);

    act(() => {
      render(<Login />);
    });

    expect(useAuth0O).toBeCalledTimes(1);

    const redirect = screen.queryByTestId('redirect');
    expect(redirect).toBeInTheDocument();

    // make sure the loader wasn't displayed
    const loader = screen.queryByTestId('loading');
    expect(loader).not.toBeInTheDocument();

    // there should be no login button
    const signInButton = screen.queryByText('Login', { exact: false });
    expect(signInButton).not.toBeInTheDocument();

    expect(loginWithRedirect).toBeCalledTimes(0);
  });
});
