import { RenderOptions, render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mocked } from 'jest-mock';

import routes from '../main.routes';
import { HomePageDataTestId } from './Home';
import { IdentityContext } from '../contexts/IdentityContext';
import { authenticate } from '../services/authService';

jest.mock('../services/authService');

const getUsernameInput = () => screen.getByLabelText('Username');
const getPasswordInput = () => screen.getByLabelText('Password');
const getSubmit = () => screen.getByRole('button', { name: 'Login' });

const renderLogin = (options?: RenderOptions) =>
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/login'] })} />, options);

const fillInForm = async ({
  username = 'user',
  password = 'pass',
}: Partial<{ username: string; password: string }> = {}) => {
  const usernameInput = getUsernameInput();
  const passwordInput = getPasswordInput();

  await userEvent.type(usernameInput, username);
  await userEvent.type(passwordInput, password);
};

afterEach(() => jest.clearAllMocks());

it('renders by default a heading and a form to login', () => {
  renderLogin();

  screen.getByRole('heading', { name: 'Log in to Bootcamp' });

  const username = getUsernameInput();
  expect(username).toHaveValue('');
  expect(username).toHaveClass('form-control');

  const password = getPasswordInput();
  expect(password).toHaveValue('');
  expect(password).toHaveClass('form-control');

  const submit = getSubmit();
  expect(submit).toHaveClass('btn-primary');
  expect(submit).toHaveAttribute('type', 'submit');
});

it('focusses the username by default', () => {
  renderLogin();

  const username = getUsernameInput();
  expect(username).toHaveFocus();
});

it('set the current identity when authentication succeeds', async () => {
  const setCurrentIdentity = jest.fn();

  mocked(authenticate).mockImplementation(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      }),
  );

  renderLogin({
    wrapper: ({ children }) => (
      <IdentityContext.Provider value={{ currentIdentity: null, setCurrentIdentity }}>
        {children}
      </IdentityContext.Provider>
    ),
  });

  const submit = getSubmit();

  const username = 'admin';
  const password = 'pass';

  await fillInForm({ username, password });
  await userEvent.click(submit);

  expect(authenticate).toHaveBeenCalledWith(username, password);
  expect(authenticate).toHaveBeenCalledTimes(1);

  expect(submit).toBeDisabled();

  await waitFor(() => expect(setCurrentIdentity).toHaveBeenCalledWith(username));
});

it('reset the form and informs the user if authentication fails', async () => {
  const setCurrentIdentity = jest.fn();

  mocked(authenticate).mockResolvedValue(false);

  renderLogin({
    wrapper: ({ children }) => (
      <IdentityContext.Provider value={{ currentIdentity: null, setCurrentIdentity }}>
        {children}
      </IdentityContext.Provider>
    ),
  });

  await fillInForm();

  const submit = getSubmit();
  await userEvent.click(submit);

  expect(authenticate).toHaveBeenCalledTimes(1);

  const usernameInput = getUsernameInput();
  const passwordInput = getPasswordInput();

  expect(usernameInput).toHaveValue('');
  expect(passwordInput).toHaveValue('');

  const alert = screen.getByRole('alert');
  expect(alert).toHaveClass('alert-danger');
  expect(alert).toHaveTextContent('Unknown username or password');
});

it('redirects to home if path is /login and already authenticated', () => {
  render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <IdentityContext.Provider value={{ currentIdentity: 'someone', setCurrentIdentity: () => {} }}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/login'] })} />
    </IdentityContext.Provider>,
  );

  screen.getByTestId(HomePageDataTestId);
});
