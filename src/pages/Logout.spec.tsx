import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import routes from '../main.routes';
import { HomePageDataTestId } from './Home';
import { IdentityContext } from '../contexts/IdentityContext';

it('redirects to home', () => {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/logout'] })} />);

  screen.getByTestId(HomePageDataTestId);
});

it('it clears current identity', () => {
  const setCurrentIdentity = jest.fn();

  render(
    <IdentityContext.Provider value={{ currentIdentity: 'nevermind', setCurrentIdentity }}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/logout'] })} />
    </IdentityContext.Provider>,
  );

  expect(setCurrentIdentity).toHaveBeenCalledTimes(1);
  expect(setCurrentIdentity).toHaveBeenCalledWith(null);
});
