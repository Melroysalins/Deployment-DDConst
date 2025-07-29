import React, { useState, useEffect, useRef } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Checkbox,
	TextField,
} from '@mui/material'
import moment from 'moment'
import { createNewTasks, deleteTasks, updateTask } from 'supabase'
import { iteratee } from 'lodash'

export default function ManageSubtasksDialog({ open, onClose, eventRecord, scheduler, id, lockWeekend }) {
	const [subtasks, setSubtasks] = useState([])
	const [selectedForDelete, setSelectedForDelete] = useState([])
	const [newlyAddedSubTask, SetNewlyAddedSubtask] = useState([])
	const [showSaveButton, SetShowSaveButton] = useState(true)
	const taskToBeUpdated = useRef([])
	const lastInputRef = useRef(null)

	useEffect(() => {
		if (eventRecord?.children?.length) {
			const sorted = [...eventRecord.children]
				.filter((task) => {
					// Filter out any subtask that doesn't have a valid backend ID
					return !!task.id && task.id.toString().length < 10 // filters out random large client-only IDs
				})
				.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
				.map((task) => ({
					id: task.id,
					name: task.name || '',
					startDate: moment(task.startDate).format('YYYY-MM-DD'),
					endDate: moment(task.endDate).format('YYYY-MM-DD'),
					duration: task.duration || 1,
					team: task.team,
					parent_task: task.parent_task || eventRecord.id,
					task_group_id: task.task_group_id,
					isSaved: true, // mark all real subtasks as saved
					resourceId: task.resourceId,
				}))
			setSubtasks(sorted)
		}
	}, [eventRecord])

	const handleCheckboxChange = (id) => {
		setSelectedForDelete((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
	}

	const handleInputChange = (id, field, value) => {
		const existingIndex = taskToBeUpdated.current.findIndex((t) => t.id === id)

		if (existingIndex !== -1) {
			// Update field
			taskToBeUpdated.current[existingIndex][field] = value
		} else {
			// Add new entry
			taskToBeUpdated.current.push({ id, [field]: value })
		}

		// console.log('handleInputChange', taskToBeUpdated)

		setSubtasks((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
	}

	const calculateMandays = (start, end) => {
		if (!lockWeekend) {
			const s = moment(start)
			const e = moment(end)
			return e.diff(s, 'days')
		}

		const currentStartDate = new Date(start)
		const currentEndDate = new Date(end)

		const isWeekend = (day) => day === 0 || day === 6

		let count = 0

		while (currentStartDate <= currentEndDate) {
			const next = new Date(currentStartDate)

			next.setDate(currentStartDate.getDate() + 1)

			if (!isWeekend(currentStartDate.getDay()) && next <= currentEndDate) {
				count += 1
			}

			currentStartDate.setDate(currentStartDate.getDate() + 1)
		}

		return count
	}

	const handleAddSubtask = async () => {
		const parentStart = moment(eventRecord.startDate)
		const parentEnd = moment(eventRecord.endDate)
		const validPairs = []

		const temp = new Date(parentStart)
		const extensiveDays = 25

		const extensiveEndDate = new Date(parentEnd)

		extensiveEndDate.setDate(extensiveEndDate.getDate() + extensiveDays)

		while (temp <= extensiveEndDate) {
			const next = new Date(temp)
			next.setDate(temp.getDate() + 1)
			if (![0, 6].includes(temp.getDay()) && next <= extensiveEndDate) {
				validPairs.push([new Date(temp), new Date(next)])
			}
			temp.setDate(temp.getDate() + 1)
		}

		const pairIndex = subtasks.length % validPairs.length
		const [start, end] = validPairs[pairIndex]

		const { team, task_group_id, id } = eventRecord?.data

		const mysubtask = {
			id: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000),
			name: ' ',
			startDate: moment(start).format('YYYY-MM-DD'),
			endDate: moment(end).format('YYYY-MM-DD'),
			duration: 1,
			team,
			parent_task: eventRecord?.id,
			task_group_id,
			isSaved: false,
			resourceId: eventRecord?.data?.resourceId,
		}

		setSubtasks((prev) => [...prev, mysubtask])

		await scheduler.project.commitAsync()

		lastInputRef.current?.focus()

		// console.log('EventModal', mysubtask, moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'))
	}

	const handleSave = async () => {
		if (taskToBeUpdated?.current?.length) {
			taskToBeUpdated.current.forEach((task) => {
				const updatePayload = {}

				// Convert keys to backend field names
				if (task.startDate) updatePayload.start_date = task.startDate
				if (task.endDate) updatePayload.end_date = task.endDate
				if (task.name) updatePayload.title = task.name // if backend expects `title`

				if (!updatePayload.start_date) {
					updatePayload.start_date = `${moment(scheduler.eventStore.getById(task?.id)?.startDate).format('YYYY-MM-DD')}`
				}

				if (!updatePayload.end_date) {
					updatePayload.end_date = `${moment(scheduler.eventStore.getById(task?.id)?.endDate).format('YYYY-MM-DD')}`
				}

				console.log('handleInputChange', updatePayload)
				;(async () => {
					try {
						await updateTask(updatePayload, task.id)
					} catch (err) {
						console.error('❌ Error updating task', task.id, err)
					}
				})()
			})
		}

		const EventModel = scheduler.eventStore.modelClass

		const updatedModels = subtasks.map((s) => new EventModel(s))

		const newlyCreatedSubtasks = subtasks.filter((task) => task.isSaved === false)

		await Promise.all(
			newlyCreatedSubtasks.map(async (item) => {
				const mysubtask = {
					title: item?.name,
					team: eventRecord?.data?.team,
					start_date: item?.startDate,
					end_date: item?.endDate,
					parent_task: item?.parent_task,
					task_group_id: item?.task_group_id,
					project: id,
				}

				try {
					const res = await createNewTasks(mysubtask)

					const backendNewSubtask = res?.data?.[0]

					const bryntumReadySubtask = {
						id: backendNewSubtask.id,
						name: backendNewSubtask.title,
						startDate: backendNewSubtask?.start_date,
						endDate: backendNewSubtask?.end_date,
						team: backendNewSubtask.team,
						notes: backendNewSubtask.notes,
						task_group_id: eventRecord.task_group_id,
						project: backendNewSubtask.project,
						parentId: backendNewSubtask.parent_task,
						resourceId: eventRecord?.data?.resourceId || item?.resourceId,
						isAddNewSubTask: true,
						expanded: true,
						leaf: true,
						isTask: true,
					}

					console.log('okay ', bryntumReadySubtask, eventRecord)

					const tempSubtask = scheduler.eventStore.find(
						(t) =>
							t.name === item.name &&
							moment(t.startDate).isSame(item.startDate, 'day') &&
							moment(t.endDate).isSame(item.endDate, 'day') &&
							!t.id // or t.id is not a valid backend id format
					)

					if (tempSubtask) {
						scheduler.eventStore.remove(tempSubtask)
					}

					const newTaskRecord = scheduler.eventStore.add(bryntumReadySubtask)[0]

					if (!eventRecord.data.children) {
						eventRecord.data.children = []
					}

					// eventRecord.data.children.push({
					// 	name: backendNewSubtask.title,
					// 	startDate: backendNewSubtask.start_date,
					// 	endDate: backendNewSubtask.end_date,
					// })

					scheduler.assignmentStore.add({
						id: Date.now(),
						eventId: newTaskRecord.id,
						resourceId: eventRecord?.data?.resourceId,
					})
				} catch (error) {
					console.log('❌ Failed to add subtask:', error)
				}
			})
		)

		// After all tasks are saved, commit and close
		await scheduler.project.commitAsync()
		scheduler.resumeEvents()
		scheduler.resumeRefresh()

		// Remove deleted tasks

		// Clear existing data.children to rebuild
		eventRecord.data.children =
			eventRecord.data.children?.filter((child) => !selectedForDelete.includes(child.id)) || []

		// Append or update
		updatedModels.forEach((model) => {
			const existing = scheduler.eventStore.getById(model.id)
			if (existing) {
				existing.set(model.data)
			} else {
				eventRecord.appendChild(model)
			}

			const existsInData = eventRecord.data.children.find((c) => c.id === model.id)
			if (!existsInData) {
				eventRecord.data.children.push(model.data)
			}
		})

		scheduler.project.commitAsync()

		console.log('okay ', eventRecord)
		onClose()
	}

	const handleDeleteSelected = async () => {
		setSubtasks((prev) => prev.filter((s) => !selectedForDelete.includes(s.id)))

		try {
			const res = await deleteTasks(selectedForDelete)

			SetShowSaveButton(false)

			selectedForDelete.forEach((id) => {
				const index = eventRecord.children.findIndex((child) => child.id === id)
				if (index !== -1) eventRecord.children.splice(index, 1)
				const taskRecord = scheduler.eventStore.getById(id)
				if (taskRecord) scheduler.eventStore.remove(taskRecord)

				const dataIndex = eventRecord.data?.children?.findIndex((child) => child.id === id)
				if (dataIndex !== -1) eventRecord.data.children.splice(dataIndex, 1)

				selectedForDelete.forEach((id) => {
					const record = scheduler.eventStore.getById(id)
					if (record) scheduler.eventStore.remove(record)
				})
			})
			SetShowSaveButton(true)
		} catch (error) {
			console.log('Failed to delete subtask in subtask popup', error)
		}

		setSelectedForDelete([])
	}

	useEffect(() => {
		lastInputRef.current?.focus()

		console.log('lastRef', lastInputRef.current)
	}, [lastInputRef])

	console.log('Manage Subtask', eventRecord)

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>Manage Subtasks</DialogTitle>
			<DialogContent>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox" />
							<TableCell>Task Name</TableCell>
							<TableCell>Mandays</TableCell>
							<TableCell>Start Date</TableCell>
							<TableCell>End Date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{/* eslint-disable array-callback-return */}
						{subtasks?.map((task, index) => {
							return (
								<TableRow key={task.id || index}>
									<TableCell padding="checkbox">
										<Checkbox
											checked={selectedForDelete.includes(task.id)}
											onChange={() => handleCheckboxChange(task.id)}
										/>
									</TableCell>
									<TableCell>
										<TextField
											value={task.name}
											onChange={(e) => handleInputChange(task.id, 'name', e.target.value)}
											variant="standard"
											fullWidth
											inputRef={index === subtasks.length - 1 ? lastInputRef : null}
										/>
									</TableCell>
									<TableCell>{calculateMandays(task?.startDate, task?.endDate)}</TableCell>
									<TableCell>
										<TextField
											type="date"
											value={moment(task?.startDate).format('YYYY-MM-DD')}
											onChange={(e) => handleInputChange(task.id, 'startDate', e.target.value)}
											variant="standard"
											fullWidth
										/>
									</TableCell>
									<TableCell>
										<TextField
											type="date"
											value={moment(task?.endDate).format('YYYY-MM-DD')}
											onChange={(e) => handleInputChange(task.id, 'endDate', e.target.value)}
											variant="standard"
											fullWidth
										/>
									</TableCell>
								</TableRow>
							)
						})}
						{/* eslint-disable array-callback-return */}
						{/* {subtasks.map((task, index) => (
							<TableRow key={task.id || index}>
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedForDelete.includes(task.id)}
										onChange={() => handleCheckboxChange(task.id)}
									/>
								</TableCell>
								<TableCell>
									<TextField
										value={task.name}
										onChange={(e) => handleInputChange(task.id, 'name', e.target.value)}
										variant="standard"
										fullWidth
									/>
								</TableCell>
								<TableCell>{calculateMandays(task?.startDate, task?.endDate)}</TableCell>
								<TableCell>
									<TextField
										type="date"
										value={moment(task?.startDate).format('YYYY-MM-DD')}
										onChange={(e) => handleInputChange(task.id, 'startDate', e.target.value)}
										variant="standard"
										fullWidth
									/>
								</TableCell>
								<TableCell>
									<TextField
										type="date"
										value={moment(task?.endDate).format('YYYY-MM-DD')}
										onChange={(e) => handleInputChange(task.id, 'endDate', e.target.value)}
										variant="standard"
										fullWidth
									/>
								</TableCell>
							</TableRow>
						))} */}
					</TableBody>
				</Table>
				<Button variant="contained" fullWidth sx={{ my: 2 }} onClick={handleAddSubtask}>
					ADD NEW SUBTASK
				</Button>
			</DialogContent>
			<DialogActions>
				{selectedForDelete.length > 0 && (
					<Button onClick={handleDeleteSelected} color="error">
						DELETE
					</Button>
				)}
				<Button onClick={onClose}>CANCEL</Button>
				{!selectedForDelete?.length && (
					<Button onClick={handleSave} variant="contained">
						SAVE
					</Button>
				)}
			</DialogActions>
		</Dialog>
	)
}
