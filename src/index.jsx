import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ConnectPhantom from './components/ConnectPhantom';
import Auth from './components/Auth'
import ErrorBoundary from './components/ErrorBoundary'; 

import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Main from './components/Main';
  const router = createBrowserRouter([
  {
    path: "/",
    element:<ErrorBoundary><App/></ErrorBoundary>,
    children: [
        {
            path: "/",
            element: <ErrorBoundary><ConnectPhantom /></ErrorBoundary>,
        },
        {
          path: "/auth",
          element: <ErrorBoundary><Auth/></ErrorBoundary>,

        },
        {
          path: "/main",
          element: <ErrorBoundary><Main/></ErrorBoundary>,

        }
      ],
   

  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
      <RouterProvider router={router} />
  );

reportWebVitals();