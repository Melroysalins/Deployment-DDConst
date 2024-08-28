/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material'
import { React, useState } from 'react'
import { styled } from '@mui/material/styles'
import ConnectionTable from './ConnectionTable'
import InstallationTable from './InstallationTable'
import DemolitionTable from './DemolitionTable'
import DemolitionInstallation from './DemolitionInstallation'
import PropTypes from 'prop-types'
import { JB_TYPE, PMJ } from './diagramHelper'

const StyledRowTables = styled(Box)(({ flexDirection }) => ({
	display: 'flex',
	flexDirection,
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	width: '100%',
	gap: '16px',
}));

const StyledConnection = styled(Box)(({ connectionTableWidth }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	position: 'relative',
	gap: '8px',
	width: connectionTableWidth,
}));

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

const StyledDemolition = styled(Box)(({ demolitionTableWidth }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	position: 'relative',
	gap: '8px',
	width: demolitionTableWidth,
}));

const StyledTypography = styled(Typography)({
	'@media (max-width: 1723px)': {
		fontSize: '14px',
		padding: '2px',
	},
	'@media (max-width: 1610px)': {
		fontSize: '13px',
	},
	'@media (max-width: 1530px)': {
		fontSize: '12px',
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
			fontSize: '18px',
			flexWrap: 'nowrap',
			color: { color },
			fontFamily: "'Manrope', sans-serif",
			'@media (max-width: 1723px)': {
				fontSize: '16px',
			},
			'@media (max-width: 1610px)': {
				fontSize: '15px',
			},
			'@media (max-width: 1530px)': {
				fontSize: '14px',
			},
		}}
	>
		<Box
			sx={{
				position: 'relative',
				lineHeight: '24px',
				fontWeight: '600',
				whiteSpace: 'nowrap', // Keep this text in a single line
                overflow: 'hidden', // Hide overflow
                textOverflow: 'ellipsis', // Add ellipsis for overflow
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
			}}
		>
			{ title === 'Installation' ? (
				<StyledTypography>
					<StyledTypography sx={{ lineHeight: '28px', fontWeight: '600' }} component="span">
						{(newObj?.currentObj?.connections.length + 2) * newObj.currentObj?.connections[0]?.statuses?.length} Sections
					</StyledTypography>
					<StyledTypography sx={{ lineHeight: '26px' }} component="span">
						{`(${newObj?.currentObj?.connections.length + 2} Sections) x ${newObj.currentObj?.connections[0]?.statuses?.length} Lines`}
					</StyledTypography>
				</StyledTypography>
			) : (
				<StyledTypography>
					<StyledTypography sx={{ lineHeight: '28px', fontWeight: '600' }} component="span">
						{newObj?.currentObj?.[isDemolition ? 'demolitions' : 'connections'].length} Points
					</StyledTypography>
					<StyledTypography sx={{ lineHeight: '26px' }} component="span">{`(IJ ${
						newObj?.currentObj?.[isDemolition ? 'demolitions' : 'connections'].filter(
							(e) => e.pmj === PMJ[1]
						).length
					} Points, NJ ${
						newObj?.currentObj?.[isDemolition ? 'demolitions' : 'connections'].filter(
							(e) => e.pmj === PMJ[0]
						).length
					} Points) x `}</StyledTypography>
					<StyledTypography sx={{ lineHeight: '28px', fontWeight: '600' }} component="span">
					{`${(newObj.currentObj?.[isDemolition ? 'demolitions' : 'connections'][0]?.statuses?.length || 0)} Lines`}
					</StyledTypography>
				</StyledTypography>
			)}
		</Box>
	</Box>
)

export default function FormDiagram({
	handleNewObjChange,
	newObj,
	handleAddConnection,
	isEdit,
	isDemolition,
	handleChangeDemolition,
	handleAddDemolition,
	handleChangeInstallation,
	handleAddNote,
	handleDeleteRow,
}) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [isDemolitionExpanded, setIsDemolitionExpanded] = useState(false)

	const toggleExpand = () => {
		setIsExpanded((prevIsExpanded) => !prevIsExpanded)
	}

	const toggleDemolitionExpand = () => {
		console.log('toggleDemolitionExpand')
		setIsDemolitionExpanded((prevIsDemolitionExpand) => !prevIsDemolitionExpand)
	}

	const statuses_length = newObj?.currentObj?.connections[0]?.statuses?.length;
	const flexDirection = statuses_length > 2 ? 'column' : 'row';
	const connectionTableWidth = statuses_length > 2 ? '100%' : '';
	const demolition_length = newObj?.currentObj?.demolitions[0]?.statuses?.length;
	const demolitionTableWidth = demolition_length > 2 ? '100%' : '';
	return (
		<>
			<StyledRowTables flexDirection={flexDirection}>
				<StyledConnection connectionTableWidth={connectionTableWidth}>
					<Box sx={{ marginLeft: '19px'}}>
						<HeaderText title="Connection" color="#ffa58d" newObj={newObj} />
					</Box>
					{newObj?.currentObj?.startStatuses && (
						<ConnectionTable
							handleAddConnection={handleAddConnection}
							handleNewObjChange={handleNewObjChange}
							newObj={newObj}
							isEdit={isEdit}
							isExpanded={isExpanded}
							toggleExpand={toggleExpand}
							handleAddNote={handleAddNote}
							handleDeleteRow={handleDeleteRow}
						/>
					)}
				</StyledConnection>
				<StyledInstallation>
					<HeaderText title="Installation" color="#6ac79b" newObj={newObj} />
					{newObj?.currentObj?.startStatuses && (
						<InstallationTable
							handleChangeInstallation={handleChangeInstallation}
							newObj={newObj}
							isEdit={isEdit}
							isExpanded={isExpanded}
							toggleExpand={toggleExpand}
							handleAddNote={handleAddNote}
							handleDeleteRow={handleDeleteRow}
						/>
					)}
				</StyledInstallation>
			</StyledRowTables>
			{isDemolition && (
				<StyledRowTables flexDirection={flexDirection}>
					<StyledDemolition demolitionTableWidth={demolitionTableWidth}>
						<Box sx={{ marginLeft: '19px'}}>
							<HeaderText title="Demolition" color="#7FBCFE" newObj={newObj} isDemolition={true} />
						</Box>
						{newObj?.currentObj?.startStatuses && (
							<DemolitionTable
							handleAddDemolition={handleAddDemolition}
							handleAddConnection={handleAddConnection}
							handleChangeDemolition={handleChangeDemolition}
							newObj={newObj}
							isEdit={isEdit}
							isDemolitionExpanded={isDemolitionExpanded}
							toggleDemolitionExpand={toggleDemolitionExpand}
							handleAddNote={handleAddNote}
							handleDeleteRow={handleDeleteRow}
							handleNewObjChange={handleNewObjChange}
						/>
						)}
					</StyledDemolition>
					<StyledInstallation>
						<HeaderText title="Installation" color="#6ac79b" newObj={newObj} />
						{newObj?.currentObj?.startStatuses && (
							<DemolitionInstallation
								handleChangeInstallation={handleChangeInstallation}
								newObj={newObj}
								isEdit={isEdit}
								isDemolitionExpanded={isDemolitionExpanded}
								toggleDemolitionExpand={toggleDemolitionExpand}
								handleAddNote={handleAddNote}
								handleDeleteRow={handleDeleteRow}
							/>
						)}
					</StyledInstallation>
				</StyledRowTables>
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
	handleChangeDemolition: PropTypes.func.isRequired,
	handleAddDemolition: PropTypes.func.isRequired,
	handleChangeInstallation: PropTypes.func.isRequired,
	handleAddNote: PropTypes.func.isRequired,
	handleDeleteRow: PropTypes.func.isRequired,
}
