import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import routes from '../main.routes';
import { render, screen } from '@testing-library/react';
import { IdentityContext } from '../contexts/IdentityContext';

it('renders by default', () => {
  render(<RouterProvider router={createMemoryRouter(routes)} />);

  screen.getByRole('heading', { name: 'Home' });

  const loginLink = screen.getByRole('link', { name: 'login' });
  expect(loginLink).toHaveAttribute('href', '/login');
});

it('renders a personalised greeting when authenticated', () => {
  render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <IdentityContext.Provider value={{ currentIdentity: 'tester', setCurrentIdentity: () => {} }}>
      <RouterProvider router={createMemoryRouter(routes)} />
    </IdentityContext.Provider>,
  );

  expect(screen.queryByRole('link', { name: 'login' })).not.toBeInTheDocument();

  screen.getByText('Welcome, tester');
});
