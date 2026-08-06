import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import { ROUTES } from "@/constants/routes";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

const Login = lazy(() => import("@/pages/Login/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const Projects = lazy(() => import("@/pages/Projects/Projects"));
const CreateProject = lazy(() => import("@/pages/CreateProject/CreateProject"));
const EditProject = lazy(() => import("@/pages/EditProject/EditProject"));
const ViewProject = lazy(() => import("@/pages/ViewProject/ViewProject"));
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));

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
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
              <Login />
            </Suspense>
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
            <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8">Loading page...</div>}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.PROJECT_CREATE,
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8">Loading page...</div>}>
              <CreateProject />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.PROJECT_EDIT,
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8">Loading page...</div>}>
              <EditProject />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.PROJECT_VIEW,
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8">Loading page...</div>}>
              <ViewProject />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: ROUTES.PROJECTS,
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8">Loading page...</div>}>
              <Projects />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "*",
    element: (
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;