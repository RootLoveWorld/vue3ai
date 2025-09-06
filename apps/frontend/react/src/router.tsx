import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Users from './pages/Users';
import Organizations from './pages/Organizations';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load the GSAP components
const GsapDemo = React.lazy(() => import('./components/gsap/GsapDemo'));
const GsapDocumentShowcase = React.lazy(() => import('./components/gsap/GsapDocumentShowcase'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: 'documents',
        element: <ProtectedRoute><Documents /></ProtectedRoute>
      },
      {
        path: 'users',
        element: <ProtectedRoute><Users /></ProtectedRoute>
      },
      {
        path: 'organizations',
        element: <ProtectedRoute><Organizations /></ProtectedRoute>
      },
      {
        path: 'settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>
      },
      {
        path: 'gsap-demo',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <GsapDemo />
            </React.Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'gsap-showcase',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <GsapDocumentShowcase />
            </React.Suspense>
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);

export default router;