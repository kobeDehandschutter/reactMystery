import { render, screen, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import routes from '../main.routes';
import { UserDetailPageDataTestId } from './UserDetail';

it('renders by default', () => {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/users/3'] })} />);

  const page = screen.getByTestId(UserDetailPageDataTestId);

  // Most easy way i could think of ;)
  expect(page).toHaveAttribute('data-userid', '3');

  within(page).getByRole('heading', { name: 'User Detail' });
});
