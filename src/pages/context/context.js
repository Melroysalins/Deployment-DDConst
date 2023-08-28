import React, { createContext, useContext, useReducer, useState, useEffect } from 'react'
import mainReducer from './reducer'
import useAuthentication from 'hooks/useAuthentication'

export const initStateFilters = {
	isfilterOpen: false,
	companies: [],
	projects: [],
	employees: [],
	time: '',
}

const initial_state = {
	filters: initStateFilters,
}

export const MainContext = createContext({ value: initial_state, dispatch: () => null })
MainContext.displayName = 'MainContext'

// eslint-disable-next-line react/prop-types
export const MainProvider = ({ children }) => {
	const [state, dispatch] = useReducer(mainReducer, initial_state)
	const { getSession, user, userLoading, currentEmployee } = useAuthentication()
	const [openaccoutReview, setopenaccoutReview] = useState(false)
	const [openNotification, setopenNotification] = useState(false)
	const [openRequestApproval, setopenRequestApproval] = useState(false)
	const [allowTaskCursor, setallowTaskCursor] = useState(false)
	const [commentTasks, setcommentTasks] = useState([])
	const [currentApproval, setcurrentApproval] = useState(null)
	const [refetchApprovals, setrefetchApprovals] = useState(false)
	const [refetchtaskProjects, setrefetchtaskProjects] = useState(false)

	useEffect(() => {
		if (!openRequestApproval) {
			setallowTaskCursor(false)
			setcommentTasks([])
		}
	}, [openRequestApproval])

	useEffect(() => {
		if (!allowTaskCursor) {
			setcommentTasks([])
		}
	}, [allowTaskCursor])

	const handleCommentTask = (id, title, status) => {
		const existingTask = commentTasks.find((task) => task.id === id)
		if (existingTask) {
			setcommentTasks(commentTasks.filter((task) => task.id !== id))
		} else {
			setcommentTasks([...commentTasks, { id, title, status }])
		}
	}

	return (
		<MainContext.Provider
			value={{
				state,
				dispatch,
				getSession,
				user,
				userLoading,
				openaccoutReview,
				setopenaccoutReview,
				openNotification,
				setopenNotification,
				currentApproval,
				setcurrentApproval,
				refetchApprovals,
				setrefetchApprovals,
				refetchtaskProjects,
				setrefetchtaskProjects,
				currentEmployee,
				openRequestApproval,
				setopenRequestApproval,
				allowTaskCursor,
				setallowTaskCursor,
				commentTasks,
				setcommentTasks,
				handleCommentTask,
			}}
		>
			{userLoading ? <></> : children}
		</MainContext.Provider>
	)
}

const useMain = () => useContext(MainContext)

export default useMain
