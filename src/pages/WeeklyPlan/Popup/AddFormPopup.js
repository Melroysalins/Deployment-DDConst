import React, { useEffect } from 'react'
import PopupForm from 'components/Popups/PopupForm'
import AddProjectTaskForm from './AddProjectTaskForm'
import { deleteTask } from 'supabase'
import PropTypes from 'prop-types'
import { Box, Tab, Tabs } from '@mui/material'
import { a11yProps } from 'pages/Dashboard/TravelExpenses/popups/ViewEventPopup'
import Comment from '../Comment'

AddFormPopup.propTypes = {
	handleClose: PropTypes.func,
	anchor: PropTypes.string.isRequired,
	data: PropTypes.object,
	handleSetEvent: PropTypes.func,
	myEvents: PropTypes.array,
}

export default function AddFormPopup({ handleClose, anchor, data, handleSetEvent, myEvents }) {
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
				title={data?.id ? 'Edit Project Task' : 'Add Project Task'}
				variant="primary"
				handleSubmit={!value && handleSubmit}
				handleClose={handleClose}
				anchor={anchor}
				handleDelete={data?.id && handleDelete}
				marginTop={value === 1 ? -7 : -6}
			>
				{data?.id && !data.task_id && (
					<Box sx={{ width: '100%' }}>
						<Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="secondary tabs example">
							<Tab label="Task" {...a11yProps(0)} />
							<Tab label="Comment" {...a11yProps(0)} />
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
