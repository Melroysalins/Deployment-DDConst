/* eslint-disable no-nested-ternary */
// @mui
import { Alert, Avatar, Box, Card, Container, Grid, Snackbar, Typography } from '@mui/material'
import Iconify from 'components/Iconify'
import Page from 'components/Page'
import { certificateColors } from 'constant'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getEmployeeDetails, listAllBranches, listAllTeams } from 'supabase'
import * as Yup from 'yup'

// components
// api
// ----------------------------------------------------------------------
const validationSchema = Yup.object().shape({
	name: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
	email_address: Yup.string().email('Must be a valid email').max(255).required('Email is Required').nullable(),
	phone_number: Yup.number().min(6, 'Too Short!').min(18, 'Too long!').required('Required').nullable(),
	team: Yup.string().required('Required').nullable(),
	branch: Yup.string().required('Required').nullable(),
	rating: Yup.string().required('Required').nullable(),
})

const initialValues = {
	name: '',
	email_address: '',
	phone_number: '',
	team: '',
	branch: '',
	rating: '',
}

export default function EmployeeProfile() {
	const [loader, setLoader] = React.useState(false)
	const [toast, setToast] = React.useState(null)
	const { id } = useParams()
	const [edit, setedit] = useState(false)

	useEffect(() => {
		if (id) {
			setedit(true)
		}
	}, [id])

	const navigate = useNavigate()

	const { data: branches } = useQuery(['Branches'], () => listAllBranches())
	const { data: teams } = useQuery(['Teams'], () => listAllTeams())

	const { data: employee } = useQuery(['employee'], () => getEmployeeDetails(id), {
		enabled: !!edit,
		select: (r) => r.data,
	})

	const handleClose = () => {
		setToast(null)
	}

	const AvatarRating = (value) => (
		<div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
			<Avatar sx={{ width: 20, height: 20, fontSize: 12, background: certificateColors[value] }}>{value}</Avatar>{' '}
			<span style={{ color: '#596570' }}>Level of certfication</span>
		</div>
	)

	return (
		<Page title={edit ? 'Edit Employee' : 'Add New Employee'}>
			<Snackbar
				open={toast}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				autoHideDuration={5000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity={toast?.severity} sx={{ width: '100%' }}>
					{toast?.message}
				</Alert>
			</Snackbar>

			<Container maxWidth="xl">
				<Grid container spacing={2} marginTop={1}>
					<Grid height={290} item xs={12}>
						<Card
							style={{
								color: 'rgb(255, 255, 255)',
								background:
									'linear-gradient(rgba(0, 75, 80, 0.8), rgba(0, 75, 80, 0.8)) center center / cover no-repeat, url(https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg)',
								backgroundRepeat: 'no-repeat',
								backgroundSize: 'cover',
								height: '100%',
							}}
						>
							<Box
								position="absolute"
								left={24}
								bottom={12}
								display="flex"
								gap={3}
								xs={12}
								md={6}
								lg={6}
								width={128}
								height={128}
								zIndex={1}
							>
								{/* <Badge
								overlap="circular"
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								badgeContent={<Iconify icon="mdi:pencil-circle" style={{ color: '#ff6b00' }} width={23} height={23} />}
							> */}
								<Avatar alt="avatar image" sx={{ width: '100%', height: '100%' }}>
									<Iconify icon="icon-park-solid:avatar" width={40} height={40} />
								</Avatar>
								{/* </Badge> */}
								<Box marginTop={3}>
									<Typography variant="h4" sx={{ color: 'common.white' }}>
										Employee_CMS
									</Typography>
									<Typography variant="body2" sx={{ color: 'common.white' }}>
										Employee_CMS
									</Typography>
								</Box>
							</Box>
							<Box position="absolute" bottom={0} height={50} width="100%" sx={{ background: '#fff' }} />
						</Card>
					</Grid>
					<Grid item xs={6}>
						<Card style={{ background: '#fff', padding: 10 }}>
							<h4>About us</h4>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									dsf
								</Grid>
								<Grid item xs={12}>
									dsf
								</Grid>
								<Grid item xs={12}>
									dsf
								</Grid>
								<Grid item xs={12}>
									dsf
								</Grid>
							</Grid>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}
