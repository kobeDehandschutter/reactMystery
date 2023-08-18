import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import routes from '../main.routes';
import { render, screen } from '@testing-library/react';
import * as translation from '../hooks/useTranslation';
import { mocked } from 'jest-mock';

jest.mock('../hooks/useTranslation.ts');

describe('test multilanguage home page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('default should be english', () => {
    mocked(translation).default.mockReturnValue(() => 'Home');
    render(<RouterProvider router={createMemoryRouter(routes)} />);

    screen.getByRole('heading', { name: 'Home' });
    expect(translation.default).toHaveBeenCalledTimes(1);
  });
  it('should be dutch', () => {
    mocked(translation).default.mockReturnValue(() => 'Thuis');
    render(<RouterProvider router={createMemoryRouter(routes)} />);
    screen.getByRole('heading', { name: 'Thuis' });
    expect(translation.default).toHaveBeenCalledTimes(1);
  });
});
