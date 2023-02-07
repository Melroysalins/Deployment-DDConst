// component
import Iconify from '../../components/Iconify'

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />

const navConfig = [
	{
		title: 'dashboard',
		path: '/dashboard/projects/list',
		icon: getIcon('eva:pie-chart-2-fill'),
	},
	//   {
	//     title: 'workforce planning',
	//     path: '/dashboard/workforce-planning',
	//     icon: getIcon('icon-park-solid:plan'),
	//   },
	//   {
	//     title: 'project travel expense',
	//     path: '/dashboard/travel-expense',
	//     icon: getIcon('icon-park-solid:plan'),
	//   },
	//   {
	//     title: 'project implementation schedule',
	//     path: '/dashboard/project-schedule',
	//     icon: getIcon('icon-park-solid:plan'),
	//   },
	//   {
	//   title: 'Travel Expenses',
	//   path: '/dashboard/travel-expenses',
	//   icon: getIcon('zondicons:travel-taxi-cab'),
	// },
	{
		title: 'Hr/Admin',
		path: '/dashboard/hr-admin',
		icon: getIcon('clarity:administrator-solid'),
		target_blank: true,
	},
	// {
	//   title: 'product',
	//   path: '/dashboard/products',
	//   icon: getIcon('eva:shopping-bag-fill'),
	// },
	// {
	//   title: 'blog',
	//   path: '/dashboard/blog',
	//   icon: getIcon('eva:file-text-fill'),
	// },
	// {
	//   title: 'login',
	//   path: '/login',
	//   icon: getIcon('eva:lock-fill'),
	// },
	// {
	//   title: 'register',
	//   path: '/register',
	//   icon: getIcon('eva:person-add-fill'),
	// },
	{
		title: 'logout',
		path: '/logout',
		icon: getIcon('material-symbols:logout'),
	},
	// {
	//   title: 'Not found',
	//   path: '/404',
	//   icon: getIcon('eva:alert-triangle-fill'),
	// },
]

export default navConfig
