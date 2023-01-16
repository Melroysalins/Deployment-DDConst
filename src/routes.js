import { Navigate, useRoutes } from 'react-router-dom'
// layouts
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'
//
import Blog from './pages/Blog'
import User from './pages/User'
import Login from './pages/Login'
import NotFound from './pages/Page404'
import Register from './pages/Register'
import Products from './pages/Products'
import { Projects as ProjectList, AddNewProject, ProjectDetails } from './pages/Dashboard'
import ProjectLayout from './pages/Dashboard/ProjectLayout'
import WorkforcePlanning from './pages/WorkforcePlanning/WorkforcePlanning'
import TravelExpenses from './pages/Dashboard/TravelExpenses/TELayout'
import ProjectImplementationSchedule from './pages/ProjectImplementationSchedule'
import HrAdmin from 'pages/HrAdmin'
import useMain from 'pages/context/context'

// ----------------------------------------------------------------------

export default function Router() {
	const { user } = useMain()
	return useRoutes([
		{
			path: '/dashboard',
			element: user ? <DashboardLayout /> : <Navigate to="/login" />,
			children: [
				{
					path: 'projects',
					element: <ProjectLayout />,
					children: [
						{ path: 'list', element: <ProjectList /> },
						{ path: ':id/travel-expenses', element: <TravelExpenses /> },

						{ path: 'add', element: <AddNewProject /> },
						{ path: ':id', element: <ProjectDetails /> },
					],
				},

				{ path: 'workforce-planning', element: <WorkforcePlanning /> },
				{ path: 'project-schedule', element: <ProjectImplementationSchedule /> },
				{ path: 'user', element: <User /> },
				{ path: 'products', element: <Products /> },
				{ path: 'blog', element: <Blog /> },
				{ path: 'hr-admin', element: <HrAdmin /> },
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
				{ path: '/', element: <Navigate to="/dashboard/projects/list" /> },
				{ path: '404', element: <NotFound /> },
				{ path: '*', element: <Navigate to="/404" /> },
			],
		},
		{
			path: '*',
			element: <Navigate to="/404" replace />,
		},
	])
}
