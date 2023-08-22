/* eslint-disable no-nested-ternary */
// @mui
import { Alert, Avatar, Box, Card, Container, Grid, Input, Snackbar, Stack, Typography } from '@mui/material'
import Iconify from 'components/Iconify'
import Page from 'components/Page'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getEmployeeDetails, updateEmployee } from 'supabase'
import { addFile, getFile } from 'supabaseClient'
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

	const { data: employee, refetch } = useQuery(['employee'], () => getEmployeeDetails(id), {
		enabled: !!edit,
		select: (r) => r.data,
	})

	const { data: profile_url, refetch: refetchProfile } = useQuery(
		['employee profile', employee?.profile],
		({ queryKey }) => getFile(queryKey[1], 'profile_images'),
		{
			enabled: !!employee,
		}
	)

	const handleClose = () => {
		setToast(null)
	}

	const handleImageChange = async (e) => {
		try {
			if (e.target.files.length > 0) {
				const file = e.target.files[0]
				const file_extension = file.name.split('.').pop()
				const filename = `employee_profile_${employee?.id}.${file_extension}`
				const { data, error } = await addFile(filename, file, 'profile_images')
				if (data) await updateEmployee({ profile: filename }, employee?.id)
				await refetch()
				await refetchProfile()
			}
		} catch (err) {
			console.log(err)
			setToast({ severity: 'error', message: 'Something went wrong, Please try again later!' })
		}
	}

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
							<Box position="absolute" left={24} bottom={12} display="flex" gap={3} xs={12} md={6} lg={6} zIndex={1}>
								{/* <Badge
								overlap="circular"
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								badgeContent={<Iconify icon="mdi:pencil-circle" style={{ color: '#ff6b00' }} width={23} height={23} />}
							> */}
								<Box
									overflow="hidden"
									borderRadius="100%"
									component="label"
									htmlFor="profile"
									position="relative"
									width={128}
									height={128}
								>
									<Avatar
										src={profile_url}
										alt={employee?.name}
										sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
									/>
									<Box
										sx={{
											position: 'absolute',
											width: '100%',
											height: '100%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexDirection: 'column',
											top: 0,
											left: 0,
											opacity: 0,
											color: 'rgb(255, 255, 255)',
											background: 'rgba(22, 28, 36, 0.64)',
											transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

											gap: 0.5,
											'&:hover': {
												opacity: 0.75,
											},
											zIndex: 2,
										}}
									>
										<Iconify icon="mdi:camera" width={30} height={30} />
										<Typography variant="body2">Update Photo</Typography>
									</Box>
									<Input onChange={handleImageChange} sx={{ visibility: 'hidden' }} type="file" id="profile" />
								</Box>
								{/* </Badge> */}
								<Box marginTop={3}>
									<Typography variant="h4" sx={{ color: 'common.white' }}>
										{employee?.name}
									</Typography>
									<Typography variant="body2" sx={{ color: 'common.white' }}>
										{employee?.email_address}
									</Typography>
								</Box>
							</Box>
							<Box position="absolute" bottom={0} height={50} width="100%" sx={{ background: '#fff' }} />
						</Card>
					</Grid>
					<Grid item xs={6}>
						<Card style={{ background: '#fff', padding: 10 }}>
							<Stack gap={2} px={2} py={1}>
								<Stack direction="row" gap={2}>
									<Typography variant="h6">About {employee?.name}</Typography>
								</Stack>
								<Stack direction="row" gap={2}>
									<Iconify icon="mdi:phone" width={24} height={24} />
									<Typography variant="body2">{employee?.phone_number}</Typography>
								</Stack>
								<Stack direction="row" gap={2}>
									<Iconify icon="mdi:email" width={24} height={24} />
									<Typography variant="body2">{employee?.email_address}</Typography>
								</Stack>
								<Stack direction="row" gap={2}>
									<Iconify icon="mdi:star" width={24} height={24} />
									<Typography variant="body2">Rating: {employee?.rating ?? 'NA'}</Typography>
								</Stack>
								<Stack direction="row" gap={2}>
									<Iconify icon="mdi:build" width={24} height={24} />
									<Typography variant="body2">Project: {employee?.project ?? 'NA'}</Typography>
								</Stack>
								<Stack direction="row" gap={2}>
									<Iconify icon="mdi:people" width={24} height={24} />
									<Typography variant="body2">Team: {employee?.team ?? 'NA'}</Typography>
								</Stack>
							</Stack>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}
