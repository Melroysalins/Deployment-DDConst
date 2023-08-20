import { Drawer, Filters } from 'components'
import Iconify from 'components/Iconify'
import useMain from 'pages/context/context'
import React from 'react'
import { isNotEmpty } from 'utils/helper'
import style from './log.module.scss'
import { useQuery } from 'react-query'
import { listAllLogsByProject } from 'supabase/logs'
import { useParams } from 'react-router-dom'
import Message from './Message'

export default function Logs() {
	const { state } = useMain()
	const { companies, projects, employees, time } = state.filters || {}
	const showFilter = isNotEmpty(companies) || isNotEmpty(projects) || isNotEmpty(employees) || isNotEmpty(time)

	const { id } = useParams()

	const { data: logs } = useQuery(['Logs'], () => listAllLogsByProject(id), {
		select: (r) => r.data,
	})
	return (
		<>
			{showFilter && <Filters showDetail={false} />}

			{logs?.map((e) => (
				<Message detail={e} key={e.id} />
			))}

			{logs?.length === 0 && <div className={style.logMessage} style={{ width: 250 }} />}
		</>
	)
}
