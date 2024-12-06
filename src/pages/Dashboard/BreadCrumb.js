import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Breadcrumbs, Link, Menu, MenuItem, Button as MuiButton, Stack, Typography } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import Iconify from 'components/Iconify'
import _ from 'lodash'
import useMain from 'pages/context/context'
import { MainActionType } from 'pages/context/types'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { listAllProjects } from 'supabase/projects'

export default function CustomSeparator(props) {
	const { state, dispatch } = useMain()
	const [loader, setLoader] = React.useState(true)
	const [data, setData] = React.useState([])
	const [filterData, setfilterData] = React.useState([])
	const [toast, setToast] = React.useState(null)
	const { isfilterOpen } = state.filters || {}
	const { t } = useTranslation()
	const { selected, typeName } = props
	const history = useNavigate()
	const { pathname } = useLocation()
	const pathnames = pathname.split('/').filter((x) => x)
	const basePath = `/${pathnames.slice(0, 2).join('/')}`
	const MainPath = `${basePath}/list`
	pathnames.splice(0, 2)

	const openFilter = () => {
		dispatch({ type: MainActionType.CHANGE_FILTER, bool: !isfilterOpen })
	}

	const fetchData = async () => {
		setLoader(true);
		try {
			const res = await listAllProjects();
			if (res.error) {
				setToast({ severity: 'danger', message: 'Something went wrong!' });
			} else {
				setData(res.data);
				setfilterData(res.data);
			}
		} catch (err) {
			setToast({ severity: 'danger', message: 'Something went wrong!' });
		}
		setLoader(false);
	};
	
	  React.useEffect(() => {
		// Check if there's an `id` in the pathnames for fetching data
		fetchData();
	  }, []); // Dependency array to run effect when pathnames change
	
	  const handleClose = () => {
		setToast(null);
	  };

	return (
		<Stack direction="row" padding={1} spacing={2}>
			{pathname.includes('travel-expenses') && (
				<MuiButton
					size="small"
					variant="contained"
					color={`${isfilterOpen ? 'secondary' : 'inherit'}`}
					sx={{ padding: 1, minWidth: 0, width: 35 }}
					onClick={openFilter}
				>
					<Iconify icon="heroicons-funnel" width={20} height={20} />
				</MuiButton>
			)}
			<Breadcrumbs 
				separator={<NavigateNextIcon fontSize="small" />} 
				aria-label="breadcrumb"
				sx={{ display: 'flex', alignItems: 'center' }}
				>
				<Link onClick={() => history(MainPath)} sx={{ display: 'flex', alignItems: 'center' }}>Main</Link>
				{pathnames.map((name, index) => {
					const routeTo = `${basePath}/${pathnames.slice(0, index + 1).join('/')}`;
					const isLast = index === pathnames.length - 1;
					const id = parseInt(name, 10); // Convert name to an integer ID

					// Find the project that matches the ID
					const project = data.find(proj => proj.id === id);

					if (isLast) {
					return (
						<Typography fontWeight="600" key={name} sx={{ display: 'flex', alignItems: 'center' }}>
						{project ? project.title : _.startCase(name)}
						</Typography>
					);
					}

					return (
					<Link key={name} onClick={() => history(routeTo)} sx={{ display: 'flex', alignItems: 'center' }}>
						{project ? project.title : _.startCase(name)}
					</Link>
					);
				})}
			</Breadcrumbs>

		</Stack>
	)
}

const titles = (name) => {
	switch (name) {
		// case 'add':
		// 	return 'Add New Project'
		case 'list':
			return 'Projects'
		case 'add':
			return 'Add New Employee'
		case 'edit':
			return 'Edit Employee'
		case 'view':
			return 'View Employee'
		case 'emplist':
			return 'Employees'
		case 'teamadd':
			return 'Add New Team'
		case 'teamedit':
			return 'Edit Team'
		case 'teamview':
			return 'View Team'
		case 'teamlist':
			return 'Teams'
		case 'weekly-plan':
			return 'Weekly Process Planning'
		default:
			return 'View Project'
	}
}

const StyledMenu = styled((props) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 180,
		color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
	},
}))

function CustomizedMenus({ option, typeName }) {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	if (option === 'weekly-plan')
		return (
			<Typography
				display="flex"
				direction="row"
				alignItems="center"
				key="3"
				color="text.primary"
				label="Accessories"
				onClick={handleClick}
			>
				{titles(option)}
				<KeyboardArrowDownIcon />
			</Typography>
		)
	return (
		<div>
			

			<StyledMenu
				id="demo-customized-menu"
				MenuListProps={{
					'aria-labelledby': 'demo-customized-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				{typeName ? (
					<>
						<MenuItem selected={option === 'emplist'} onClick={handleClose} disableRipple>
							<Link underline="hover" color="inherit" href={`/${typeName}/employee/emplist`}>
								Employees
							</Link>
						</MenuItem>
						<MenuItem selected={option === 'teamlist'} onClick={handleClose} disableRipple>
							<Link underline="hover" color="inherit" href={`/${typeName}/team/teamlist`}>
								Teams
							</Link>
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem selected={option === 'add'} onClick={handleClose} disableRipple>
							<Link underline="hover" key="11" color="inherit" href="/dashboard/projects/add">
								Add new project
							</Link>
						</MenuItem>
						<MenuItem selected={option === 'list'} onClick={handleClose} disableRipple>
							<Link underline="hover" key="12" color="inherit" href="/dashboard/projects/list">
								Projects list
							</Link>
						</MenuItem>
					</>
				)}
			</StyledMenu>
		</div>
	)
}
