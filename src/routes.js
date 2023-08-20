import { Navigate, useRoutes } from 'react-router-dom'
// layouts
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'
//
import useMain from 'pages/context/context'
import HrAdmin from 'pages/HrAdmin'
import AddEmployee from 'pages/ManageEmps/Employee/AddEmployee'
import EmployeeList from 'pages/ManageEmps/Employee/EmployeeList'
import EmployeeProfile from 'pages/ManageEmps/Employee/Profile'
import MangeEmpLayout from 'pages/ManageEmps/MangeEmpLayout'
import AddTeam from 'pages/ManageEmps/Team/AddTeam'
import TeamList from 'pages/ManageEmps/Team/TeamList'
import Blog from './pages/Blog'
import { AddNewProject, ProjectDetails, Projects as ProjectList } from './pages/Dashboard'
import ProjectLayout from './pages/Dashboard/ProjectLayout'
import TravelExpenses from './pages/Dashboard/TravelExpenses/TELayout'
import Login from './pages/Login'
import NotFound from './pages/Page404'
import Products from './pages/Products'
import ProjectImplementationSchedule from './pages/ProjectImplementationSchedule'
import Register from './pages/Register'
import User from './pages/User'
import WeeklyPlan from './pages/WeeklyPlan/WeeklyPlan'
import WorkforcePlanning from './pages/WorkforcePlanning/WorkforcePlanning'
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

						{ path: ':id/weekly-plan', element: <WeeklyPlan /> },
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
						{ path: '', element: <EmployeeList /> },
						{ path: 'emplist', element: <EmployeeList /> },
						{ path: 'add', element: <AddEmployee /> },
						{ path: 'edit/:id', element: <AddEmployee /> },
						{ path: 'view/:id', element: <EmployeeProfile /> },
					],
				},
				{
					path: 'team',
					element: <MangeEmpLayout />,
					children: [
						{ path: '', element: <TeamList /> },
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
