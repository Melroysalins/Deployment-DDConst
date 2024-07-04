/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material'
import { React, useState } from 'react'
import { styled } from '@mui/material/styles'
import ConnectionTable from './ConnectionTable'
import InstallationTable from './InstallationTable'
import DemolitionTable from './DemolitionTable'
import PropTypes from 'prop-types'
import { JB_TYPE } from './diagramHelper'

const StyledConnection = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	position: 'relative',
	gap: '8px',
})

const StyledInstallation = styled(Box)({
	flex: '1 1 auto',
	alignSelf: 'stretch',
	borderRadius: '8px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	fontSize: '14px',
	color: '#596570',
	gap: '8px',
	marginBottom: 10,
})

const StyledDemolition = styled(Box)({
	flex: '1 1 auto',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-end',
	gap: '8px',
	borderRadius: '8px',
	backgroundColor: '#fff',
	alignSelf: 'auto',
})

const StyledTypography = styled(Typography)({
	'@media (max-width: 1440px)': {
		fontSize: '10px',
		padding: '2px',
	},
	'@media (max-width: 1336px)': {
		fontSize: '8px',
		padding: '1px',
	},
	'@media (max-width: 1280px)': {
		fontSize: '6px',
		padding: '1px',
	},
})

const HeaderText = ({ title, color, newObj, isDemolition }) => (
	<Box
		sx={{
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'flex-start',
			padding: '0px 0px 0px 6px',
			gap: '4px',
			fontSize: '18px',
			color: { color },
			fontFamily: 'Manrope',
			marginLeft: '24px',
			'@media (max-width: 1440px)': {
				fontSize: '14px',
			},
		}}
	>
		<Box
			sx={{
				position: 'relative',
				lineHeight: '24px',
				fontWeight: '600',
			}}
		>
			{title}
		</Box>
		<Box
			sx={{
				flex: '1',
				position: 'relative',
				fontSize: '16px',
				color: '#596570',
				display: 'flex',
				alignItems: 'center',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				height: '22px',
				'@media (max-width: 1440px)': {
					fontSize: '10px',
				},
			}}
		>
			<StyledTypography>
				<StyledTypography sx={{ lineHeight: '28px', fontWeight: '600' }} component="span">
					{newObj?.currentObj?.[isDemolition ? 'demolitions' : 'connections'].length} Points
				</StyledTypography>
				<StyledTypography sx={{ lineHeight: '26px' }} component="span">{`(J/B ${
					newObj?.currentObj?.[isDemolition ? 'demolitions' : 'connections'].filter(
						(e) => e.joinType === JB_TYPE[0].value
					).length
				} Points + M/H ${
					newObj?.currentObj?.[isDemolition ? 'demolitions' : 'connections'].filter(
						(e) => e.joinType === JB_TYPE[1].value
					).length
				} Points) x `}</StyledTypography>
				<StyledTypography sx={{ lineHeight: '28px', fontWeight: '600' }} component="span">
					2 Lines
				</StyledTypography>
				<StyledTypography sx={{ lineHeight: '26px' }} component="span">
					(aka T/R | S/S)
				</StyledTypography>
			</StyledTypography>
		</Box>
	</Box>
)

export default function FormDiagram({
	handleNewObjChange,
	newObj,
	handleAddConnection,
	isEdit,
	isDemolition,
	handleCloseInstallation,
	handleChangeDemolition,
	handleAddDemolition,
	handleAddNote,
}) {
	const [isExpanded, setIsExpanded] = useState(false)

	const toggleExpand = () => {
		setIsExpanded((prevIsExpanded) => !prevIsExpanded)
	}

	return (
		<>
			<StyledConnection>
				<HeaderText title="Connection" color="#ffa58d" newObj={newObj} />
				{newObj?.currentObj?.startStatuses && (
					<ConnectionTable
						handleAddConnection={handleAddConnection}
						handleCloseInstallation={handleCloseInstallation}
						handleNewObjChange={handleNewObjChange}
						newObj={newObj}
						isEdit={isEdit}
						isExpanded={isExpanded}
						toggleExpand={toggleExpand}
						handleAddNote={handleAddNote}
					/>
				)}
			</StyledConnection>
			<StyledInstallation>
				<HeaderText title="Installation" color="#6ac79b" newObj={newObj} />
				{newObj?.currentObj?.startStatuses && (
					<InstallationTable
						handleNewObjChange={handleNewObjChange}
						newObj={newObj}
						isEdit={isEdit}
						isExpanded={isExpanded}
						toggleExpand={toggleExpand}
						handleAddNote={handleAddNote}
					/>
				)}
			</StyledInstallation>
			{isDemolition && (
				<StyledDemolition>
					<HeaderText title="Demolition" color="#7FBCFE" newObj={newObj} isDemolition={true} />
					{newObj?.currentObj?.startStatuses && (
						<DemolitionTable
							handleAddDemolition={handleAddDemolition}
							handleChangeDemolition={handleChangeDemolition}
							newObj={newObj}
							isEdit={isEdit}
							handleAddNote={handleAddNote}
						/>
					)}
				</StyledDemolition>
			)}
		</>
	)
}

FormDiagram.propTypes = {
	handleNewObjChange: PropTypes.func.isRequired,
	newObj: PropTypes.object.isRequired,
	handleAddConnection: PropTypes.func.isRequired,
	isEdit: PropTypes.bool,
	isDemolition: PropTypes.bool,
	handleCloseInstallation: PropTypes.func.isRequired,
	handleChangeDemolition: PropTypes.func.isRequired,
	handleAddDemolition: PropTypes.func.isRequired,
	handleAddNote: PropTypes.func.isRequired,
}
