import React, { createContext, useContext, useReducer, useState } from 'react'
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

export const MainProvider = ({ children }) => {
	const [state, dispatch] = useReducer(mainReducer, initial_state)
	const { getSession, user, userLoading } = useAuthentication()
	const [openaccoutReview, setopenaccoutReview] = useState(false)
	const [openNotification, setopenNotification] = useState(false)
	const [currentApproval, setcurrentApproval] = useState(null)

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
			}}
		>
			{userLoading ? <></> : children}
		</MainContext.Provider>
	)
}

const useMain = () => useContext(MainContext)

export default useMain
