import React from 'react'
import style from './log.module.scss'
import Iconify from 'components/Iconify'
import moment from 'moment'

export default function Message({ detail }) {
	const { action, sub_type, start, end, employee, created_at } = detail
	const calTimeDiff = () => {
		const a = moment(start)
		const b = moment(end)
		return b.diff(a, 'days')
	}
	return (
		<>
			<section className={style.logMessage}>
				{/* <div className={style.imgContainer}>
					<img src={`/static/mock-images/avatars/avatar_4.jpg`} alt="employee" />
				</div> */}
				<div className={style.msgContainer}>
					<div>
						{/* <span>
							<Iconify color="secondary.main" icon="heroicons-user-circle" width={20} height={20} />
							Employee_PJO{' '}
						</span> */}
						{`${action} ${sub_type}`} for {calTimeDiff()} days for {employee.name} from {start} to {end}.
					</div>
					<div className={style.date}>
						{moment(created_at).format('MM/DD/YYYY')} at {moment(created_at).format('HH:MM')}
					</div>
				</div>
			</section>
		</>
	)
}
