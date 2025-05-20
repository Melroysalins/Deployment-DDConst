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
	const { getSession, user, userLoading, currentEmployee, refetchCurrentEmployee } = useAuthentication()
	const [openaccoutReview, setopenaccoutReview] = useState(false)
	const [openNotification, setopenNotification] = useState(false)
	const [openRequestApproval, setopenRequestApproval] = useState(false)
	const [allowTaskCursor, setallowTaskCursor] = useState(false)
	const [commentTasks, setcommentTasks] = useState([])
	const [currentApproval, setcurrentApproval] = useState(null)
	const [refetchApprovals, setrefetchApprovals] = useState(false)
	const [refetchtaskProjects, setrefetchtaskProjects] = useState(false)
	const [fromPage, setFromPage] = useState("")
	// for right side approvals log info
	const [isDrawerOpen, setisDrawerOpen] = useState(false)
	const [approvalIdDrawerRight, setapprovalIdDrawerRight] = useState(null)
	const [mainFilters, setmainFilters] = useState(null)
	const [objs, setObjs] = useState(null)

	console.log(commentTasks)

	useEffect(() => {
		if (!openRequestApproval) {
			setallowTaskCursor(false)
			setcommentTasks([])
			setapprovalIdDrawerRight(null)
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
				refetchCurrentEmployee,
				openRequestApproval,
				setopenRequestApproval,
				allowTaskCursor,
				setallowTaskCursor,
				commentTasks,
				setcommentTasks,
				handleCommentTask,
				isDrawerOpen,
				setisDrawerOpen,
				approvalIdDrawerRight,
				setapprovalIdDrawerRight,
				mainFilters,
				setmainFilters,
				fromPage,
				setFromPage,
				objs,
				setObjs,
			}}
		>
			{userLoading ? <></> : children}
		</MainContext.Provider>
	)
}

const useMain = () => useContext(MainContext)

export default useMain
