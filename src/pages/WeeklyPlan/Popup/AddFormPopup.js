import React, { useEffect } from 'react'
import PopupForm from 'components/Popups/PopupForm'
import AddProjectTaskForm from './AddProjectTaskForm'
import { deleteTask } from 'supabase'
import PropTypes from 'prop-types'
import { Box, Tab, Tabs } from '@mui/material'
import { a11yProps } from 'pages/Dashboard/TravelExpenses/popups/ViewEventPopup'
import Comment from '../Comment'
import { useTranslation } from 'react-i18next'

AddFormPopup.propTypes = {
	handleClose: PropTypes.func,
	anchor: PropTypes.string.isRequired,
	data: PropTypes.object,
	handleSetEvent: PropTypes.func,
	myEvents: PropTypes.array,
}

export default function AddFormPopup({ handleClose, anchor, data, handleSetEvent, myEvents }) {
	const { t } = useTranslation()
	const ref = React.useRef()
	const [value, setValue] = React.useState(0)

	useEffect(() => {
		setValue(0)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}
	const handleSubmit = () => {
		ref?.current?.onSubmit()
	}

	const handleDelete = () => {
		deleteTask(data.id).then(() => {
			handleSetEvent()
			handleClose()
		})
	}

	return (
		<>
			<PopupForm
				title={data?.id ? t('edit_project_task') : t('add_project_task')}
				variant="primary"
				handleSubmit={!value && handleSubmit}
				handleClose={handleClose}
				anchor={anchor}
				handleDelete={data?.id && value === 0 && handleDelete}
				marginTop={value === 1 ? -8 : -6}
			>
				{data?.id && !data.task_id && (
					<Box sx={{ width: '100%' }}>
						<Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="secondary tabs example">
							<Tab label={t('task')} {...a11yProps(0)} />
							<Tab label={t('comment')} {...a11yProps(0)} />
						</Tabs>
					</Box>
				)}
				{!value ? (
					<AddProjectTaskForm
						handleClose={handleClose}
						ref={ref}
						data={data}
						handleSetEvent={handleSetEvent}
						myEvents={myEvents}
					/>
				) : (
					<Comment data={data} handleSetEvent={handleSetEvent} />
				)}
			</PopupForm>
		</>
	)
}
