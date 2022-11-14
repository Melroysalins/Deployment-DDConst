import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import { Projects as ProjectList, CreateNewProject, ProjectDetails } from './pages/Dashboard';
import ProjectLayout from './pages/Dashboard/ProjectLayout';
import WorkforcePlanning from './pages/WorkforcePlanning/WorkforcePlanning';
import TravelExpenses from './pages/TravelExpenses/TravelExpenses';
import ProjectImplementationSchedule from './pages/ProjectImplementationSchedule';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        {
          path: 'projects',
          element: <ProjectLayout />,
          children: [
            { path: '', element: <ProjectList /> },

            { path: 'add', element: <CreateNewProject /> },
            { path: ':id', element: <ProjectDetails /> },
          ],
        },

        { path: 'workforce-planning', element: <WorkforcePlanning /> },
        { path: 'travel-expenses', element: <TravelExpenses /> },
        { path: 'project-schedule', element: <ProjectImplementationSchedule /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/projects" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
