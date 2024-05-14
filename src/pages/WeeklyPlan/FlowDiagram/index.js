import React, { useEffect, useState } from 'react'
import ReactFlow, { useNodesState, useEdgesState, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import FormDiagram, {
	CABLE_TYPE,
	JB_TYPE,
	JB_TYPE_MAP,
	JUNCTION_BOX,
	JUNCTION_BOX_MAP,
	MIN_X,
	NAMYUNG,
	PMJ,
	STATUS,
} from './FormDiagram'
import { createNewProjectDiagram, getDiagramByProject, updateProjectDiagram } from 'supabase/project_diagram'
import { useParams } from 'react-router-dom'
import { Box, Button, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { LoadingButton } from '@mui/lab'

const generateNodesFromConnections = ({ id, connections, yPos, length = 600 }) => {
	const nodes = []
	const step = (length - MIN_X) / connections.length
	connections.forEach((connection, index) => {
		const { joinType, status } = connection
		const imageUrl = `/static/svg/${joinType}-${status}.svg`

		const start = MIN_X + index * step
		const x = (start + (start + step)) / 2
		const nodeId = `${id}.${index + 1}`
		const nodeName = `${JB_TYPE_MAP[joinType]}#${index + 1}`
		const position = { x, y: yPos }
		const data = { imageUrl, name: nodeName, status }
		nodes.push({ id: nodeId, type: 'image', data, position })
	})

	return nodes
}

const generateStartEndNode = ({
	seqNumber,
	yPos,
	startName,
	endName,
	startX = 100,
	endX = 730,
	start,
	end,
	startStatus,
	endStatus,
}) => {
	start = `/static/svg/${start}-${startStatus}.svg`
	end = `/static/svg/${end}-${endStatus}.svg`
	const nodes = [
		{
			id: `${seqNumber}.start`,
			type: 'image',
			data: { imageUrl: start, name: `${startName}#${seqNumber}`, isEndbox: true, status: startStatus },
			position: { x: startX, y: yPos - 30 },
		},
		{
			id: `${seqNumber}.end`,
			type: 'image',
			data: { imageUrl: end, name: `${endName}#${seqNumber}`, isEndbox: true, status: endStatus },
			position: { x: endX, y: yPos - 30 },
		},
	]
	return nodes
}

const generateEdges = (startId, newObj) => {
	const count = newObj.connections.length
	const edges = []
	edges.push({
		id: `${startId}.start`,
		source: `${startId}.start`,
		target: `${startId}.1`,
		style: { stroke: STROKE_COLOR[newObj.startStatus] },
	})
	for (let i = 1; i <= count; i += 1) {
		const source = `${startId}.${i}`
		const target = `${startId}.${i + 1}`
		const edgeId = `e${i}-${i + 1}`
		const style = { stroke: STROKE_COLOR[newObj.connections[i - 1].status] }
		edges.push({ id: edgeId, source, target, style })
	}
	edges.push({
		id: `${startId}-end`,
		source: `${startId}.${count}`,
		target: `${startId}.end`,
		style: { stroke: STROKE_COLOR[newObj.endStatus] },
	})

	return edges
}

// const defaultNodes = [
// 	{
// 		id: 'new',
// 		type: 'nodeHeading',
// 		data: { name: 'Flow Diagram' },
// 		position: { x: 550, y: 15 },
// 	},
// ]
const initialNodes = [] // [...defaultNodes]
const initialEdges = []

const STROKE_COLOR = {
	notStarted: '#FFA58D',
	inProgress: '#8D99FF',
	completed: '#919EAB',
}

export function getStrokeStatusByColor(color) {
	const entry = Object.entries(STROKE_COLOR).find(([_, value]) => value === color)
	return entry ? entry[0] : null
}

const defaultConnection = {
	joinType: JB_TYPE[0].value,
	pmj: PMJ[0],
	status: STATUS[0].value,
}
const defaultNewObj = {
	start: JUNCTION_BOX[0].value,
	end: JUNCTION_BOX[0].value,
	connections: [defaultConnection],
	cableType: CABLE_TYPE[0],
	namyang: NAMYUNG[0],
	length: 600,
	startStatus: STATUS[0].value,
	endStatus: STATUS[0].value,
}

const FlowDiagram = ({ isEditable }) => {
	const [nodes, setNodes] = useNodesState(initialNodes)
	const [edges, setEdges] = useEdgesState(initialEdges)
	const [seqNumber, setseqNumber] = useState(1)
	const [newObj, setnewObj] = useState(defaultNewObj)
	const { id } = useParams()
	const [loading, setloading] = useState(false)
	const [hasDiagram, sethasDiagram] = useState(false)
	const [showEditModal, setshowEditModal] = useState(false)
	const [editImageObj, seteditImageObj] = useState(null)
	// Edge Modal
	const [showEdgeModal, setshowEdgeModal] = useState(false)
	const [editEdgeObj, seteditEdgeObj] = useState(null)
	const [isUpdateStarted, setisUpdateStarted] = useState(false)

	const handleSave = async () => {
		setloading(true)
		const _obj = { project: id, nodes, edges, seqNumber }
		const { data } = hasDiagram ? await updateProjectDiagram(_obj, id) : await createNewProjectDiagram(_obj)
		if (data) {
			sethasDiagram(true)
		}
		setloading(false)
	}

	useEffect(() => {
		if (!isUpdateStarted) return
		handleSave()
		setisUpdateStarted(false)
	}, [isUpdateStarted])

	const applyImageChanges = () => {
		const { status, type, name, isEndbox } = editImageObj
		editImageObj.imageUrl = `/static/svg/${type}-${status}.svg`
		const _getCount = name.split('#')[1]
		editImageObj.name = isEndbox ? `${JUNCTION_BOX_MAP[type]}#${_getCount}` : `${JB_TYPE_MAP[type]}#${_getCount}`
		delete editImageObj.isEndbox
		setNodes((prevNodes) =>
			prevNodes.map((node) =>
				node.id === editImageObj.id ? { ...node, data: { ...node.data, ...editImageObj } } : node
			)
		)
		setisUpdateStarted(true)
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
		seteditImageObj({ id: data.id, isEndbox, name, status, type })
	}

	const handleEditingEdgeCancel = () => {
		setshowEdgeModal(false)
		seteditEdgeObj(null)
	}

	const applyEdgeChanges = () => {
		const { status, source } = editEdgeObj
		setEdges((prevEdges) =>
			prevEdges.map((edge) => (edge.source === source ? { ...edge, style: { stroke: STROKE_COLOR[status] } } : edge))
		)
		setisUpdateStarted(true)
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
								{JUNCTION_BOX.map((e) => (
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
								{JB_TYPE.map((e) => (
									<MenuItem value={e.value} key={e}>
										{e.label}
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

	const UpdateEdgeView = () => (
		<Dialog onClose={handleEditingEdgeCancel} open={showEdgeModal}>
			{editEdgeObj && (
				<Box
					sx={{ minWidth: 400, margin: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 2 }}
				>
					<DialogTitle>Update Edge # {editEdgeObj.id}</DialogTitle>
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
	)

	const nodeTypes = {
		image: (data) => (
			<div>
				{data.data.name && (
					<div style={{ position: 'absolute', top: -30 }}>
						<span
							style={{
								padding: '5px 10px',
								border: '1px solid #EDEDEF',
								borderRadius: 7,
								marginLeft: 20,
								fontSize: 12,
							}}
						>
							{data.data.name}
						</span>
					</div>
				)}
				<div>
					<Handle type="target" position={Position.Left} isConnectable={false} />
					{/* eslint-disable-next-line */}
					<div onClick={() => handleEditingImage(data)}>
						<img src={data.data.imageUrl} alt="Custom Node" style={{ fill: 'blue' }} />
					</div>
					<Handle type="source" position={Position.Right} id="a" isConnectable={false} />
				</div>
			</div>
		),
		nodeHeading: ({ data }) => (
			<>
				<div>
					<span
						style={{
							padding: '5px 10px',
							border: '1px solid #EDEDEF',
							borderRadius: 7,
							marginLeft: 20,
							fontWeight: 500,
						}}
					>
						{data.name}
					</span>
				</div>
			</>
		),
	}

	const onEdgeClick = (_, edge) => {
		const {
			style: { stroke },
		} = edge
		setshowEdgeModal(true)
		seteditEdgeObj({ ...edge, status: getStrokeStatusByColor(stroke) })
	}

	const DDD = () => (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			minZoom={1} // Disable zooming out
			maxZoom={1} // Disable zooming in
			interactionProps={{
				zoomOnScroll: false,
				panOnDrag: false,
			}}
			nodesDraggable={false} // Disable node dragging
			nodesConnectable={false}
			onEdgeClick={onEdgeClick}
		/>
	)

	const getDiagram = async () => {
		const { data } = await getDiagramByProject(id)
		if (data) {
			setNodes(data.nodes)
			setEdges(data.edges)
			setseqNumber(data.seqNumber)
			sethasDiagram(true)
		}
	}

	useEffect(() => {
		getDiagram()
	}, [])

	const handleNewObjChange = (value, field, index) => {
		if (index === undefined) {
			setnewObj({ ...newObj, [field]: value })
		} else {
			const updatedConnections = [...newObj.connections]
			updatedConnections[index][field] = value
			setnewObj({ ...newObj, connections: updatedConnections })
		}
	}

	const handleAddConnection = () => {
		setnewObj({
			...newObj,
			connections: [...newObj.connections, { ...defaultConnection }],
		})
	}

	const handleAdd = () => {
		const yPos = seqNumber * 100

		setNodes([
			...nodes,
			...generateNodesFromConnections({ id: seqNumber, connections: newObj.connections, yPos, length: newObj.length }),
			...generateStartEndNode({
				seqNumber,
				yPos,
				start: newObj.start,
				startName: JUNCTION_BOX_MAP[newObj.start],
				end: newObj.end,
				endName: JUNCTION_BOX_MAP[newObj.end],
				startStatus: newObj.startStatus,
				endStatus: newObj.endStatus,
				endX: newObj.length ? +newObj.length + 130 : 730,
			}),
		])

		setEdges([...edges, ...generateEdges(seqNumber, newObj)])
		setnewObj(defaultNewObj)
		setseqNumber(seqNumber + 1)
	}

	return (
		<>
			{isEditable && (
				<>
					<FormDiagram
						handleNewObjChange={handleNewObjChange}
						handleAdd={handleAdd}
						newObj={newObj}
						handleAddConnection={handleAddConnection}
						handleSave={handleSave}
						seqNumber={seqNumber}
					/>

					<Button variant="contained" size="small" sx={{ margin: '-5px 0 10px' }} onClick={handleAdd}>
						Apply
					</Button>
					{seqNumber > 1 && (
						<LoadingButton
							variant="contained"
							loading={loading}
							size="small"
							sx={{ margin: '-5px 5px 10px' }}
							onClick={handleSave}
						>
							{hasDiagram ? 'Update' : 'Save'}
						</LoadingButton>
					)}
				</>
			)}

			<div style={{ height: seqNumber * 150, overflow: 'hidden' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<div
						style={{
							border: '2px solid #DA4C57',
							width: '100%',
							textAlign: 'center',
							borderRight: 0,
							padding: 2,
							borderTopLeftRadius: 10,
							borderBottomLeftRadius: 10,
						}}
					>
						Complex Const section: <span style={{ color: '#DA4C57' }}>RED</span>
					</div>
					<div
						style={{
							border: '2px solid #8D99FF',
							width: '100%',
							textAlign: 'center',
							borderRight: 0,
							borderLeft: 0,
							padding: 2,
						}}
					>
						Const Section in progress: <span style={{ color: '#8D99FF' }}>BLUE</span>
					</div>
					<div
						style={{
							border: '2px solid #919EAB',
							width: '100%',
							textAlign: 'center',
							borderLeft: 0,
							padding: 2,
							borderTopRightRadius: 10,
							borderBottomRightRadius: 10,
						}}
					>
						Unconstructed: <span style={{ color: '#919EAB' }}>BLACK</span>
					</div>
				</div>

				{UpdateImageView()}
				{UpdateEdgeView()}
				<DDD />
			</div>
		</>
	)
}

export default FlowDiagram
