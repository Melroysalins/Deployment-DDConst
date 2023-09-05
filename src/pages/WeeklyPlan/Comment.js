import { useState, useEffect, useRef } from 'react'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, CircularProgress, InputAdornment, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { fDateLocale, fTimeLocale } from 'utils/formatTime'
import Iconify from 'components/Iconify'
import account from '../../_mock/account'
import useMain from 'pages/context/context'
import PropTypes from 'prop-types'
import { createComment, deleteComment, getCommentsByProjectTask, updateComment } from 'supabase/comment'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { deepPurple } from '@mui/material/colors'

Comment.propTypes = {
	data: PropTypes.object,
	handleSetEvent: PropTypes.func,
}

export default function Comment({ data, handleSetEvent }) {
	const { t } = useTranslation()
	const messagesEndRef = useRef(null)
	const [isLoader, setisLoader] = useState(false)
	const [isDelLoader, setisDelLoader] = useState(false)
	const [isEdit, setisEdit] = useState(null)
	const { user, currentEmployee } = useMain()
	const [comment, setcomment] = useState('')
	const [anchorEl, setAnchorEl] = useState(null)
	const [currentId, setcurrentId] = useState(null)

	const {
		data: comments,
		refetch,
		isLoading,
	} = useQuery(['Comments'], () => getCommentsByProjectTask(data.id), {
		select: (r) => r.data,
	})

	useEffect(() => {
		scrollToBottom()
	}, [comments])

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
	}

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const saveComment = () => {
		setisLoader(true)
		const obj = {
			body: comment,
			project_task: data.id,
			employee: currentEmployee.id,
		}
		createComment(obj).then(async () => {
			handleSetEvent()
			setcomment('')
			await refetch()
			setisLoader(false)
			scrollToBottom()
		})
	}

	const editComment = (commentId) => {
		setisLoader(true)
		const obj = {
			body: comment,
		}
		updateComment(obj, commentId).then(async () => {
			setisEdit('')
			handleSetEvent()
			setcomment('')
			await refetch()
			setisLoader(false)
			scrollToBottom()
		})
	}

	const handleDelete = (id) => {
		setisDelLoader(true)
		deleteComment(id).then(async () => {
			await refetch()
			setcurrentId(null)
			setisDelLoader(false)
		})
		setAnchorEl(null)
	}

	const handleEdit = (id, text) => {
		setisEdit(id)
		setcomment(text)
		setAnchorEl(null)
	}

	return (
		<Box>
			<Typography variant="body1" fontSize={16} fontWeight={600} mb={1} mt={1} p={'0 12px'}>
				{t('all_comments')} ({data.title})
			</Typography>
			<Box
				sx={{
					minHeight: '27vh',
					position: 'relative',
					maxHeight: '35vh',
					overflowY: 'auto',
					'&::-webkit-scrollbar': {
						width: '0.1rem',
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: '#FF6B00',
						outline: '1px solid #FF6B00',
					},
				}}
			>
				<Box p={'0 10px'}>
					{!comments?.length && !isLoading && (
						<Box pt={3} sx={{ fontWeight: 600, textAlign: 'center', fontSize: '1.1rem', paddingTop: 8 }}>
							{t('no_comment_yet')}
						</Box>
					)}
					{comments?.map((val) => (
						<Stack direction="row" mb={2} mr={1} key={val.id} sx={{ position: 'relative' }}>
							<Avatar sx={{ bgcolor: deepPurple[500] }} src={val.employee?.profile || ''}>
								{val.employee.name?.[0]}
							</Avatar>
							<Box pl={1} sx={{ lineBreak: 'anywhere' }}>
								<Typography variant="body2">
									{/* <Iconify icon="mdi:person-circle-outline" sx={{ color: (theme) => theme.palette.primary.light }} /> */}
									<Typography
										variant="caption"
										sx={{ color: (theme) => theme.palette.primary.light, fontSize: '14px' }}
									>
										&nbsp;{val.employee.name}&nbsp;
									</Typography>
									{isEdit !== val.id ? (
										<>{val.body}</>
									) : (
										<TextField
											multiline
											variant="standard"
											size="small"
											fullWidth
											value={comment}
											onKeyPress={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault()
													editComment(val.id)
												}
											}}
											onChange={(e) => setcomment(e.target.value)}
											sx={{ paddingRight: 4 }}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end" onClick={saveComment} sx={{ cursor: 'pointer' }}>
														{isLoader ? (
															<CircularProgress size={15} />
														) : (
															<Iconify icon="carbon:send" style={{ transform: 'rotate(270deg)' }} />
														)}
													</InputAdornment>
												),
											}}
										/>
									)}
								</Typography>
								<Typography variant="body2" fontSize={12} pt={'3px'}>
									{t('edited')} {fDateLocale(new Date(val.created_at))} {t('at')}{' '}
									{fTimeLocale(new Date(val.created_at))}
								</Typography>
							</Box>
							{val.employee.user !== user.id ? (
								<Iconify icon="tabler:arrow-back-up" style={{ position: 'absolute', right: 0, top: 3 }} />
							) : (
								<>
									<IconButton
										aria-label="settings"
										style={{ position: 'absolute', right: 0 }}
										onClick={(e) => {
											handleClick(e)
											setcurrentId(val.id)
										}}
									>
										{isDelLoader && currentId === val.id ? (
											<CircularProgress size={15} />
										) : (
											<MoreVertIcon style={{ transform: 'rotate(90deg)' }} />
										)}
									</IconButton>
									<Menu
										id="basic-menu"
										anchorEl={anchorEl}
										open={currentId === val.id && anchorEl}
										onClose={handleClose}
										MenuListProps={{
											'aria-labelledby': 'basic-button',
										}}
									>
										<MenuItem onClick={() => handleEdit(val.id, val.body)}>Edit</MenuItem>
										<MenuItem onClick={() => handleDelete(val.id)}>Delete</MenuItem>
									</Menu>
								</>
							)}
						</Stack>
					))}
					<div ref={messagesEndRef} />
				</Box>
			</Box>

			<Stack
				direction="row"
				mb={1}
				p={'0 10px'}
				mr={1}
				style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}
			>
				<Avatar sx={{ bgcolor: deepPurple[500] }} src={currentEmployee?.profile || account.photoURL} alt="photoURL" />
				<TextField
					multiline
					variant="outlined"
					size="small"
					label={t('comment')}
					fullWidth
					onClick={() => {
						if (isEdit) {
							setcomment('')
							setisEdit(null)
						}
					}}
					value={isEdit ? '' : comment}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault()
							saveComment()
						}
					}}
					onChange={(e) => setcomment(e.target.value)}
					sx={{ paddingLeft: 1 }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end" onClick={saveComment} sx={{ cursor: 'pointer' }}>
								{isLoader && !isEdit ? (
									<CircularProgress size={15} />
								) : (
									<Iconify icon="carbon:send" style={{ transform: 'rotate(270deg)' }} />
								)}
							</InputAdornment>
						),
					}}
				/>
			</Stack>
		</Box>
	)
}
