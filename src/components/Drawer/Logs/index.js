import { Drawer, Filters } from 'components'
import Iconify from 'components/Iconify'
import useMain from 'pages/context/context'
import React from 'react'
import { isNotEmpty } from 'utils/helper'
import style from './log.module.scss'
import Message from './Message'
import { useQuery } from 'react-query'
import { listAllLogsByProject } from 'supabase/logs'
import { useParams } from 'react-router-dom'

export default function Logs({ open, setopen }) {
	const { state } = useMain()
	const { companies, projects, employees, time } = state.filters || {}
	const showFilter = isNotEmpty(companies) || isNotEmpty(projects) || isNotEmpty(employees) || isNotEmpty(time)

	const { id } = useParams()

	const { data: logs } = useQuery(['Logs'], () => listAllLogsByProject(id), {
		select: (r) => r.data,
	})
	return (
		<Drawer
			open={open}
			setopen={setopen}
			headerIcon={'heroicons-outline:document-text'}
			header={
				<div className={style.headerContent}>
					<b>Logs</b>
					<Iconify color={showFilter ? 'secondary.main' : 'inherit'} icon="heroicons-funnel" width={20} height={20} />
				</div>
			}
		>
			{showFilter && <Filters showDetail={false} />}

			{logs?.map((e, index) => (
				<React.Fragment key={index}>
					<Message detail={e} />
				</React.Fragment>
			))}

			{logs?.length === 0 && <div className={style.logMessage} style={{ width: 250 }} />}
		</Drawer>
	)
}
