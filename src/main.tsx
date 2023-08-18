// src/main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './main.routes';
import { DefaultIdentityContextProvider } from './contexts/IdentityContext';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DefaultIdentityContextProvider>
      <RouterProvider router={router} />
    </DefaultIdentityContextProvider>
  </React.StrictMode>,
);
