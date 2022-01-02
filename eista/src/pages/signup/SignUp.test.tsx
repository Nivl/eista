import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { wrapper } from 'providers/TestProvider';

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

import useSignUpOriginal from 'hooks/useSignUp';
jest.mock('hooks/useSignUp');
const useSignUp = useSignUpOriginal as jest.Mock;

import SignUp from './SignUp';

describe('signUp', () => {
  beforeEach(() => {
    useSignIn.mockReset();
    mockNavigate.mockReset();
    Loading.mockReturnValue(<div data-testid="loading" />);
  });

  it('Should show a loader if fetching user state', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: true,
            isError: false,
            setMe: jest.fn(),
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
        screen.queryByRole('button', { name: 'Sign Up' }),
      ).not.toBeInTheDocument(),
    );

    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should redirect if user already logged in', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, { wrapper: wrapper() });
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
        screen.queryByRole('button', { name: 'Sign Up' }),
      ).not.toBeInTheDocument(),
    );
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should display a form if user not logged in', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
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
    const cta = screen.queryByRole('button', { name: 'Sign Up' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    expect(cta).toBeDisabled();

    // Nothing else should have happened
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should enable the CTA when the form is valid', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign Up' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const name = screen.getByLabelText('Name');
    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Password');
    const passwordAgain = screen.getByLabelText('Password Again');

    // We're expecting a form to be rendered with a disabled
    // submit button
    expect(cta).toBeDisabled();

    act(() => {
      fireEvent.change(name, { target: { value: 'user' } });
    });
    await waitFor(() => expect(cta).toBeDisabled());
    act(() => {
      fireEvent.change(email, { target: { value: 'user@domain.tld' } });
    });
    await waitFor(() => expect(cta).toBeDisabled());
    act(() => {
      fireEvent.change(password, { target: { value: 'password' } });
    });
    await waitFor(() => expect(cta).toBeDisabled());
    act(() => {
      fireEvent.change(passwordAgain, { target: { value: 'password' } });
    });

    // Should switched to enabled once everything has been filled
    await waitFor(() => expect(cta).toBeEnabled());

    // Nothing else should have happened
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should show errors if the name is invalid', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign Up' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const name = screen.getByLabelText('Name');

    // We should not have a "field required" error before the user
    // start typing anything
    await waitFor(() =>
      expect(screen.queryByText('Required')).not.toBeInTheDocument(),
    );

    // Should display an error if the name is too long
    act(() => {
      fireEvent.change(name, { target: { value: '0'.repeat(256) } });
    });
    await waitFor(() =>
      expect(
        screen.queryByText('Name should be less or equal to 255 chars'),
      ).toBeInTheDocument(),
    );
    // Should display an error if the name is empty.
    // This tests must be run after the others since the error
    // only shows up after the user started tapping,
    // and then cleared the field
    act(() => {
      fireEvent.change(name, {
        target: { value: '' },
      });
    });
    await waitFor(() =>
      expect(screen.queryByText('Please enter a name')).toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should show errors if the email is invalid', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign Up' });
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

    // Should display an error if the email is too long
    act(() => {
      fireEvent.change(email, {
        target: { value: `invalid@domain.${'0'.repeat(255)}` },
      });
    });
    await waitFor(() =>
      expect(
        screen.queryByText(
          'E-mail address should be less or equal to 255 chars',
        ),
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
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should show errors if the password is invalid', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign Up' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const password = screen.getByLabelText('Password');

    // We should not have a "field required" error before the user
    // start typing anything
    await waitFor(() =>
      expect(screen.queryByText('Required')).not.toBeInTheDocument(),
    );

    // Should display an error if the password is too long
    act(() => {
      fireEvent.change(password, { target: { value: '0'.repeat(256) } });
    });
    await waitFor(() =>
      expect(
        screen.queryByText('Password should be less or equal to 255 chars'),
      ).toBeInTheDocument(),
    );
    // Should display an error if the password is empty.
    // This tests must be run after the others since the error
    // only shows up after the user started tapping,
    // and then cleared the field
    act(() => {
      fireEvent.change(password, {
        target: { value: '' },
      });
    });
    await waitFor(() =>
      expect(screen.queryByText('Required')).toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it(`Should show errors if the passwords don't match`, async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign Up' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const password = screen.getByLabelText('Password');
    const passwordAgain = screen.getByLabelText('Password Again');

    // Invalid PasswordAgain should throw an error
    act(() => {
      fireEvent.change(password, {
        target: { value: 'password' },
      });
    });
    act(() => {
      fireEvent.change(passwordAgain, {
        target: { value: 'password Again' },
      });
    });
    await waitFor(() =>
      expect(screen.queryByText(`Password don't match`)).toBeInTheDocument(),
    );

    // Fixing passwordAgain should clear the error
    act(() => {
      fireEvent.change(passwordAgain, {
        target: { value: 'password' },
      });
    });
    await waitFor(() =>
      expect(
        screen.queryByText(`Password don't match`),
      ).not.toBeInTheDocument(),
    );

    // Changing password should throw an error again
    act(() => {
      fireEvent.change(password, {
        target: { value: 'passwor' },
      });
    });
    await waitFor(() =>
      expect(screen.queryByText(`Password don't match`)).toBeInTheDocument(),
    );

    // Fixing password should clear the error
    act(() => {
      fireEvent.change(password, {
        target: { value: 'password' },
      });
    });
    await waitFor(() =>
      expect(
        screen.queryByText(`Password don't match`),
      ).not.toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should display a server error if there is one', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: { response: { errors: [{ message: 'Server Error' }] } },
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    await waitFor(() =>
      expect(screen.queryByText('Server Error')).toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should hide the signUp button when signing Up', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: true,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Sign Up' }),
      ).not.toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should hide the signUp button when signing in', async () => {
    const signUpFunc = jest.fn();
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: true,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Sign Up' }),
      ).not.toBeInTheDocument(),
    );

    // Nothing else should have happened
    expect(signUpFunc).not.toBeCalled();
    expect(signInFunc).not.toBeCalled();
    expect(mockNavigate).not.toBeCalled();
  });

  it('Should signUp, signIn, the redirect the user to the home page', async () => {
    const signUpFunc = jest.fn().mockResolvedValue({
      id: '1e5b95e3-ab0f-4b34-a25d-b272bd7575a7',
      name: 'John Doe',
      email: 'john.doe@domai.tld',
    });
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn();
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign Up' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const name = screen.getByLabelText('Name');
    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Password');
    const passwordAgain = screen.getByLabelText('Password Again');

    // Fill in the form with valid data

    act(() => {
      fireEvent.change(name, { target: { value: 'John Doe' } });
    });
    act(() => {
      fireEvent.change(email, {
        target: { value: 'user@domain.tld' },
      });
    });
    act(() => {
      fireEvent.change(password, { target: { value: 'password' } });
    });
    act(() => {
      fireEvent.change(passwordAgain, { target: { value: 'password' } });
    });

    // Submit the form
    await waitFor(() => expect(cta).toBeEnabled());
    act(() => {
      fireEvent.click(cta as HTMLElement);
    });

    // Actual validation
    await waitFor(() => expect(signUpFunc).toBeCalledTimes(1));
    await waitFor(() => expect(signInFunc).toBeCalledTimes(1));
    await waitFor(() => expect(mockNavigate).toBeCalledWith('/'));
  });

  it('Should not crash on server error', async () => {
    // We want the first call to fail, ans the second to pass
    const signUpFunc = jest
      .fn()
      .mockRejectedValueOnce(new Error('Async error'))
      .mockResolvedValue(true);
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn().mockResolvedValue({
      id: '1e5b95e3-ab0f-4b34-a25d-b272bd7575a7',
      name: 'John Doe',
      email: 'john.doe@domai.tld',
    });
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign Up' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const name = screen.getByLabelText('Name');
    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Password');
    const passwordAgain = screen.getByLabelText('Password Again');

    // Fill in the form with valid data
    act(() => {
      fireEvent.change(name, { target: { value: 'John Doe' } });
    });
    act(() => {
      fireEvent.change(email, {
        target: { value: 'user@domain.tld' },
      });
    });
    act(() => {
      fireEvent.change(password, { target: { value: 'password' } });
    });
    act(() => {
      fireEvent.change(passwordAgain, { target: { value: 'password' } });
    });

    // Submit the form
    await waitFor(() => expect(cta).toBeEnabled());
    act(() => {
      fireEvent.click(cta as HTMLElement);
    });

    // Actual validation
    await waitFor(() => expect(signUpFunc).toBeCalledTimes(1));
    await waitFor(() => expect(mockNavigate).not.toBeCalled());

    // Let's try again, it should pass
    await waitFor(() => expect(cta).toBeEnabled());
    act(() => {
      fireEvent.click(cta as HTMLElement);
    });
    await waitFor(() => expect(signUpFunc).toBeCalledTimes(2));
    await waitFor(() => expect(signInFunc).toBeCalledTimes(1));
    await waitFor(() => expect(mockNavigate).toBeCalledWith('/'));
  });

  it('Should redirect to login page on signIn error', async () => {
    // We want the first call to fail, ans the second to pass
    const signUpFunc = jest.fn().mockResolvedValue(true);
    useSignUp.mockReturnValue({
      isLoading: false,
      error: null,
      signUp: signUpFunc,
    });

    const signInFunc = jest.fn().mockRejectedValue(new Error('Async error'));
    useSignIn.mockReturnValue({
      isLoading: false,
      error: null,
      signIn: signInFunc,
    });

    act(() => {
      render(<SignUp />, {
        wrapper: wrapper({
          meProvider: {
            me: null,
            isLoading: false,
            isError: false,
            setMe: jest.fn(),
          },
        }),
      });
    });

    const cta = screen.queryByRole('button', { name: 'Sign Up' });
    await waitFor(() => expect(cta).toBeInTheDocument());
    const name = screen.getByLabelText('Name');
    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Password');
    const passwordAgain = screen.getByLabelText('Password Again');

    // Fill in the form with valid data
    act(() => {
      fireEvent.change(name, { target: { value: 'John Doe' } });
    });
    act(() => {
      fireEvent.change(email, {
        target: { value: 'user@domain.tld' },
      });
    });
    act(() => {
      fireEvent.change(password, { target: { value: 'password' } });
    });
    act(() => {
      fireEvent.change(passwordAgain, { target: { value: 'password' } });
    });

    // Submit the form
    await waitFor(() => expect(cta).toBeEnabled());
    act(() => {
      fireEvent.click(cta as HTMLElement);
    });

    // Actual validation
    await waitFor(() => expect(signUpFunc).toBeCalledTimes(1));
    await waitFor(() => expect(signInFunc).toBeCalledTimes(1));
    await waitFor(() => expect(mockNavigate).toBeCalledWith('/login'));
  });
});
