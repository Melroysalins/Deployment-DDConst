import {
	Box,
	Button,
	MenuItem,
	Stack,
	Select,
	FormControl,
	InputLabel,
	Typography,
	AvatarGroup,
	Avatar,
	Divider,
	Badge,
} from '@mui/material'
import Iconify from 'components/Iconify'
import React, { useState } from 'react'
import { ApprovalStatus } from 'constant'
import useMain from 'pages/context/context'
import { useTranslation } from 'react-i18next'
import { colorApprovalTask } from 'pages/WeeklyPlan/WeeklyPlan'
import BasicDateRangePicker from 'components/DatePicker'
import AddIcon from '@mui/icons-material/Add'
import { fDateLocale, getDateTimeEngKorean } from 'utils/formatTime'
import { deepPurple } from '@mui/material/colors'
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp'
import ExpandLessSharpIcon from '@mui/icons-material/ExpandLessSharp'

const defaultFilters = {
	date: [Date.now(), Date.now()],
	status: ApprovalStatus.Planned,
	owner: [],
	approvers: [],
}

// eslint-disable-next-line react/prop-types
function Approvals({ setopen }) {
	const { t, i18n } = useTranslation()
	const { setopenRequestApproval } = useMain()
	const isEng = i18n.language === 'en'
	const [openFilter, setopenFilter] = useState(false)
	const [filters, setfilters] = useState(defaultFilters)
	const [openSelectApproval, setopenSelectApproval] = useState(false)

	const handleNewRequest = () => {
		setopen(false)
		setopenRequestApproval(true)
	}

	return (
		<Box>
			<Typography sx={{ fontSize: 12 }} mb={1}>
				{t('search_by_date_range')}
			</Typography>
			<Stack direction="row" gap={'10px'} alignItems={'center'}>
				<BasicDateRangePicker
					valueRange={filters.date}
					setvalueRange={(e) => setfilters({ ...filters, date: e })}
					startLabel={t('start')}
					endLabel={t('end')}
				/>

				<Button
					size="small"
					variant="contained"
					color="inherit"
					sx={{
						minWidth: 32,
						width: 32,
						padding: '5px',
						background: openFilter ? '#6AC79B' : `inherit`,
						color: openFilter ? 'white' : `#212B36`,
					}}
					onClick={() => setopenFilter(!openFilter)}
				>
					<Iconify icon="heroicons-funnel" width={23} height={23} />
				</Button>
			</Stack>

			{openFilter && (
				<Box>
					<Typography sx={{ fontSize: 12, marginTop: '5px' }} mb={1}>
						{t('status')}
					</Typography>
					<FormControl fullWidth>
						<InputLabel>{t('status')}</InputLabel>
						<Select
							value={filters.status}
							onChange={(e) => setfilters({ ...filters, status: e.target.value })}
							label={t('status')}
							fullWidth
							size="small"
						>
							<MenuItem value={ApprovalStatus.Planned}>{t('planned')}</MenuItem>
							<MenuItem value={ApprovalStatus.Approved}>{t('approved')}</MenuItem>
							<MenuItem value={ApprovalStatus.Rejected}>{t('rejected')}</MenuItem>
						</Select>
					</FormControl>

					<Typography sx={{ fontSize: 12, marginTop: '8px' }} mb={'7px'}>
						{t('owner')}
					</Typography>
					<FormControl fullWidth>
						<InputLabel>{t('owner')}</InputLabel>
						<Select
							multiple
							value={filters.owner}
							onChange={(e) => setfilters({ ...filters, owner: e.target.value })}
							label={t('owner')}
							fullWidth
							size="small"
						>
							<MenuItem value={ApprovalStatus.Planned}>{t('planned')}</MenuItem>
							<MenuItem value={ApprovalStatus.Approved}>{t('approved')}</MenuItem>
							<MenuItem value={ApprovalStatus.Rejected}>{t('rejected')}</MenuItem>
						</Select>
					</FormControl>

					<Typography sx={{ fontSize: 12, marginTop: '8px' }} mb={'7px'}>
						{t('approvers')}
					</Typography>
					<FormControl fullWidth>
						<InputLabel>{t('approvers')}</InputLabel>
						<Select
							multiple
							value={filters.approvers}
							onChange={(e) => setfilters({ ...filters, approvers: e.target.value })}
							label={t('approvers')}
							fullWidth
							size="small"
						>
							<MenuItem value="Planned">1</MenuItem>
							<MenuItem value="Approved">2</MenuItem>
							<MenuItem value="Rejected">3</MenuItem>
						</Select>
					</FormControl>
				</Box>
			)}

			<Button
				variant="outlined"
				startIcon={<AddIcon />}
				fullWidth
				onClick={handleNewRequest}
				size="medium"
				sx={{ marginTop: '18px', borderRadius: '4px', justifyContent: 'flex-start', fontWeight: 500 }}
			>
				{t('request_new_approval')}
			</Button>

			<Typography sx={{ fontSize: 12, marginTop: '10px' }} mb={'3px'}>
				{t('select_approval')}
			</Typography>
			<Stack
				onClick={() => setopenSelectApproval(!openSelectApproval)}
				direction="row"
				justifyContent={'space-between'}
				alignItems={'center'}
				sx={{
					border: '1px solid rgba(145, 158, 171, 0.24)',
					padding: '12px 10px',
					borderRadius: '4px',
					':hover': {
						background: 'rgba(145, 158, 171, 0.24)',
					},
				}}
			>
				<Typography sx={{ fontSize: 12 }}>{getDateTimeEngKorean(new Date(), isEng)}</Typography>

				<AvatarGroup
					total={3}
					componentsProps={{
						additionalAvatar: {
							sx: { height: 25, width: 25, background: 'red', fontSize: 13, bgcolor: deepPurple[500] },
						},
					}}
				>
					{[1, 2, 3].map((e) => (
						<Avatar
							key={e}
							alt="profile Pic"
							sx={{ height: 24, width: 24, bgcolor: deepPurple[500], fontSize: 14 }}
							src=""
						>
							N
						</Avatar>
					))}
				</AvatarGroup>

				<Stack direction="row" alignItems={'center'} gap={'3px'}>
					<Typography
						sx={{
							fontSize: 12,
							fontWeight: 500,
							height: 20,
							background: colorApprovalTask[ApprovalStatus.Approved],
							padding: '0 4px',
							borderRadius: '4px',
							color: 'white',
						}}
					>
						{t('approved')}
					</Typography>
					{openSelectApproval ? <ExpandLessSharpIcon fontSize="10px" /> : <ExpandMoreSharpIcon fontSize="10px" />}
				</Stack>
			</Stack>

			{openSelectApproval && (
				<Box sx={{ marginTop: '3px', border: '1px solid rgba(145, 158, 171, 0.24)', borderRadius: '4px' }}>
					{Array.from(Array(4).keys()).map((a, index) => (
						<Stack
							key={a}
							onClick={() => setopenSelectApproval(!openSelectApproval)}
							direction="row"
							justifyContent={'space-between'}
							alignItems={'center'}
							sx={{
								padding: '12px 10px',
								borderBottom:
									Array.from(Array(4).keys()).length !== index + 1 ? '1px solid rgba(145, 158, 171, 0.24)' : 0,
								':hover': {
									background: 'rgba(145, 158, 171, 0.24)',
								},
							}}
						>
							<Typography sx={{ fontSize: 12 }}>{getDateTimeEngKorean(new Date(), isEng)}</Typography>

							<AvatarGroup
								total={3}
								componentsProps={{
									additionalAvatar: {
										sx: { height: 25, width: 25, background: 'red', fontSize: 13, bgcolor: deepPurple[500] },
									},
								}}
							>
								{[1, 2, 3].map((e) => (
									<Avatar
										key={e}
										alt="profile Pic"
										sx={{ height: 24, width: 24, bgcolor: deepPurple[500], fontSize: 14 }}
										src=""
									>
										N
									</Avatar>
								))}
							</AvatarGroup>

							<Stack direction="row" key={a} alignItems={'center'} gap={'3px'}>
								<Typography
									sx={{
										fontSize: 12,
										fontWeight: 500,
										height: 20,
										background: colorApprovalTask[ApprovalStatus.Approved],
										padding: '0 4px',
										borderRadius: '4px',
										color: 'white',
									}}
								>
									{t('approved')}
								</Typography>
							</Stack>
						</Stack>
					))}
				</Box>
			)}

			<Stack direction="row" alignItems={'center'} justifyContent={'space-between'} mt={'15px'}>
				<Typography sx={{ fontSize: 18, fontWeight: 600 }}>{t('project_info')}:</Typography>

				<Typography
					sx={{
						fontSize: 12,
						fontWeight: 500,
						height: 24,
						background: colorApprovalTask[ApprovalStatus.Approved],
						padding: '1px 4px',
						borderRadius: '4px',
						color: 'white',
					}}
				>
					{t('approved')}
				</Typography>
			</Stack>

			<Stack gap={'4px'}>
				<Stack direction="row" gap={1} mt={1}>
					<Iconify icon="pepicons-pop:ruler-off" sx={{ minWidth: 17, minHeight: 17, marginTop: '4px' }} />
					<Box>
						<Typography variant="body2" fontSize={14}>
							{t('construction_name')}:
						</Typography>
						<Typography variant="body2" fontWeight={600} fontSize={14}>
							project title here
						</Typography>
					</Box>
				</Stack>

				<Stack direction="row" gap={1} mt={1}>
					<Iconify icon="octicon:apps-16" sx={{ minWidth: 18, minHeight: 18, marginTop: '4px' }} />
					<Box>
						<Typography variant="body2" fontSize={14}>
							{t('detail_page')}
						</Typography>
						<Typography variant="body2" fontWeight={600} fontSize={14}>
							Approval Page{/* getNameApprovalStatus [from_page] */}
						</Typography>
					</Box>
				</Stack>

				<Stack direction="row" gap={1} mt={1}>
					<Iconify icon="material-symbols:date-range-outline-sharp" sx={{ width: 16, height: 16, marginTop: '4px' }} />
					<Box>
						<Typography variant="body2" fontSize={14}>
							{t('date')}
						</Typography>
						<Typography variant="body2" fontWeight={600} fontSize={14}>
							{fDateLocale(new Date())}
						</Typography>
					</Box>
				</Stack>

				<Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
					<Stack direction="row" gap={1} mt={1}>
						<Iconify
							icon="material-symbols:date-range-outline-sharp"
							sx={{ width: 16, height: 16, marginTop: '4px' }}
						/>
						<Box>
							<Typography variant="body2" fontSize={14}>
								{t('approval_request_date')}
							</Typography>
							<Typography variant="body2" fontWeight={600} fontSize={14}>
								{fDateLocale(new Date())}
							</Typography>
						</Box>
					</Stack>
					<Stack direction="row" gap={1} mt={1}>
						<Iconify
							icon="material-symbols:date-range-outline-sharp"
							sx={{ width: 16, height: 16, marginTop: '4px' }}
						/>
						<Box>
							<Typography variant="body2" fontSize={14}>
								{t('approval_completion_date')}
							</Typography>
							<Typography variant="body2" fontWeight={600} fontSize={14}>
								{fDateLocale(new Date())}
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</Stack>

			<Box mt={1}>
				<Divider />
				<Typography mt={1} sx={{ fontSize: 18, fontWeight: 600 }}>
					{t('approval_progress')}
				</Typography>

				<Stack gap={'10px'} mt={1}>
					{[1, 2, 3].map((a, index) => (
						<Stack direction={'row'} alignItems={'center'} key={a} justifyContent={'space-between'}>
							<Stack direction={'row'} alignItems={'center'} gap={'5px'}>
								<Badge
									overlap="circular"
									anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
									badgeContent={
										<Avatar
											sx={{ width: 18, height: 18, bgcolor: deepPurple[500], display: index === 0 ? 'block' : 'none' }}
											alt="owner"
											src="/static/icons/owner.svg"
										/>
									}
								>
									<Avatar sx={{ height: 40, width: 40, bgcolor: deepPurple[500] }} alt="profile" src="">
										N
									</Avatar>
								</Badge>
								<Typography sx={{ fontSize: 14, fontWeight: 600 }}>Name here</Typography>
								<Typography sx={{ fontSize: 11, color: '#596570' }}>
									{getDateTimeEngKorean(new Date(), isEng)}
								</Typography>
							</Stack>
							<Typography
								sx={{
									fontSize: 11,
									fontWeight: 500,
									height: 20,
									border: `1px solid ${colorApprovalTask[ApprovalStatus.Approved]}`,
									padding: '1px 3px',
									borderRadius: '4px',
									color: colorApprovalTask[ApprovalStatus.Approved],
								}}
							>
								{t('approved')}
							</Typography>
						</Stack>
					))}
				</Stack>

				<Button
					variant="outlined"
					fullWidth
					onClick={handleNewRequest}
					size="medium"
					sx={{ marginTop: '18px', borderRadius: '4px', fontWeight: 500 }}
				>
					{t('open_detail_approval_view')}
				</Button>
			</Box>
		</Box>
	)
}

export default Approvals
