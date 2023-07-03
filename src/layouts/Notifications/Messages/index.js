import { set, sub } from 'date-fns'
import { noCase } from 'change-case'
import { faker } from '@faker-js/faker'
import { useState } from 'react'
import { Avatar, Typography, ListItemText, ListItemAvatar, ListItemButton, Box } from '@mui/material'
import Scrollbar from 'components/Scrollbar'
import Iconify from 'components/Iconify'

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
	{
		id: faker.datatype.uuid(),
		title: 'Name Here',
		description: 'sapien pellentesque necnon nisi.',
		avatar: null,
		type: 'Task',
		createdAt: set(new Date(), { hours: 10, minutes: 30 }),
		isUnRead: false,
	},
	{
		id: faker.datatype.uuid(),
		title: faker.name.findName(),
		description: 'sapien pellentesque necnon nisi.',
		avatar: '/static/mock-images/avatars/avatar_2.jpg',
		type: 'Notification',
		createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
		isUnRead: false,
	},
	{
		id: faker.datatype.uuid(),
		title: 'You have new message',
		description: 'sapien pellentesque necnon nisi.',
		avatar: null,
		type: 'Notification',
		createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
		isUnRead: false,
	},
	{
		id: faker.datatype.uuid(),
		title: 'You have new mail',
		description: 'sent from Guido Padberg',
		avatar: null,
		type: 'Notification',
		createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
		isUnRead: false,
	},
	{
		id: faker.datatype.uuid(),
		title: 'Delivery processing',
		description: 'Your order is being shipped',
		avatar: null,
		type: 'Task',
		createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
		isUnRead: false,
	},
]

export default function Messages() {
	const [notifications, setNotifications] = useState(NOTIFICATIONS)

	return (
		<>
			<Scrollbar>
				<NotificationItem notification={NOTIFICATIONS[0]} />

				<Box>
					<Typography variant="body1" sx={{ fontWeight: 600 }}>
						Yesterday
					</Typography>
				</Box>

				{notifications.slice(2, 4).map((notification) => (
					<NotificationItem key={notification.id} notification={notification} />
				))}
				<Box>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Last 7 Days
					</Typography>
				</Box>

				{notifications.slice(2, 6).map((notification) => (
					<NotificationItem key={notification.id} notification={notification} />
				))}
			</Scrollbar>
		</>
	)
}

function NotificationItem({ notification }) {
	const { avatar, title } = renderContent(notification)

	return (
		<ListItemButton sx={{ padding: '0px' }}>
			<ListItemAvatar sx={{ width: 40, height: 75 }}>
				<Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={title}
				secondary={<Typography variant="caption">12 hours ago . {notification.type}</Typography>}
			/>
		</ListItemButton>
	)
}

// ----------------------------------------------------------------------

function renderContent(notification) {
	const title = (
		<>
			<Typography variant="subtitle2">Donec velit neque auctor</Typography>
			<Typography variant="body2">
				<Typography variant="caption" sx={{ color: (theme) => theme.palette.primary.light, fontSize: '14px' }}>
					{notification.title}
				</Typography>

				<Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
					&nbsp;{noCase(notification.description)}
				</Typography>
				{notification.type === 'Task' && (
					<Typography
						variant="body2"
						sx={{
							color: (theme) => theme.palette.primary.light,
							fontSize: '12px',
							fontWeight: 600,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						Go to Task&nbsp;
						<Iconify icon="ic:round-arrow-forward" width={15} sx={{ fontWeight: 600 }} />
					</Typography>
				)}
			</Typography>
		</>
	)

	return {
		avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
		title,
	}
}
