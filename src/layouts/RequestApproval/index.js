import useMain from 'pages/context/context'
import React from 'react'
import Box from '@mui/material/Box'
import LeftDrawer from 'components/LeftDrawer'
import { useTranslation } from 'react-i18next'
import Approval from 'components/Drawer/Approval'

export default function RequestApproval() {
	const { openRequestApproval, setopenRequestApproval } = useMain()
	const { t } = useTranslation()

	return (
		<LeftDrawer
			variant={'permanent'}
			open={openRequestApproval}
			setopen={setopenRequestApproval}
			headerText={t('request_new_approval')}
			onBack={() => setopenRequestApproval(false)}
		>
			<Box sx={{ padding: 2 }}>
				<Approval isLeftMenu={true} />
			</Box>
		</LeftDrawer>
	)
}
