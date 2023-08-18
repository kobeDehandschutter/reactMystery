import { fireEvent, render, screen, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import routes from './main.routes';
import { IdentityContext } from './contexts/IdentityContext';
import { HomePageDataTestId } from './pages/Home';
import { LoginPageDataTestId } from './pages/Login';

const assertAreOnHome = () => screen.getByTestId(HomePageDataTestId);
const assertAreOnLogin = () => screen.getByTestId(LoginPageDataTestId);

it('renders home by default', () => {
  render(<RouterProvider router={createMemoryRouter(routes)} />);

  assertAreOnHome();
});

it('renders our navbar component', () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/navbar'] });
  render(<RouterProvider router={router} />);

  const nav = screen.getByRole('navigation');
  expect(nav).toHaveClass('navbar', 'navbar-light', 'bg-light');

  const brandLink = screen.getByText('Bootcamp');
  expect(brandLink).toHaveProperty('tagName', 'A');

  const brandImage = within(brandLink).getByAltText('Bootcamp Logo');
  expect(brandImage).toHaveAttribute('src', 'assets/react.svg');

  // Navigates to home when clicked
  fireEvent.click(brandLink);

  assertAreOnHome();
});

describe('anonymous', () => {
  it('renders a login link in the navbar', () => {
    render(<RouterProvider router={createMemoryRouter(routes)} />);

    const nav = screen.getByRole('navigation');

    const logInLink = within(nav).getByRole('link', { name: 'Log In' });
    expect(logInLink).toHaveClass('nav-link');

    fireEvent.click(logInLink);

    assertAreOnLogin();

    expect(screen.queryByRole('link', { name: 'Log Out' })).not.toBeInTheDocument();
  });
});

describe('authenticated', () => {
  it('renders a logout link in the navbar', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <IdentityContext.Provider value={{ currentIdentity: 'someone', setCurrentIdentity: () => {} }}>
        <RouterProvider router={createMemoryRouter(routes)} />
      </IdentityContext.Provider>,
    );

    const nav = screen.getByRole('navigation');

    const logOutLink = within(nav).getByRole('link', { name: 'Log Out' });
    expect(logOutLink).toHaveClass('nav-link');
    expect(logOutLink).toHaveAttribute('href', '/logout');

    expect(screen.queryByRole('link', { name: 'Log In' })).not.toBeInTheDocument();
  });

  it('redirects to home if path is /login', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <IdentityContext.Provider value={{ currentIdentity: 'someone', setCurrentIdentity: () => {} }}>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/login'] })} />
      </IdentityContext.Provider>,
    );

    assertAreOnHome();
  });
});

it('renders notFound if path is anything else', () => {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/anything-else'] })} />);

  screen.getByText('Not Found');
});
