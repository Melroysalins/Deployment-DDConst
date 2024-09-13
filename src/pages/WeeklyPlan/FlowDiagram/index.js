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
	Drawer,
} from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Iconify from 'components/Iconify'
import Diagram from './Diagram'
import FormDiagram from './FormDiagram'
import {
	defaultNewObj,
	generateEdges,
	generateNodesFromConnections,
	generateStartEndNode,
	defaultConnection,
	STATUS,
	defaultCableName,
	defaultCableType,
	defaultEndpoints,
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
import DropdownPopover from 'components/Drawer/DropdownDrawer'
import { createNewProjectDiagramTable, getTableByProjectDiagram, updateProjectDiagramTable } from 'supabase/project_diagrams_table'

const StyledButtonContainer = styled(Box)({
	alignSelf: 'stretch',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	gap: '10px',
	padding: '16px',
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
	maxWidth: '1323px',
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
	minWidth: '294px',
	width: '100%',
	fontSize: '18px',
	fontFamily: 'Manrope',
	fontWeight: '500',	
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
	height: '48px',
	borderRadius: '8px',
	padding: '12px 16px 12px 16px',
	border: '1px solid rgba(0, 0, 0, 0.1)',
	gap: '8px',
	fontFamily: 'Manrope',
	'@media (max-width: 1680px)': {
		height: '40px',
		padding: '8px 12px 8px 12px',
		fontSize: '14px',
	},
})

const StyledLoadingButton = styled(LoadingButton)({
	height: '48px',
	borderRadius: '8px',
	padding: '12px 16px 12px 16px',
	border: '1px solid rgba(0, 0, 0, 0.1)',
	gap: '8px',
	fontFamily: 'Manrope',
	'@media (max-width: 1680px)': {
		height: '40px',
		padding: '8px 12px 8px 12px',
		fontSize: '14px',
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
	minHeight: '584.41px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	width: '100%',
	position: 'relative',
	'@media (max-width: 1440px)': {
		minHeight: '450.41px',
	},
})

const DiagramDemolitionParent = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	justifyContent: 'center',
	width: '39.58%',
	height: '100%',
	position: 'relative',
})

const TableParent = styled('div')({
	width: '58%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	justifyContent: 'flex-start',
})

const Content = styled('div')({
	marginTop: '16px',
	width: '100%',
	minHeight: '584.41px',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	gap: '16px',
	'@media (max-width: 1440px)': {
		width: '100%',
		minHeight: '450.41px',
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
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	position: 'absolute',
	right: 0,
	top: 5,
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
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	gap: '16px',
	borderRadius: '8px',
	backgroundColor: '#fff',
	boxSizing: 'border-box',
	width: '100%',
	paddingBottom: '16px',
})

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
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
	isDemolitionEnd: false,
	isEditing: true,
	isDemolition: false,
	firstOpen: true,
	cable_name: defaultCableName,
	cable_type: defaultCableType,
	demolition_type: defaultCableType,
	nodes_demolition: [],
	edges_demolition: [],
}

const Tasks = ({ isEditable, cancel = true, delete1 = true, save = true }) => {
	const [loading, setloading] = useState(false)
	const [expanded, setExpanded] = useState()
	const [objs, setObjs] = useState([])
	const [hasChanges, setHasChanges] = useState(false)
	const [seqNumber, setseqNumber] = useState(1)
	const { id } = useParams()
	const [popupProps, setPopupProps] = useState({
		isOpen: false,
		title: '',
		dialogHeading: '',
		description: '',
		buttons: []
	  });

	  useEffect(() => {
        if (objs !== null && hasChanges) {
            handleAdd();
			setHasChanges(false);
        }

	  }, [objs, hasChanges]);
	
	  const handleClosePopup = () => setPopupProps(prev => ({ ...prev, isOpen: false }));
	
	  const handleAction = async (actionType, data) => {

		switch (actionType) {
			case 'delete':
			  handleDeleteButtonClick(data.id, data.project);
			  break;
			case 'save':
			  await handleSaveButtonClick(data);
			  if (data.project) { 
                handleEditButtonClick(data.id);
			  }
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
		const { data } = await getDiagramsByProject(id);
		if (data?.length) {
			const updatedData = await Promise.all(
				data.map(async (diagram) => {
					const tableData1 = await getTableByProjectDiagram(diagram.id, false);
					const tableData2 = await getTableByProjectDiagram(diagram.id, true);
					return {
						...diagram,
						currentObj: {
							connections: tableData1.data.midpoints || [],
							installations: tableData1.data?.installations || [],
							demolitions: tableData2.data?.midpoints || [],
							demolitionInstallations: tableData2.data?.installations || [],
							length: tableData1.data?.length || [],
							length_demolition: tableData2.data?.length || [],
							endpoints: tableData1.data?.endpoints || [],
							endpointsDemolition: tableData2.data?.endpoints || [],
						},
						nodes: tableData1.data.nodes,
						edges: tableData1.data.edges,
						nodes_demolition: tableData2?.data?.nodes || [],
						edges_demolition: tableData2?.data?.edges || [],
						isEditing: false,
						isEnd: true,
						isDemolitionEnd: true,
						firstOpen: false,
					};
				})
			);
			const ids = data.map((diagram) => diagram.id);
			setObjs(updatedData);
			const maxId = Math.max(...ids);
			setseqNumber(maxId + 1);
			const minId = Math.min(...ids);
			setExpanded(`panel${minId}`);
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
		setloading(true);
		const { nodes, edges, currentObj, project, isDemolition, cable_name, cable_type, demolition_type, nodes_demolition, edges_demolition } = currentNewObj;
		const isEdit = project;
		const diagram_data = { project: id, isDemolition, cable_name, cable_type, demolition_type };
		const _obj_new_section = {
			nodes,
			edges,
			endpoints: currentObj?.endpoints || [],
			midpoints: currentObj?.connections || [],
			installations: currentObj?.installations || [],
			length: currentObj?.length || [],
			isDemolition: false,
		};
		const _obj_old_section = {
			nodes: nodes_demolition,
			edges: edges_demolition,
			endpoints: currentObj?.endpointsDemolition || [],
			midpoints: currentObj?.demolitions || [],
			installations: currentObj?.demolitionInstallations || [],
			length: currentObj?.length_demolition || [],
			isDemolition: true,
		};
	
		if (isEdit) {
			const res = await updateProjectDiagram(diagram_data, currentNewObj.id);
			if (res.data) {
				const updated_obj_new_section = {
					..._obj_new_section,
					project_diagram: res.data[0].id,
				};
				const save1 = await updateProjectDiagramTable(updated_obj_new_section, res.data[0].id, false)
				const updated_obj_old_section = {
					..._obj_old_section,
					project_diagram: res.data[0].id,
				};
				const save2 = await updateProjectDiagramTable(updated_obj_old_section, res.data[0].id, true)
			}
		} else {
			const diagram_data_success = await createNewProjectDiagram(diagram_data);
			if (diagram_data_success.data) {
				const project_diagram_id = diagram_data_success.data[0].id;
				const updated_obj_new_section = {
					..._obj_new_section,
					project_diagram: project_diagram_id,
				};
				const updated_obj_old_section = {
					..._obj_old_section,
					project_diagram: project_diagram_id,
				};
	
				const newSectionSuccess = await createNewProjectDiagramTable(updated_obj_new_section);
				const oldSectionSuccess = await createNewProjectDiagramTable(updated_obj_old_section);
	
				if (newSectionSuccess.data && oldSectionSuccess.data) {
					setCurrentObj({
						objId: currentNewObj.id,
						currentObj,
						nodes,
						edges,
						project: id,
						isEditing: false,
						cable_name,
						cable_type,
						demolition_type,
						nodes_demolition,
						edges_demolition,
						id: project_diagram_id,
					});
				}
			}
		}
		setloading(false);
	};

	const handleNewObjChange = (value, field, objId, connIndex, statusIndex) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = { ...obj.currentObj }
			if (connIndex === undefined) {
				updatedMainObj.endpoints[field] = value
			} else if (field === 'startStatuses' || field === 'endStatuses') {
				updatedMainObj.endpoints[field][connIndex] = value
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
			return { ...obj, currentObj: updatedMainObj}
		})
		setObjs(updatedObjs)
		setHasChanges(true)
	}

	const handleChangeInstallation = (value, field, objId, connIndex, statusIndex) => {

		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = { ...obj.currentObj }
			if (field === 'length') {
				updatedMainObj[field][connIndex] = value
			} else if (field === 'length_demolition') {
				updatedMainObj[field][connIndex] = value
			} else if (field === 'statuses_installation') {
				const updatedInstallations = updatedMainObj.installations.map((conn, index) => {
					if (index === connIndex) {
						const updatedStatuses = conn.statuses.map((status, sIndex) => (sIndex === statusIndex ? value : status))
						return { ...conn, statuses: updatedStatuses }
					}
					return conn
				})
				updatedMainObj.installations = updatedInstallations
			} else {
				const updatedInstallations = updatedMainObj.demolitionInstallations.map((conn, index) => {
					if (index === connIndex) {
						const updatedStatuses = conn.statuses.map((status, sIndex) => (sIndex === statusIndex ? value : status))
						return { ...conn, statuses: updatedStatuses }
					}
					return conn
				})
				updatedMainObj.demolitionInstallations = updatedInstallations
			}
			return { ...obj, currentObj: updatedMainObj }
		})
		setObjs(updatedObjs)
		setHasChanges(true)
	}

	const handleChangeDemolition = (value, field, objId, connIndex, statusIndex) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = { ...obj.currentObj }
			if (connIndex === undefined) {
				updatedMainObj.endpointsDemolition[field] = value
			} else if (field === 'startStatuses' || field === 'endStatuses') {
				updatedMainObj.endpointsDemolition[field][connIndex] = value
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
			return { ...obj, currentObj: updatedMainObj}
		})
		setObjs(updatedObjs)
		setHasChanges(true)
	}

	const handleAddDemolition = (objId) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj;
	
			const numberOfStatuses = obj.currentObj.endpointsDemolition.startStatuses.length;
			const newDemolition = { 
				...defaultConnection,
				statuses: [ ...Array(numberOfStatuses).fill(STATUS[0].value)], // Add the number of statuses
			}; // Copy last demolition without the note or with a reset note
	
			// Ensure not to add an undefined demolition if there's no last demolition
			const updatedDemolitions = [...obj.currentObj.demolitions, newDemolition];
	
			// Define the structure of a new installation
			const newInstallation = {
				statuses: [ ...Array(numberOfStatuses).fill(STATUS[0].value)],
				note: '',
				// Add other necessary fields with default values
			};
			const updatedInstallations = [...obj.currentObj.demolitionInstallations, newInstallation];	

			const updatedMainObj = {
				...obj.currentObj,
				demolitions: updatedDemolitions,
				demolitionInstallations: updatedInstallations,
				length_demolition: [...obj.currentObj.length_demolition, 600],
			};
			return { ...obj, currentObj: updatedMainObj};
		});
		setObjs(updatedObjs);
		setHasChanges(true)
	}

	const handleAddConnection = (objId) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj;
	
			const numberOfStatuses = obj.currentObj.endpoints.startStatuses.length;

			// Create a new connection based on defaultConnection and add the number of statuses
			const newConnection = { 
				...defaultConnection,
				statuses: [ ...Array(numberOfStatuses).fill(STATUS[0].value)], // Add the number of statuses
			};
			const updatedConnections = [...obj.currentObj.connections, newConnection];
		
			// Define the structure of a new installation
			const newInstallation = {
				statuses: [ ...Array(numberOfStatuses).fill(STATUS[0].value)],
				note: '',
				// Add other necessary fields with default values
			};
			const updatedInstallations = [...obj.currentObj.installations, newInstallation];	

			const updatedMainObj = {
				...obj.currentObj,
				connections: updatedConnections,
				installations: updatedInstallations,
				length: [...obj.currentObj.length, 600],
			};
			return { ...obj, currentObj: updatedMainObj};
		});
		setObjs(updatedObjs);
		setHasChanges(true)
	}

	const handleChangeStatus = (objId, midlines, type) => {
		const updatedObjs = objs.map((obj) => {
		  if (obj.id !== objId) return obj;
	  
		  const updatedMainObj = { ...obj.currentObj };
		  const defaultStatus = STATUS[0].value; // Define your default status value here
	  
		  const updateStatuses = (statuses) => {
			if (midlines < statuses.length) {
			  return statuses.slice(0, midlines);
			}
			return [...statuses, ...Array(midlines - statuses.length).fill(defaultStatus)];
		  };
	  
		  if (type === 'cable_type') {
			updatedMainObj.connections = updatedMainObj.connections.map((connection) => {
				connection.statuses = updateStatuses(connection.statuses);
				return connection;
			  });
		  
			  updatedMainObj.installations = updatedMainObj.installations.map((installation) => {
				installation.statuses = updateStatuses(installation.statuses);
				return installation;
			  });
		  
			  updatedMainObj.endpoints.startStatuses = updateStatuses(updatedMainObj.endpoints.startStatuses || []);
			  updatedMainObj.endpoints.endStatuses = updateStatuses(updatedMainObj.endpoints.endStatuses || []);

			  obj.cable_type.tlCount = midlines;
		  } 
		  if (type === 'demolition_type') {
			updatedMainObj.demolitions = updatedMainObj.demolitions.map((demolition) => {
				demolition.statuses = updateStatuses(demolition.statuses);
				return demolition;
			});

			updatedMainObj.demolitionInstallations = updatedMainObj.demolitionInstallations.map((demolitionInstallation) => {
				demolitionInstallation.statuses = updateStatuses(demolitionInstallation.statuses);
				return demolitionInstallation;
			});

			updatedMainObj.endpointsDemolition.startStatuses = updateStatuses(updatedMainObj.endpointsDemolition.startStatuses || []);
			updatedMainObj.endpointsDemolition.endStatuses = updateStatuses(updatedMainObj.endpointsDemolition.endStatuses || []);

			obj.demolition_type.tlCount = midlines;
		  }
	  
		  return { ...obj, currentObj: updatedMainObj};
		});
		setObjs(updatedObjs);
		setHasChanges(true)
	};

	const handleAddMultipleConnection = (objId, midPoints = 1, midLines = 1) => {
		const updatedObjs = objs.map((obj) => {
			if (obj.id !== objId) return obj

			const updatedMainObj = { ...obj.currentObj }
			// Update connections
			for (let i = 0; i < midPoints - 1; i += 1) {
				const newConnection = { ...defaultConnection, statuses: [] }
				updatedMainObj.connections.push(newConnection)
			}

			for (let i =0 ;i < midPoints; i += 1) {
				const newInstallation = { statuses:[], note: ''}
				updatedMainObj.installations.push(newInstallation)
				updatedMainObj.length.push(600)
			}

			// Update startStatuses and endStatuses
			for (let i = 0; i < midLines - 1; i += 1) {
				updatedMainObj.endpoints.startStatuses.push(STATUS[0].value)
				updatedMainObj.endpoints.endStatuses.push(STATUS[0].value)
			}

			updatedMainObj.connections = updatedMainObj.connections.map((connection) => {
				while (connection.statuses.length < midLines) {
					connection.statuses.push(STATUS[0].value)
				}
				return connection
			})

			updatedMainObj.installations = updatedMainObj.installations.map((installation) => {
				while (installation.statuses.length < midLines) {
					installation.statuses.push(STATUS[0].value)
					
				}
				return installation
			})

			if (!obj.isDemolition) {
				updatedMainObj.demolitions = updatedMainObj.demolitions.map((demolition) => {
					while (demolition.statuses.length < midLines) {
						demolition.statuses.push(STATUS[0].value)
					}
					return demolition
				})
	
				updatedMainObj.demolitionInstallations = updatedMainObj.demolitionInstallations.map((demolitionInstallation) => {
					while (demolitionInstallation.statuses.length < midLines) {
						demolitionInstallation.statuses.push(STATUS[0].value)
					}
					return demolitionInstallation
				})
	
				for (let i = 0; i < midLines - 1; i += 1) {
					updatedMainObj.endpointsDemolition.startStatuses.push(STATUS[0].value)
					updatedMainObj.endpointsDemolition.endStatuses.push(STATUS[0].value)
				}
			}

			return { ...obj, currentObj: updatedMainObj}
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
				const newDemolition = { ...defaultConnection, statuses: [] }
				updatedMainObj.demolitions.push(newDemolition)
			}

			for (let i =0 ;i < demolitionPoints - 1; i += 1) {
				const newInstallation = { statuses:[], note: ''}
				updatedMainObj.demolitionInstallations.push(newInstallation)
				updatedMainObj.length_demolition.push(600)
			}

			obj.isDemolition = true

			for (let i = 0; i < demolitionLines - 1; i += 1) {
				updatedMainObj.endpointsDemolition.startStatuses.push(STATUS[0].value)
				updatedMainObj.endpointsDemolition.endStatuses.push(STATUS[0].value)
			}

			updatedMainObj.connections = updatedMainObj.demolitions.map((newDemolition) => {
				while (newDemolition.statuses.length < demolitionLines) {
					newDemolition.statuses.push(STATUS[0].value)
				}
				return newDemolition
			})

			updatedMainObj.demolitionInstallations = updatedMainObj.demolitionInstallations.map((demolitionInstallation) => {
				while (demolitionInstallation.statuses.length < demolitionLines) {
					demolitionInstallation.statuses.push(STATUS[0].value)
					
				}
				return demolitionInstallation
			})

			return { ...obj, currentObj: updatedMainObj }
		})
		setObjs(updatedObjs)
		handleAdd()
	}

	const handleAddNote = (objId, value, field, index) => {
		const updatedObjs = objs.map(obj => {
			if (obj.id !== objId) return obj;
	
			const updatedMainObj = { ...obj.currentObj };
	
			if (index === "start") {
				if (field === "connections") {
					updatedMainObj.endpoints.startNote = value;
				}
				else {
					updatedMainObj.endpointsDemolition.startNote = value;
				}
			} else if (index === "end") {
				if (field === "connections") {
					updatedMainObj.endpoints.endNote = value;
				}
				else {
					updatedMainObj.endpointsDemolition.endNote = value;
				}
			} else if (['connections', 'demolitions', 'installations', 'demolitionInstallations'].includes(field)) {
				updatedMainObj[field] = updatedMainObj[field].map((conn, i) => {
					if (i === index) {
						return { ...conn, note: value };
					}
					return conn;
				});
			}
	
			return { ...obj, currentObj: updatedMainObj };
		});
	
		setObjs(updatedObjs);
	};

	const handleDeleteRow = (objId, index, field) => {
		const updatedObjs = objs.map(obj => {
			if (obj.id !== objId) return obj;
	
			const updatedMainObj = { ...obj.currentObj };
			if (field === 'connections') {
				updatedMainObj[field] = updatedMainObj[field].filter((_, i) => i !== index);
				// Also delete installations
				updatedMainObj.installations.splice(index, 1);
				if (updatedMainObj.length && index < updatedMainObj.length.length) {
					updatedMainObj.length.splice(index, 1);
				}
			} 
			if (field === 'demolitions') {
				updatedMainObj[field] = updatedMainObj[field].filter((_, i) => i !== index);
				// Also delete installations
				updatedMainObj.demolitionInstallations.splice(index, 1);
				if (updatedMainObj.length_demolition && index < updatedMainObj.length_demolition.length) {
					updatedMainObj.length_demolition.splice(index, 1);
				}
			}
	
			return { ...obj, currentObj: updatedMainObj };
		});
	
		setObjs(updatedObjs);
		setHasChanges(true)
	};


	const handleAdd = () => {
		const updatedObjs = objs.map((obj) => {
			console.log('obj', obj)
			const yPos = 150
			const objNodes = [
				...generateNodesFromConnections({
					id: obj.id,
					connections: obj.currentObj.connections,
					yPos,
					cableType: obj.cable_type.bigInput
				}),
				...generateStartEndNode({
					seqNumber: obj.id,
					yPos: 30,
					startName: obj.currentObj.endpoints.start,
					endName: obj.currentObj.endpoints.end,
					connectionLength: obj.currentObj.connections.length,
					startType: obj.currentObj.endpoints.startConnector,
					endType: obj.currentObj.endpoints.endConnector,
					startStatuses: obj.currentObj.endpoints.startStatuses,
					endStatuses: obj.currentObj.endpoints.endStatuses,
					startEndLength: obj.currentObj.connections[0]?.statuses.length,
				}),
			]
			const objEdges = generateEdges(obj.id, obj)

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
						cableType: obj.demolition_type.bigInput,
						isDemolition: true,
					}),
					...generateStartEndNode({
						seqNumber: obj.id,
						yPos: 30,
						startName: obj.currentObj.endpointsDemolition.start,
						endName: obj.currentObj.endpointsDemolition.end,
						connectionLength: obj.currentObj.demolitions.length,
						startType: obj.currentObj.endpointsDemolition.startConnector,
						endType: obj.currentObj.endpointsDemolition.endConnector,
						startStatuses: obj.currentObj.endpointsDemolition.startStatuses,
						endStatuses: obj.currentObj.endpointsDemolition.endStatuses,
						startEndLength: obj.currentObj.demolitions[0]?.statuses.length,
					}),
				]

				objEdgesDemolition = generateEdges(obj.id, obj, true)
			}

			return {
				...obj,
				nodes: objNodes,
				edges: objEdges,
				edges_demolition: objEdgesDemolition,
				nodes_demolition: objNodesDemolition,
				currentObj: {
					...obj.currentObj,
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
		setHasChanges(true)
	}

	const setCurrentObj = ({
		objId,
		currentObj,
		nodes,
		edges,
		project = null,
		isEditing,
		cable_name,
		cable_type,
		demolition_type,
		edges_demolition,
		nodes_demolition,
		id,
	}) => {
		updateObjById(objId, (obj) => ({
			...obj,
			currentObj,
			nodes: nodes || obj.nodes,
			edges: edges || obj.edges,
			project: project || obj.project,
			isEditing,
			cable_name: cable_name || obj.cable_name,
			cable_type: cable_type || obj.cable_type,
			demolition_type: demolition_type || obj.demolition_type,
			nodes_demolition: nodes_demolition || obj.nodes_demolition,
			edges_demolition: edges_demolition || obj.edges_demolition,
			id : id || obj.id,
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
								<LeftContent onClick={(event) => event.stopPropagation()} sx={{ position: 'relative', left: '2rem', textAlign: 'center', gap: '0px', display: 'flex', flexDirection: 'row', alignItems: 'center', whiteSpace: 'nowrap' }}>
									<CableContent style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 300, color: '#606380' }}>
										Cable Name
										<DropdownPopover type="cable_name" newObj={newObj} handleChangeStatus={handleChangeStatus}/>
									</CableContent>
									<CableContent style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 300, color: '#606380'  }}>
										Cable Type
										<DropdownPopover type="cable_type" newObj={newObj} handleChangeStatus={handleChangeStatus}/>
									</CableContent>
									<CableContent style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 300, color: '#606380'  }}>
										Demolition
										<DropdownPopover type="demolition_type" newObj={newObj} handleChangeStatus={handleChangeStatus}/>
									</CableContent>
								</LeftContent>
								<RightContent onClick={(event) => event.stopPropagation()}>
									{cancel && newObj.isEditing && newObj.project && (
										<StyledButton
											onClick={() => handleEditButtonClick(newObj.id)}
											style={{ boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)' }}
											variant="outlined"
											sx={{
												width: '79px',
												borderRadius: '8px',
												backgroundColor: '#FFFFFF',
												fontFamily: 'Manrope, sans-serif',
												color: '#596570 !important',
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
												width: '105px',
												borderRadius: '8px',
												backgroundColor: '#FFFFFF',
												fontFamily: 'Manrope, sans-serif',
												color: '#596570 !important',
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
												width: '93px',
												borderRadius: '8px',
												backgroundColor: '#8D99FF',
												fontFamily: 'Manrope, sans-serif',
											}}
										>
											<Iconify icon="heroicons-outline:save" width={20} height={20} />
											Save
										</StyledLoadingButton>
									)}
									{isEditable && newObj.project && !newObj.isEditing && (
										<StyledButton
											onClick={() => handleEditButtonClick(newObj.id)}
											style={{ boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)' }}
											variant="outlined"
											sx={{
												width: '150px',
												borderRadius: '8px',
												backgroundColor: '#FFFFFF',
												fontFamily: 'Manrope, sans-serif',
												color: '#596570 !important',
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
								<DiagramDemolitionParent>
								<DiagramParent>
									<DiagramHeader />
									<Diagram
										nodes={newObj.nodes}
										edges={newObj.edges}
										setCurrentObj={setCurrentObj}
										currentObj={newObj.currentObj}
										objId={newObj.id}
										newObj={newObj}
										isDemolition={false}
										setHasChanges={setHasChanges}
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
											setHasChanges={setHasChanges}
										/>
									)}
								</DiagramParent>
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
												sx={{
													
													'@media (min-width:1440px)': {
													  transform: 'scale(0.75)', // Scale down the switch for 1440p screens
													},
												  }}
											/>
										}
										label="Demolition"
										labelPlacement='start'
										sx={{ color: 'black', '& .css-1yrymlm-MuiTypography-root': { '@media (max-width: 1440px)': { fontSize: '0.675rem', fontFamily: 'Manrope, sans-serif',} }, }}
									/>
								</Box>
								</DiagramDemolitionParent>
								<TableParent>
									<Tables>
										<ConnectionInstallationTable>
											<FormDiagram
												newObj={newObj}
												handleNewObjChange={handleNewObjChange}
												handleAddConnection={handleAddConnection}
												index={index}
												isEdit={newObj.isEditing}
												handleChangeDemolition={handleChangeDemolition}
												handleAddDemolition={handleAddDemolition}
												handleChangeInstallation={handleChangeInstallation}
												isDemolition={newObj.isDemolition}
												handleAddNote={handleAddNote}
												handleChangeStatus={handleChangeStatus}
												handleDeleteRow={handleDeleteRow}
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
