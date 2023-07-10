import React from 'react'
import PopupForm from 'components/Popups/PopupForm'
import AddProjectTaskForm from './AddProjectTaskForm'
import { deleteTask } from 'supabase'

export default function AddFormPopup({ handleClose, anchor, data, handleSetEvent, myEvents }) {
	const ref = React.useRef()

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
				handleSubmit={handleSubmit}
				handleClose={handleClose}
				anchor={anchor}
				handleDelete={data?.id && handleDelete}
			>
				<AddProjectTaskForm
					handleClose={handleClose}
					ref={ref}
					data={data}
					handleSetEvent={handleSetEvent}
					myEvents={myEvents}
				/>
			</PopupForm>
		</>
	)
}
