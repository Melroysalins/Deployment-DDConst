import { useEffect, useState } from 'react'
import {
	AccordionDetails as MuiAccordionDetails,
	Accordion as MuiAccordion,
	AccordionSummary as MuiAccordionSummary,
	Button,
	Box,
	Stack,
	FormControlLabel,
	Switch,
	Typography,
	Backdrop,
	Dialog,
} from '@mui/material'
import { styled } from '@mui/system'
import PropTypes, { object } from 'prop-types'
import Iconify from 'components/Iconify'
import Diagram from './Diagram'
import FormDiagram from './FormDiagram'
import {
	JUNCTION_BOX_MAP,
	defaultNewObj,
	generateEdges,
	generateNodesFromConnections,
	generateStartEndNode,
	defaultConnection,
	STATUS,
} from './diagramHelper'
import { useParams } from 'react-router-dom'
import {
	createNewProjectDiagram,
	deleteDiagramById,
	getDiagramsByProject,
	updateProjectDiagram,
} from 'supabase/project_diagram'
import { LoadingButton } from '@mui/lab'
import QuickDiagramBuilderPopup from './QuickDiagramBuilderPopup'
import { popupConfig } from './WarningDialog/dialogConfig'
import WarningDialog from './WarningDialog'

const StyledButtonContainer = styled(Box)({
	alignSelf: 'stretch',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	gap: '10px',
	padding: '24px',
	maxWidth: '1752px',
})

const Container1 = styled('div')({
	alignSelf: 'stretch',
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
})

const StyledButtonRow = styled(Box)({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	minWidth: '293px',
	height: '48px',
	gap: '8px',
})

const LeftContent = styled(Box)({
	maxWidth: '1339px',
	gap: '16px',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	fontFamily: 'Manrope',
	'@media (max-width: 1440px)': {
		maxWidth: '1119px',
	},
})

const CableContent = styled(Box)({
	height: '48px',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'flex-start',
	gap: '8px',
	minWidth: '354px',
	maxWidth: '100%',
	fontSize: '18px',
	fontFamily: 'Manrope',
	fontWeight: '500',
	'@media (max-width: 1440px)': {
		minWidth: '294px',
		fontSize: '14px',
	},
})

const RightContent = styled(Box)({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	justifyContent: 'flex-end',
	gap: '8px',
	fontFamily: 'Manrope',
	'@media (max-width: 1440px)': {
		gap: '6px',
	},
})

const StyledButton = styled(Button)({
	minWidth: '79px',
	height: '48px',
	borderRadius: '8px',
	padding: '12px 16px 12px 16px',
	border: '1px solid rgba(0, 0, 0, 0.1)',
	flex: '1',
	gap: '8px',
	fontFamily: 'Manrope',
	'@media (max-width: 1440px)': {
		minWidth: '50px',
		height: '35px',
		padding: '8px 12px 8px 12px',
		fontSize: '10px',
	},
})

const StyledLoadingButton = styled(LoadingButton)({
	minWidth: '79px',
	height: '48px',
	borderRadius: '8px',
	padding: '12px 16px 12px 16px',
	border: '1px solid rgba(0, 0, 0, 0.1)',
	flex: '1',
	gap: '8px',
	fontFamily: 'Manrope',
	'@media (max-width: 1440px)': {
		minWidth: '50px',
		height: '35px',
		padding: '8px 12px 8px 12px',
		fontSize: '10px',
	},
})

const CustomButtonRoot = styled(Button)({
	textDecoration: 'none',
	borderRadius: '8px',
	backgroundColor: 'white',
	border: '1px solid rgba(0, 0, 0, 0.1)',
	boxSizing: 'border-box',
	Width: '1664px',
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	position: 'relative',
	gap: '10px',
	fontFamily: 'Manrope',
})

const CustomButton = styled(CustomButtonRoot)({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'flex-start',
	padding: '0px 24px',
	position: 'relative',
	gap: '16px',
	width: '100%',
	height: '64px',
	fontSize: '18px',
	fontFamily: 'Manrope',
})

const CustomButtonText = styled('span')({
	flex: '1',
	position: 'relative',
	lineHeight: '24px',
	fontWeight: '600',
	color: '#919eab',
	zIndex: '2',
	textAlign: 'left',
	fontFamily: 'Manrope',
})

const DiagramParent = styled('div')({
	borderRadius: 8,
	backgroundColor: '#fff',
	border: '1px solid rgba(0, 0, 0, 0.1)',
	boxSizing: 'border-box',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	width: '41.5%',
	position: 'relative',
})

const TableParent = styled('div')({
	width: '58%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	justifyContent: 'flex-start',
	'@media (max-width: 1440px)': {},
})

const Content = styled('div')({
	width: '100%',
	height: '584.41px',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	gap: '16px',
	'@media (max-width: 1440px)': {
		width: '100%',
		height: '450.41px',
	},
})

const ContentParentRoot = styled('div')({
	maxWidth: '100%',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	textAlign: 'left',
	fontSize: '14px',
	color: '#fff',
	fontFamily: 'Manrope',
})

const DiagramHeader = styled('Box')({
	position: 'absolute',
	right: 10,
	top: 10,
})

const Tables = styled('div')({
	alignSelf: 'stretch',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	justifyContent: 'flex-start',
	overflow: 'auto',
})

const ConnectionInstallationTable = styled('div')({
	alignSelf: 'auto',
	display: 'flex',
	flex: '1 1 auto',
	flexDirection: 'row',
	flexWrap: 'wrap',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	gap: '16px',
	borderRadius: '8px',
	backgroundColor: '#fff',
	boxSizing: 'border-box',
	width: '100%',
})

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	border: '1px solid rgba(0, 0, 0, 0.1)',
	overflow: 'hidden',
	borderRadius: '12px',
	width: '1704px',
	padding: '24px 16px 24px 16px',
	gap: '16px',
	'&:not(:last-child)': {
		borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
	},
	fontFamily: 'Manrope',
	'@media (max-width: 1440px)': {
		padding: '14px 10px 14px 10px',
	},
}))

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	'& .Mui-expanded': {
		borderTopLeftRadius: '8px',
		borderTopRightRadius: '8px',
	},
	'& .MuiAccordionSummary-expandIconWrapper': {
		position: 'absolute',
		left: '0',
		marginLeft: '0',
	},
	fontFamily: 'Manrope',
	height: '48px',
	padding: '0px',
}))

const AccordionDetails = styled((props) => <MuiAccordionDetails {...props} />)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: '0px',
	fontFamily: 'Manrope',
}))

const defaultWholeObj = {
	currentObj: defaultNewObj,
	id: 1,
	nodes: [],
	edges: [],
	isEnd: false,
	isEditing: true,
	isDemolition: false,
	firstOpen: true,
	nodes_demolition: [],
	edges_demolition: [],
}

const Tasks = ({ isEditable, cancel = true, delete1 = true, save = true }) => {
	const [loading, setloading] = useState(false)
	const [expanded, setExpanded] = useState()
	const [objs, setObjs] = useState([])
	const [seqNumber, setseqNumber] = useState(1)
	const { id } = useParams()
	const [popupProps, setPopupProps] = useState({
		isOpen: false,
		title: '',
		dialogHeading: '',
		description: '',
		buttons: []
	  });
	
	  const handleClosePopup = () => setPopupProps(prev => ({ ...prev, isOpen: false }));
	
	  const handleAction = async (actionType, data) => {

		switch (actionType) {
			case 'delete':
			  handleDeleteButtonClick(data.id, data.project);
			  break;
			case 'save':
			  await handleSaveButtonClick(data);
			  break;
			case 'edit':
			  handleEditButtonClick(data.id);
			  break;
			default:
			  console.log('Unknown action type:', actionType);
		}
		handleClosePopup();
	  };
	
	  const handleOpenPopup = (type, data) => {

		const config = popupConfig[type];
		const buttons = [
		  { label: 'Cancel', onClick: handleClosePopup },
		  { label: config.buttonLabel, onClick: () => handleAction(type, data) }
		];
	
		setPopupProps({
		  isOpen: true,
		  title: config.title,
		  dialogHeading: config.dialogHeading,
		  description: config.description,
		  buttons
		});
	  };

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false)
	}

	const getDiagram = async () => {
		const { data } = await getDiagramsByProject(id)
		if (data?.length) {
			const updatedData = data.map((diagram) => ({
				...diagram,
				isEditing: false,
				isEnd: true,
				firstOpen: false,
			}))

			const ids = data.map((diagram) => diagram.id)
			setObjs(updatedData)
			const maxId = Math.max(...ids)
			setseqNumber(maxId + 1)
			const minId = Math.min(...ids)
			setExpanded(`panel${minId}`)
		}
	}

	useEffect(() => {
		getDiagram()
	}, [id])

	const handleDeleteButtonClick = (objId, hasProject) => {
		setObjs(objs.filter((obj) => obj.id !== objId))
		if (hasProject) {
			deleteDiagramById(objId)
		}
	}

	const handleSaveButtonClick = async (currentNewObj) => {
		setloading(true)
		const { nodes, edges, currentObj, project, isDemolition, nodes_demolition, edges_demolition } = currentNewObj
		const isEdit = project
		const _obj = { project: id, nodes, edges, currentObj, isDemolition, nodes_demolition, edges_demolition }
		if (isEdit) {
			await updateProjectDiagram(_obj, id)
		} else {
			const success = await createNewProjectDiagram(_obj)
			if (success.data) {
				setCurrentObj({
					objId: currentNewObj.id,
					currentObj,
					nodes,
					edges,
					project: id,
					isEditing: false,
					nodes_demolition,
					edges_demolition,
				})
			}
		}
		setloading(false)
	}

	const handleNewObjChange = (value, field, objId, connIndex, statusIndex) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = { ...obj.currentObj }
			if (connIndex === undefined) {
				updatedMainObj[field] = value
			} else if (field === 'startStatuses' || field === 'endStatuses') {
				updatedMainObj[field][connIndex] = value
			} else {
				const updatedConnections = updatedMainObj.connections.map((conn, index) => {
					if (index === connIndex) {
						if (field === 'statuses') {
							const updatedStatuses = conn.statuses.map((status, sIndex) => (sIndex === statusIndex ? value : status))
							return { ...conn, statuses: updatedStatuses }
						}
						return { ...conn, [field]: value }
					}
					return conn
				})
				updatedMainObj.connections = updatedConnections
			}
			return { ...obj, currentObj: updatedMainObj }
		})
		setObjs(updatedObjs)
	}

	const handleChangeDemolition = (value, field, objId, connIndex, statusIndex) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = { ...obj.currentObj }
			if (connIndex === undefined) {
				updatedMainObj[field] = value
			} else {
				const updatedDemolitions = updatedMainObj.demolitions.map((conn, index) => {
					if (index === connIndex) {
						if (field === 'statuses') {
							const updatedStatuses = conn.statuses.map((status, sIndex) => (sIndex === statusIndex ? value : status))
							return { ...conn, statuses: updatedStatuses }
						}
						return { ...conn, [field]: value }
					}
					return conn
				})
				updatedMainObj.demolitions = updatedDemolitions
			}
			return { ...obj, currentObj: updatedMainObj }
		})
		setObjs(updatedObjs)
	}

	const handleAddDemolition = (objId) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = {
				...obj.currentObj,
				demolitions: [...obj.currentObj.demolitions, { ...defaultConnection }],
			}
			return { ...obj, currentObj: updatedMainObj }
		})
		setObjs(updatedObjs)
	}

	const handleAddConnection = (objId) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = {
				...obj.currentObj,
				connections: [...obj.currentObj.connections, obj.currentObj.connections[obj.currentObj.connections.length - 1]],
			}
			return { ...obj, currentObj: updatedMainObj, isEnd: false }
		})
		setObjs(updatedObjs)
	}

	const handleAddMultipleConnection = (objId, midPoints = 1, midLines = 1, demolitionLines) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = { ...obj.currentObj }
			// Update connections
			for (let i = 0; i < midPoints - 1; i += 1) {
				const newConnection = { ...defaultConnection, statuses: [] }
				updatedMainObj.connections.push(newConnection)
			}

			// Update startStatuses and endStatuses
			for (let i = 0; i < Math.max(midLines, demolitionLines) - 1; i += 1) {
				updatedMainObj.startStatuses.push(STATUS[0].value)
				updatedMainObj.endStatuses.push(STATUS[0].value)
			}

			updatedMainObj.connections = updatedMainObj.connections.map((connection) => {
				while (connection.statuses.length < midLines) {
					connection.statuses.push(STATUS[0].value)
				}
				return connection
			})

			return { ...obj, currentObj: updatedMainObj, isEnd: false }
		})

		setObjs(updatedObjs)
		handleAdd()
	}

	const handleAddMultipleDemolition = (objId, demolitionPoints, demolitionLines) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = { ...obj.currentObj }
			// Update demolitions
			for (let i = 0; i < demolitionPoints - 1; i += 1) {
				const newDemolition = { ...defaultConnection }
				updatedMainObj.demolitions.push(newDemolition)
			}

			obj.isDemolition = true

			updatedMainObj.connections = updatedMainObj.demolitions.map((newDemolition) => {
				while (newDemolition.statuses.length < demolitionLines) {
					newDemolition.statuses.push(STATUS[0].value)
				}
				return newDemolition
			})

			return { ...obj, currentObj: updatedMainObj }
		})
		setObjs(updatedObjs)
		handleAdd()
	}

	const handleAdd = () => {
		const updatedObjs = objs.map((obj) => {
			const yPos = 200
			const objNodes = [
				...generateNodesFromConnections({
					id: obj.id,
					connections: obj.currentObj.connections,
					yPos,
				}),
				...generateStartEndNode({
					seqNumber: obj.id,
					yPos: 50,
					startName: obj.currentObj.start,
					endName: obj.currentObj.end,
					connectionLength: obj.currentObj.connections.length,
					startType: obj.currentObj.startConnector,
					endType: obj.currentObj.endConnector,
					startStatuses: obj.currentObj.startStatuses,
					endStatuses: obj.currentObj.endStatuses,
					startEndLength: obj.currentObj.connections[0]?.statuses.length,
				}),
			]
			const objEdges = generateEdges(obj.id, obj.currentObj)

			// Demolition
			const { isDemolition } = obj
			let objNodesDemolition = []
			let objEdgesDemolition = []
			if (isDemolition) {
				objNodesDemolition = [
					...generateNodesFromConnections({
						id: obj.id,
						connections: obj.currentObj.demolitions,
						yPos,
						isDemolition: true,
					}),
					...generateStartEndNode({
						seqNumber: obj.id,
						yPos: 30,
						startName: obj.currentObj.start,
						endName: obj.currentObj.end,
						connectionLength: obj.currentObj.demolitions.length,
						startType: obj.currentObj.startConnector,
						endType: obj.currentObj.endConnector,
						startStatuses: obj.currentObj.startStatuses,
						endStatuses: obj.currentObj.endStatuses,
						startEndLength: obj.currentObj.demolitions[0]?.statuses.length,
					}),
				]

				objEdgesDemolition = generateEdges(obj.id, obj.currentObj, true)
			}

			return {
				...obj,
				nodes: objNodes,
				edges: objEdges,
				edges_demolition: objEdgesDemolition,
				nodes_demolition: objNodesDemolition,
				currentObj: {
					...obj.currentObj,
					demolitions: isDemolition ? obj.currentObj.demolitions : [defaultConnection],
					length_demolition: isDemolition ? obj.currentObj.length_demolition : 600,
				},
			}
		})
		setObjs(updatedObjs)
	}

	const handleAddNewObj = () => {
		const newObj = { ...JSON.parse(JSON.stringify({ ...defaultWholeObj, id: seqNumber })) }
		setObjs([...objs, newObj])
		setseqNumber((prev) => {
			const newSeqNumber = prev + 1
			return newSeqNumber
		})
		setExpanded(`panel${objs.length + 1}`)
	}

	const updateObjById = (objId, updateFn) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id === objId) {
				return updateFn(obj)
			}
			return obj
		})
		setObjs(updatedObjs)
	}

	const handleEditButtonClick = (objId) => {
		updateObjById(objId, (obj) => ({
			...obj,
			isEditing: !obj.isEditing,
		}))
	}

	const toggleDemolition = (objId) => {
		updateObjById(objId, (obj) => ({
			...obj,
			isDemolition: !obj.isDemolition,
		}))
	}

	const handleCloseInstallation = (objId) => {
		updateObjById(objId, (obj) => ({
			...obj,
			isEnd: true,
		}))
	}

	const setCurrentObj = ({
		objId,
		currentObj,
		nodes,
		edges,
		project = null,
		isEditing,
		edges_demolition,
		nodes_demolition,
	}) => {
		updateObjById(objId, (obj) => ({
			...obj,
			currentObj,
			nodes: nodes || obj.nodes,
			edges: edges || obj.edges,
			project: project || obj.project,
			isEditing,
			nodes_demolition: nodes_demolition || obj.nodes_demolition,
			edges_demolition: edges_demolition || obj.edges_demolition,
		}))
	}

	return (
		<StyledButtonContainer>
			{objs.map((newObj, index) => (
				<ContentParentRoot key={index}>
					<Accordion
						expanded={expanded === `panel${index + 1}`}
						onChange={handleChange(`panel${index + 1}`)}
						key={index}
					>
						<AccordionSummary
							expandIcon={<Iconify icon="material-symbols:expand-more-rounded" width={20} height={20} />}
							aria-controls={`panel${objs.length}-content`}
							id={`panel${objs.length}-header`}
						>
							<Stack
								gap={2}
								direction="row"
								alignItems="center"
								sx={{ width: '100%' }}
								justifyContent={'space-between'}
							>
								<LeftContent sx={{ position: 'relative', left: '2rem', textAlign: 'center' }}>
									<CableContent>
										Cable Name:<span style={{ fontWeight: '600' }}>154kV Namyang - Yeonsu T/L</span>
									</CableContent>
									<CableContent>
										Cable Name:<span>154kV Namyang - Yeonsu T/L</span>
									</CableContent>
								</LeftContent>
								<RightContent onClick={(event) => event.stopPropagation()}>
									{cancel && newObj.isEditing && newObj.project && (
										<StyledButton
											onClick={() => handleEditButtonClick(newObj.id)}
											style={{ boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)' }}
											variant="outlined"
											sx={{
												borderRadius: '8px',
												backgroundColor: '#FFFFFF',
											}}
										>
											Cancel
										</StyledButton>
									)}
									{delete1 && (
										<StyledButton
											onClick={() => handleOpenPopup('delete', {id: newObj.id, project: newObj.project})}
											style={{ boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)' }}
											variant="outlined"
											sx={{
												borderRadius: '8px',
												backgroundColor: '#FFFFFF',
											}}
										>
											<Stack gap={1} direction="row" alignItems="center">
												<Iconify icon="mi:delete" width={20} height={20} />
												Delete
											</Stack>
										</StyledButton>
									)}
									{save && (!newObj.project || newObj.isEditing) && (
										<StyledLoadingButton
											disabled={!newObj.edges.length}
											loading={loading && expanded === `panel${newObj.id}`}
											onClick={() => handleOpenPopup('save', newObj)}
											style={{ boxShadow: '0px 8px 16px rgba(141, 153, 255, 0.24)' }}
											variant="contained"
											sx={{
												borderRadius: '8px',
												backgroundColor: '#8D99FF',
											}}
										>
											<Iconify icon="heroicons-outline:save" width={20} height={20} />
											{newObj.project ? 'Update' : 'Save'}
										</StyledLoadingButton>
									)}
									{isEditable && newObj.project && !newObj.isEditing && (
										<StyledButton
											onClick={() => handleOpenPopup('edit', {id: newObj.id})}
											style={{ boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)' }}
											variant="outlined"
											sx={{
												width: '150px',
												borderRadius: '8px',
												backgroundColor: '#FFFFFF',
											}}
										>
											<Stack gap={1} direction="row" alignItems="center">
												<Iconify icon="mi:edit" width={20} height={20} />
												Edit
											</Stack>
										</StyledButton>
									)}
									<img
										sx={{
											width: '40px',
											borderRadius: '8px',
											height: '96px',
											objectFit: 'contain',
										}}
										alt=""
										src="/button@2x.png"
									/>
								</RightContent>
							</Stack>
						</AccordionSummary>
						<AccordionDetails>
							<QuickDiagramBuilderPopup
								objId={newObj.id}
								obj={newObj}
								handleAddConnection={handleAddMultipleConnection}
								handleAddDemolition={handleAddMultipleDemolition}
								updateObjById={updateObjById}
							/>
							<Content>
								<DiagramParent>
									<DiagramHeader>
										{(newObj.isEditing || !newObj.project) && (
											<Button
												onClick={handleAdd}
												sx={{
													backgroundColor: '#F3F3F5',
													color: '#596570',
													display: 'flex',
													gap: '4px',
													padding: '0px 12px 0px 12px',
													height: '32px',
												}}
											>
												<Iconify icon="ic:baseline-cached" width={16} height={16} />
												Update
											</Button>
										)}
									</DiagramHeader>
									<Container1>
										<Diagram
											nodes={newObj.nodes}
											edges={newObj.edges}
											setCurrentObj={setCurrentObj}
											currentObj={newObj.currentObj}
											objId={newObj.id}
											newObj={newObj}
										/>

										{newObj.isDemolition && !!newObj.nodes_demolition.length && (
											<Diagram
												nodes={newObj.nodes_demolition}
												edges={newObj.edges_demolition}
												setCurrentObj={setCurrentObj}
												currentObj={newObj.currentObj}
												objId={newObj.id}
												isDemolition={true}
												newObj={newObj}
											/>
										)}
									</Container1>
								</DiagramParent>
								<TableParent>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'flex-start',
											justifyContent: 'flex-start',
											padding: '8px 0px',
										}}
									>
										<FormControlLabel
											control={
												<Switch
													disabled={newObj.project && !newObj.isEditing}
													checked={newObj.isDemolition}
													onChange={() => toggleDemolition(newObj.id)}
													color="primary"
												/>
											}
											label="Demolition"
											sx={{ color: 'black', fontFamily: 'Manrope, sans-serif' }}
										/>
									</Box>
									<Tables>
										<ConnectionInstallationTable>
											<FormDiagram
												newObj={newObj}
												handleNewObjChange={handleNewObjChange}
												handleAddConnection={handleAddConnection}
												index={index}
												isEdit={newObj.isEditing}
												handleCloseInstallation={handleCloseInstallation}
												handleChangeDemolition={handleChangeDemolition}
												handleAddDemolition={handleAddDemolition}
												isDemolition={newObj.isDemolition}
											/>
										</ConnectionInstallationTable>
									</Tables>
								</TableParent>
							</Content>
						</AccordionDetails>
						<Box
							sx={{
								position: 'absolute',
								top: '0',
								left: '0',
								width: '4px',
								height: '100%',
								zIndex: '0',
								backgroundColor: '#8D99FF',
								borderTopLeftRadius: '8px',
								borderBottomLeftRadius: '8px',
							}}
						/>
					</Accordion>
					{expanded === `panel${newObj.id}` && (
						<Box
							sx={{
								minHeight: '96px',
								width: '100%',
								maxWidth: '28px',
								borderRadius: '0px 8px 8px 0px',
								backgroundColor: '#ffa58d',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '16px 2px',
								boxSizing: 'border-box',
							}}
						>
							<Typography
								sx={{
									writingMode: 'vertical-rl',
									fontWeight: '600',
									color: '#fff',
								}}
							>
								Summary
							</Typography>
						</Box>
					)}
				</ContentParentRoot>
			))}
			<CustomButton onClick={handleAddNewObj}>
				<Iconify icon="ic:round-plus" width={20} height={20} />
				<CustomButtonText>Add Diagram</CustomButtonText>
			</CustomButton>
			<StyledButtonRow sx={{ paddingTop: '8px' }}>
				<StyledButton
					variant="contained"
					sx={{ marginRight: '16px', borderRadius: '8px', backgroundColor: '#8D99FF', width: '200px', height: '40px' }}
				>
					<Iconify icon="heroicons-outline:save" width={20} height={20} />
					Save
				</StyledButton>
				<StyledButton
					variant="contained"
					sx={{ borderRadius: '8px', backgroundColor: '#FFA58D', width: '200px', height: '40px' }}
				>
					Continue
					<Iconify icon="lucide:arrow-right" width={20} height={20} />
				</StyledButton>
			</StyledButtonRow>
			<WarningDialog {...popupProps} onClose={handleClosePopup} /> 
		</StyledButtonContainer>
	)
}

Tasks.propTypes = {
	cancel: PropTypes.bool,
	delete1: PropTypes.bool,
	save: PropTypes.bool,
	isEditable: PropTypes.bool,
}

export default Tasks
