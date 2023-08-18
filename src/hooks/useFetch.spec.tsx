import { render, screen, waitFor } from "@testing-library/react"
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../main.routes";
import { resetHandlers } from "@test/mock-server";
import { rest } from "msw";
import { User } from "../services/userApiClient";

// jest.mock('../services/');

function buildUser(): User {
  return {
    id: 1,
    firstName: 'Tom',
    lastName: 'Marien',
    email: 'tom.marien@euri.com',
    age: 45,
    homeAddress: {
      addressLine: 'Edith Cavelllaan 16',
      city: "Sint-Job-in-'t-Goor",
      zip: 'B2960',
    },
  };
}

it('displays the returned data', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  const user = buildUser()
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.json(user))
  }))

  await waitFor(() => {
    const container = screen.getByTestId('data')
    expect(container).toHaveTextContent(user.firstName )
  })
})

it('displays loading state', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  const user = buildUser()
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.json(user))
  }))

   screen.getByText(/loading.../i)
})


it('displays error state', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.status(404))
  }))


  await waitFor(() => screen.getByText(/error - /i))

})
