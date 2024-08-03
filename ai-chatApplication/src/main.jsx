import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Homepage from './routes/homepage/Homepage.jsx';
import Dashboardpage from './routes/dashboardpage/Dashboardpage.jsx';
import Signin from './routes/signInpage/Signin.jsx';
import Signup from './routes/signUppage/Signup.jsx';
import Chatpage from './routes/chatpage/Chatpage.jsx';
import RootLayout from './layouts/rootlayout/Rootlayout.jsx';
import DashboardLayout from './layouts/dashboardlayout/Dashboardlayout.jsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.log(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboardpage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chatpage />,
          },
        ],
      },
      {
        path: "/sign-in/*",
        element: <Signin />,
      },
      {
        path: "/sign-up/*",
        element: <Signup />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
