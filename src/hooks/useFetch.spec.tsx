import { render, screen, waitFor } from "@testing-library/react"
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../main.routes";
import { resetHandlers } from "@test/mock-server";
import { rest } from "msw";
import { User } from "../services/userApiClient";
import userEvent from "@testing-library/user-event"

function buildUser(name = "Tom"): User {
  return {
    id: 1,
    firstName: name,
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

const getLoadingContainer = () => screen.getByText(/loading.../i)
const getErrorContainer = () => screen.getByText(/error - /i)
const getDataContainer = () => screen.getByTestId('data')

it('displays the returned data', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  const user = buildUser()
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.json(user))
  }))

  await waitFor(() => {
    const container = getDataContainer()
    expect(container).toHaveTextContent(user.firstName )
  })
})

it('displays loading state', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  const user = buildUser()
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.json(user))
  }))

   getLoadingContainer()
})


it('displays error state', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.status(404))
  }))

  await waitFor(() => getErrorContainer())

})

it('tests change user button', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  const user1 = buildUser()
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.json(user1))
  }))


  let loading = getLoadingContainer()

  //validate the first user
  await waitFor(() => {
    const container = getDataContainer()
    expect(container).toHaveTextContent(user1.firstName )
    expect(loading).not.toBeInTheDocument()
  })

  //mock second user request
  const user2 = buildUser("Kobe")
  resetHandlers(rest.get('*/users/2', (_req, res, ctx) => {
    return res(ctx.json(user2))
  }))

  //click btn to change user
  const btn = screen.getByRole('button', {name: /change url/i})
  userEvent.click(btn)

  //should be loading again
  await waitFor(() => {
    loading = getLoadingContainer()
  })

  //loading done => user 2 should be loaded
  await waitFor(() => {
    const container = getDataContainer()
    expect(loading).not.toBeInTheDocument()
    expect(container).toHaveTextContent(user2.firstName)
  })
})

it('displays error state', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.status(404))
  }))

  await waitFor(() => getErrorContainer())

})

it('tests refresh button', async () => {
  render( <RouterProvider router={createMemoryRouter(routes)} />);
  const user = buildUser()
  resetHandlers(rest.get('*/users/1', (_req, res, ctx) => {
    return res(ctx.json(user))
  }))

  let loading = getLoadingContainer()

  //validate the first user
  await waitFor(() => {
    const container = getDataContainer()
    expect(container).toHaveTextContent(user.firstName )
    expect(loading).not.toBeInTheDocument()
  })

  //click btn to refresh user
  const btn = screen.getByRole('button', {name: /refresh/i})
  userEvent.click(btn)

  //should be loading again
  await waitFor(() => {
    loading = getLoadingContainer()
  })

  //loading done => user 1 should be loaded again
  await waitFor(() => {
    const container = getDataContainer()
    expect(loading).not.toBeInTheDocument()
    expect(container).toHaveTextContent(user.firstName)
  })
})
