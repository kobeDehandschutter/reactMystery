import { mocked } from 'jest-mock';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import UserCounterBadge from './UserCounterBadge';
import * as userApiClient from '../services/userApiClient';

jest.mock('../services/userApiClient');

beforeEach(() => {
  mocked(userApiClient).list.mockResolvedValue({
    items: [],
    total: 4,
  });
});

afterEach(() => jest.clearAllMocks());

it('renders by default in loading state', async () => {
  render(<UserCounterBadge />);

  const badge = screen.getByText(/counting users/i);
  expect(badge).toHaveClass('badge', 'rounded-pill', 'bg-warning');

  await waitForElementToBeRemoved(() => screen.queryByText(/counting users/i));
});

it('renders the total amount of users', async () => {
  render(<UserCounterBadge />);

  const badge = await screen.findByText(/4 users/i);
  expect(badge).toHaveClass('badge', 'rounded-pill', 'bg-success');

  expect(mocked(userApiClient).list).toHaveBeenCalledTimes(1);
  expect(mocked(userApiClient).list).toHaveBeenCalledWith({ pageSize: 1 }, expect.anything());
});

it('renders an error message if something goes wrong', async () => {
  mocked(userApiClient).list.mockRejectedValue(new Error('oh noes'));

  render(<UserCounterBadge />);

  const badge = await screen.findByText(/oepsie users foetsie/i);
  expect(badge).toHaveClass('badge', 'rounded-pill', 'bg-danger');
});
