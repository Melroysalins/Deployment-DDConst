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
import MangeEmpLayout from 'pages/Dashboard/ManageEmps/MangeEmpLayout'
import AddEmployee from 'pages/Dashboard/ManageEmps/Employee/AddEmployee'
import EmployeeList from 'pages/Dashboard/ManageEmps/Employee/EmployeeList'
import TeamList from 'pages/Dashboard/ManageEmps/Team/TeamList'
import AddTeam from 'pages/Dashboard/ManageEmps/Team/AddTeam'

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
						{ path: 'edit/:id', element: <AddNewProject edit /> },
						{ path: ':id', element: <ProjectDetails /> },
					],
				},

				{ path: 'workforce-planning', element: <WorkforcePlanning /> },
				{ path: 'project-schedule/:project', element: <ProjectImplementationSchedule /> },
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
			path: '/manageEmp',
			element: user ? <DashboardLayout /> : <Navigate to="/login" />,
			children: [
				{
					path: 'employee',
					element: <MangeEmpLayout />,
					children: [
						{ path: 'emplist', element: <EmployeeList /> },
						{ path: 'empadd', element: <AddEmployee /> },
						{ path: 'empedit/:id', element: <AddEmployee /> },
						{ path: 'empview/:id', element: <AddEmployee /> },
					],
				},
				{
					path: 'team',
					element: <MangeEmpLayout />,
					children: [
						{ path: 'teamlist', element: <TeamList /> },
						{ path: 'teamadd', element: <AddTeam /> },
						{ path: 'teamedit/:id', element: <AddTeam /> },
						{ path: 'teamview/:id', element: <AddTeam /> },
					],
				},
			],
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
