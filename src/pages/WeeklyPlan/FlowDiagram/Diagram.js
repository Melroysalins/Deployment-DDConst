import { Handle, Position, ReactFlow } from 'reactflow'
import { Box, Button, Container, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import 'reactflow/dist/style.css'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { CONNECTORS, JUNCTION_BOX_MAP, PMJ, STATUS, STROKE_COLOR, getStrokeStatusByColor } from './diagramHelper'

const Section = Box

function Diagram({ nodes, edges, newObj, objId, setCurrentObj, isDemolition }) {
	const [showEditModal, setshowEditModal] = useState(false)
	const [editImageObj, seteditImageObj] = useState(null)
	const [showEdgeModal, setshowEdgeModal] = useState(false)
	const [editEdgeObj, seteditEdgeObj] = useState(null)
	const [currentType, setCurrentType] = useState('')
	const midLines = newObj.currentObj[isDemolition ? 'demolitions' : 'connections'][0]?.statuses?.length
	const diagramHeight = Math.min(230 + midLines * 20, newObj.isDemolition ? 230 : 350)

	const applyImageChanges = () => {
		const { status, type, name, isEndbox } = editImageObj
		editImageObj.imageUrl = `/static/svg/${type}-${status}.svg`
		const _getCount = name.split('#')[1]
		editImageObj.name = name
		delete editImageObj.isEndbox
		const updatedNodes = nodes.map((node) =>
			node.id === editImageObj.id ? { ...node, data: { ...node.data, ...editImageObj } } : node
		)

		const { currentObj } = newObj
		let updatedCurrentObj = { ...currentObj }
		let otherNodes = isDemolition ? newObj.nodes : newObj.nodes_demolition
		if (isEndbox) {
			otherNodes = otherNodes.map((node) =>
				node.id === editImageObj.id ? { ...node, data: { ...node.data, ...editImageObj } } : node
			)
			if (editImageObj.id.split('.')[1] === 'start') {
				// Start
				updatedCurrentObj.startStatuses[_getCount - 1] = status
				updatedCurrentObj.startConnector = type
			} else {
				// End
				updatedCurrentObj.endStatuses[_getCount - 1] = status
				updatedCurrentObj.endConnector = type
			}
		} else {
			const spilittedIds = editImageObj.id.split('.')
			const connections = currentObj[isDemolition ? 'demolitions' : 'connections'].map((connection, index) =>
				+spilittedIds[1] === index + 1
					? {
							...connection,
							pmj: type,
							statuses: connection.statuses.map((oldStatus, statusIndex) =>
								statusIndex + 1 === +spilittedIds[2] ? status : oldStatus
							),
					  }
					: connection
			)
			updatedCurrentObj = { ...currentObj, ...(isDemolition ? { demolitions: connections } : { connections }) }
		}
		setCurrentObj({
			objId,
			currentObj: updatedCurrentObj,
			isEditing: true,
			nodes: !isDemolition ? updatedNodes : otherNodes,
			nodes_demolition: isDemolition ? updatedNodes : otherNodes,
			hasChanges: type !== currentType,
		})
		handleEditingImageCancel()
	}

	const handleSelectChange = (value, key) => {
		const updatedData = {
			...editImageObj,
			[key]: value,
		}
		seteditImageObj(updatedData)
	}

	const handleEdgeChanges = (value, key) => {
		const updatedData = {
			...editEdgeObj,
			[key]: value,
		}
		seteditEdgeObj(updatedData)
	}

	// Edit Image Modal
	const handleEditingImageCancel = () => {
		setshowEditModal(false)
		seteditImageObj(null)
	}
	const handleEditingImage = (data) => {
		setshowEditModal(true)
		const { isEndbox, name, status } = data.data
		const type = data.data.imageUrl.split('svg/')[1].split('-')[0]
		setCurrentType(type)
		seteditImageObj({ id: data.id, isEndbox, name, status, type })
	}

	const handleEditingEdgeCancel = () => {
		setshowEdgeModal(false)
		seteditEdgeObj(null)
	}

	const applyEdgeChanges = () => {
		const { status, source } = editEdgeObj
		
		const updatedEdges = edges.map((edge) =>
			edge.source === source ? { ...edge, style: { stroke: STROKE_COLOR[status] } } : edge
		
		)

		const InstallationIndex = source.split('.')[1] === 'start' ? 0 : parseInt(source.split('.')[1], 10);
		const statusIndex = parseInt(source.split('.')[2], 10) - 1;
		console.log(InstallationIndex, statusIndex)
		const { currentObj } = newObj
		const updatedCurrentObj = { ...currentObj }
		const updatedInstallations = updatedCurrentObj.installations.map((installation, index) => {
			if (index === InstallationIndex) {
				const updatedStatuses = installation.statuses.map((oldStatus, sIndex) => (sIndex === statusIndex ? status : oldStatus))
				return { ...installation, statuses: updatedStatuses }
			}
			return installation
		})

		updatedCurrentObj.installations = updatedInstallations
		const otherEdges = isDemolition ? newObj.edges : newObj.edges_demolition
		setCurrentObj({
			objId,
			currentObj: updatedCurrentObj,
			isEditing: true,
			edges: !isDemolition ? updatedEdges : otherEdges,
			edges_demolition: isDemolition ? updatedEdges : otherEdges,
		})
		handleEditingEdgeCancel()
	}

	const UpdateImageView = () => (
		<Dialog onClose={handleEditingImageCancel} open={showEditModal}>
			{editImageObj && (
				<Box
					sx={{ minWidth: 400, margin: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 2 }}
				>
					<DialogTitle>Update {editImageObj.name}</DialogTitle>
					<FormControl style={{ width: 200 }}>
						<InputLabel>Status</InputLabel>
						<Select
							size="small"
							value={editImageObj?.status}
							label="Status"
							onChange={(e) => handleSelectChange(e.target.value, 'status')}
						>
							{STATUS.map((e) => (
								<MenuItem value={e.value} key={e.value}>
									{e.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					{editImageObj.isEndbox ? (
						<FormControl style={{ width: 200 }}>
							<InputLabel>Junction Type</InputLabel>
							<Select
								size="small"
								value={editImageObj.type}
								label="Junction box"
								onChange={(e) => handleSelectChange(e.target.value, 'type')}
							>
								{CONNECTORS.map((e) => (
									<MenuItem value={e.value} key={e.value}>
										{e.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					) : (
						<FormControl style={{ width: 200 }}>
							<InputLabel>Jb Type</InputLabel>
							<Select
								size="small"
								value={editImageObj.type}
								label="Jb Type"
								onChange={(e) => handleSelectChange(e.target.value, 'type')}
							>
								{PMJ.map((e) => (
									<MenuItem value={e} key={e}>
										{e}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} mb={2}>
						<Button size="small" variant="outlined" onClick={handleEditingImageCancel}>
							Cancel
						</Button>
						<Button size="small" variant="contained" onClick={applyImageChanges}>
							Apply
						</Button>
					</Box>
				</Box>
			)}
		</Dialog>
	)
	const UpdateEdgeView = () => {
		const startNode = editEdgeObj?.source.split('.')[1] === 'start' ? `s/s${editEdgeObj?.source.split('.')[2]}` : `m/h${editEdgeObj?.source.split('.')[1]}`
		const endNode = editEdgeObj?.target.split('.')[1] === 'end' ? `s/s${editEdgeObj?.target.split('.')[2]}` : `m/h${editEdgeObj?.target.split('.')[1]}`
		return (
		<Dialog onClose={handleEditingEdgeCancel} open={showEdgeModal}>
			{editEdgeObj && (
				<Box
					sx={{ minWidth: 400, margin: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 2 }}
				>
					<DialogTitle>Update {startNode}-{endNode}</DialogTitle>
					<FormControl style={{ width: 200 }}>
						<InputLabel>Status</InputLabel>
						<Select
							size="small"
							value={editEdgeObj?.status}
							label="Status"
							onChange={(e) => handleEdgeChanges(e.target.value, 'status')}
						>
							{STATUS.map((e) => (
								<MenuItem value={e.value} key={e.value}>
									{e.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} mb={2}>
						<Button size="small" variant="outlined" onClick={handleEditingEdgeCancel}>
							Cancel
						</Button>
						<Button size="small" variant="contained" onClick={applyEdgeChanges}>
							Apply
						</Button>
					</Box>
				</Box>
			)}
		</Dialog>
	)}

	const nodeTypes = {
		image: (data) => (
			<div>
				{data.data.name && (
					<div style={{ position: 'absolute', top: -23 }}>
						<span
							style={{
								padding: '3px',
								border: '1px solid #EDEDEF',
								borderRadius: 3,
								marginLeft: data.data.isEndbox ? -6 : 10,
								fontSize: 9,
							}}
						>
							{data.data.name}
						</span>
					</div>
				)}
				<div key={`${data.data.name}${isDemolition}`}>
					<Handle type="target" position={data.data.isEndbox ? Position.Bottom : Position.Left} isConnectable={false} />
					{/* eslint-disable-next-line */}
					<div onClick={() => handleEditingImage(data)}>
						<img src={data.data.imageUrl} alt="Custom Node" style={{ fill: 'blue' }} />
					</div>
					<Handle
						type="source"
						position={data.data.isEndbox ? Position.Bottom : Position.Right}
						isConnectable={false}
					/>
				</div>
			</div>
		),
		nodeHeading: ({ data }) => (
			<>
				<div>
					<span
						style={{
							padding: '3px 5px',
							border: '1px solid #EDEDEF',
							borderRadius: 5,
							marginLeft: 7,
							fontWeight: 600,
							fontSize: 12,
						}}
					>
						{data.name}
					</span>
				</div>
			</>
		),
	}

	const onEdgeClick = (_, edge) => {
		if (!newObj.isEditing) return
		const {
			style: { stroke },
		} = edge
		setshowEdgeModal(true)
		seteditEdgeObj({ ...edge, status: getStrokeStatusByColor(stroke) })
	}
	
	return (
		<Container sx={{ marginTop: 3 }}>
			<Section>
				<Box
					sx={{
						alignSelf: 'stretch',
						height: diagramHeight,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'flex-start',
					}}
				>
					{UpdateImageView()}
					{UpdateEdgeView()}
					<ReactFlow
						nodes={nodes}
						edges={edges}
						nodeTypes={nodeTypes}
						proOptions={{ hideAttribution: true }}
						elementsSelectable={newObj.isEditing} // Elements are selectable only if editing is enabled
						interactionProps={{
							zoomOnScroll: true,
							panOnDrag: false,
						}}
						nodesDraggable={false} // Disable node dragging
						nodesConnectable={false}
						onEdgeClick={onEdgeClick}
					/>
				</Box>
			</Section>
		</Container>
	)
}
Diagram.propTypes = {
	nodes: PropTypes.object.isRequired,
	edges: PropTypes.object.isRequired,
	setCurrentObj: PropTypes.func.isRequired,
	objId: PropTypes.number.isRequired,
	isDemolition: PropTypes.bool,
	newObj: PropTypes.object.isRequired,
}

export default Diagram
