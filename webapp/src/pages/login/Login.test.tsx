import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { wrapper } from 'utils/test-utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
    Navigate: () => <div data-testid="redirect" />,
  };
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
    useSignIn.mockReset();
    mockNavigate.mockReset();
    Loading.mockReturnValue(<div data-testid="loading" />);
  });

  it('Should show a loader if fetching user state', async () => {
    const signInFunc = jest.fn();
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: true,
            isError: false,
            setMe: setMe,
          },
        }),
      });
    });

    // We're not expecting any early returns
    await waitFor(() =>
      expect(screen.queryByTestId('redirect')).not.toBeInTheDocument(),
    );

    // make sure the loader got displayed
    await waitFor(() =>
      expect(screen.queryByTestId('loading')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Sign In' }),
      ).not.toBeInTheDocument(),
    );
    expect(signInFunc).not.toBeCalled();
    expect(setMe).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should redirect if user already logged in', async () => {
    const signInFunc = jest.fn();
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, { wrapper: wrapper() });
    });

    // make sure the redirect happened
    await waitFor(() =>
      expect(screen.queryByTestId('redirect')).toBeInTheDocument(),
    );

    // Nothing else should have happened
    await waitFor(() =>
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Sign In' }),
      ).not.toBeInTheDocument(),
    );
    expect(signInFunc).not.toBeCalled();
    expect(setMe).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should display a form if user not logged in', async () => {
    const signInFunc = jest.fn();
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: setMe,
          },
        }),
      });
    });

    // We're not expecting any early returns
    await waitFor(() =>
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.queryByTestId('redirect')).not.toBeInTheDocument(),
    );

    // We're expecting a form to be rendered with a disabled
    // submit button
    const cta = screen.queryByRole('button', { name: 'Sign In' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    expect(cta).toBeDisabled();

    // Nothing else should have happened
    expect(signInFunc).not.toBeCalled();
    expect(setMe).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should enable the CTA when the form is valid', async () => {
    const signInFunc = jest.fn();
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: setMe,
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign In' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Password');

    // We're expecting a form to be rendered with a disabled
    // submit button
    expect(cta).toBeDisabled();

    // Should still be disabled if only a valid email is filled
    act(() => {
      fireEvent.change(email, { target: { value: 'user@domain.tld' } });
    });
    await waitFor(() => expect(cta).toBeDisabled());

    // Should switched to enabled if both email and password are filled
    act(() => {
      fireEvent.change(password, { target: { value: 'password' } });
    });
    await waitFor(() => expect(cta).toBeEnabled());

    // Nothing else should have happened
    expect(signInFunc).not.toBeCalled();
    expect(setMe).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should show errors if the email is invalid', async () => {
    const signInFunc = jest.fn();
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: setMe,
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign In' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const email = screen.getByLabelText('E-mail');

    // We should not have a "field required" error before the user
    // start typing anything
    await waitFor(() =>
      expect(
        screen.queryByText('Please enter an email address'),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.queryByText('Required')).not.toBeInTheDocument(),
    );

    // Should display an error if the email is invalid
    act(() => {
      fireEvent.change(email, { target: { value: 'invalid' } });
    });
    await waitFor(() =>
      expect(
        screen.queryByText('Please enter a valid email address'),
      ).toBeInTheDocument(),
    );

    // Should display an error if the email is empty
    // This tests must be done after the previous test since the error
    // only shows up after the user started tapping, and then cleared the
    // field
    act(() => {
      fireEvent.change(email, {
        target: { value: '' },
      });
    });
    await waitFor(() =>
      expect(
        screen.queryByText('Please enter an email address'),
      ).toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signInFunc).not.toBeCalled();
    expect(setMe).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should show errors if the password is invalid', async () => {
    const signInFunc = jest.fn();
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: setMe,
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign In' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const password = screen.getByLabelText('Password');

    // We should not have a "field required" error before the user
    // start typing anything
    await waitFor(() =>
      expect(screen.queryByText('Required')).not.toBeInTheDocument(),
    );

    // Should display an error if the email is empty.
    // This tests must add data first since the error
    // only shows up after the user started tapping,
    // and then cleared the field
    act(() => {
      fireEvent.change(password, { target: { value: 'password' } });
    });
    act(() => {
      fireEvent.change(password, {
        target: { value: '' },
      });
    });
    await waitFor(() =>
      expect(screen.queryByText('Required')).toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signInFunc).not.toBeCalled();
    expect(setMe).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should display a server error if there is one', async () => {
    const signInFunc = jest.fn();
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: { response: { errors: [{ message: 'Invalid email/password' }] } },
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: setMe,
          },
        }),
      });
    });

    await waitFor(() =>
      expect(screen.queryByText('Invalid email/password')).toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signInFunc).not.toBeCalled();
    expect(setMe).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should login the user and redirect to the home page', async () => {
    const signInFunc = jest.fn().mockResolvedValue({
      id: '1e5b95e3-ab0f-4b34-a25d-b272bd7575a7',
      name: 'John Doe',
      email: 'john.doe@domai.tld',
    });
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: setMe,
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign In' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Password');

    // Fill in the form with valid data
    act(() => {
      fireEvent.change(email, {
        target: { value: 'user@domain.tld' },
      });
    });
    act(() => {
      fireEvent.change(password, { target: { value: 'password' } });
    });

    // Submit the form
    await waitFor(() => expect(cta).toBeEnabled());
    act(() => {
      fireEvent.click(cta as HTMLElement);
    });

    // Actual validation
    await waitFor(() => expect(signInFunc).toBeCalledTimes(1));
    await waitFor(() => expect(mockNavigate).toBeCalledWith('/'));
  });

  it('Should not crash on server error', async () => {
    // We want the first call to fail, ans the second to pass
    const signInFunc = jest
      .fn()
      .mockRejectedValueOnce(new Error('Async error'))
      .mockResolvedValue({
        id: '1e5b95e3-ab0f-4b34-a25d-b272bd7575a7',
        name: 'John Doe',
        email: 'john.doe@domai.tld',
      });
    const setMe = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<Login />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: setMe,
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign In' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Password');

    // Fill in the form with valid data
    act(() => {
      fireEvent.change(email, {
        target: { value: 'user@domain.tld' },
      });
    });
    act(() => {
      fireEvent.change(password, { target: { value: 'password' } });
    });

    // Submit the form
    await waitFor(() => expect(cta).toBeEnabled());
    act(() => {
      fireEvent.click(cta as HTMLElement);
    });

    // Actual validation
    await waitFor(() => expect(signInFunc).toBeCalledTimes(1));
    await waitFor(() => expect(mockNavigate).not.toBeCalled());

    // Let's try again, it should pass
    await waitFor(() => expect(cta).toBeEnabled());
    act(() => {
      fireEvent.click(cta as HTMLElement);
    });
    await waitFor(() => expect(signInFunc).toBeCalledTimes(2));
    await waitFor(() => expect(mockNavigate).toBeCalledWith('/'));
  });
});
