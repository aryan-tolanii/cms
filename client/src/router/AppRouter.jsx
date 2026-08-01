import { createBrowserRouter, Navigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import Login from "@/pages/Login/Login";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Projects from "@/pages/Projects/Projects";
import CreateProject from "@/pages/CreateProject/CreateProject";
import EditProject from "@/pages/EditProject/EditProject";
import ViewProject from "@/pages/ViewProject/ViewProject";
import NotFound from "@/pages/NotFound/NotFound";

import ProtectedRoute from "@/router/ProtectedRoute";
import GuestRoute from "@/router/GuestRoute";
import RouteErrorBoundary from "@/components/common/RouteErrorBoundary";

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
    ],
  },

  {
    element: <DashboardLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.PROJECT_CREATE,
        element: (
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.PROJECT_EDIT,
        element: (
          <ProtectedRoute>
            <EditProject />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.PROJECT_VIEW,
        element: (
          <ProtectedRoute>
            <ViewProject />
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.PROJECTS,
        element: (
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;