// eslint-disable-next-line no-unused-vars
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';

// import pages
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import InsertItem from '../pages/InsertItem';

// import components
import Header from '../components/Header';
import ProtectedRoute from '../components/ProtectedRoute';

// Import context
import { AuthProvider } from '../auth/AuthContext';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/insert-item',
        element: (
          <ProtectedRoute>
            <InsertItem />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: '/server-error',
      //   element: (
      //     <ProtectedRoute>
      //       <ServerError />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '*',
      //   element: <PageNotFound />,
      // },
    ],
  },
]);

const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;
