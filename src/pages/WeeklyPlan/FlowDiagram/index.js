import React, { useEffect, useState } from 'react'
import ReactFlow, { useNodesState, useEdgesState, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import FormDiagram, { CABLE_TYPE, JB_TYPE, JUNCTION_BOX, MIN_X, NAMYUNG, PMJ, STATUS } from './FormDiagram'
import { createNewProjectDiagram, getDiagramByProject, updateProjectDiagram } from 'supabase/project_diagram'
import { useParams } from 'react-router-dom'
import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

const generateNodesFromConnections = ({ id, connections, yPos, length = 600 }) => {
	const nodes = []
	const step = (length - MIN_X) / connections.length
	connections.forEach((connection, index) => {
		const { joinType, status } = connection
		const imageUrl = `/static/svg/${joinType === 'J/B' ? 'jb' : 'mh'}-${status}.svg`

		const start = MIN_X + index * step
		const x = (start + (start + step)) / 2
		const nodeId = `${id}.${index + 1}`
		const nodeName = `${joinType}#${index + 1}`
		const position = { x, y: yPos }
		const data = { imageUrl, name: nodeName, status }
		nodes.push({ id: nodeId, type: 'image', data, position })
	})

	return nodes
}

const generateStartEndNode = ({ seqNumber, yPos, name = 'T/L', startX = 100, endX = 730, start, end, status }) => {
	start = `/static/svg/${start}-${status}.svg`
	end = `/static/svg/${end}-${status}.svg`
	const nodes = [
		{
			id: `${seqNumber}.start`,
			type: 'image',
			data: { imageUrl: start, name: `${name}#${seqNumber}`, isEndbox: true, status },
			position: { x: startX, y: yPos - 30 },
		},
		{
			id: `${seqNumber}.end`,
			type: 'image',
			data: { imageUrl: end, name: `${name}#${seqNumber}`, isEndbox: true, status },
			position: { x: endX, y: yPos - 30 },
		},
	]
	return nodes
}

const generateEdges = (startId, count, stroke = '#FFA58D') => {
	const edges = []
	edges.push({
		id: `${startId}.start-${startId}.1`,
		source: `${startId}.start`,
		target: `${startId}.1`,
		style: { stroke },
	})
	for (let i = 1; i <= count; i += 1) {
		const source = `${startId}.${i}`
		const target = `${startId}.${i + 1}`
		const edgeId = `e${i}-${i + 1}`
		const style = { stroke }
		edges.push({ id: edgeId, source, target, style })
	}
	edges.push({
		id: `${startId}.${count}-end`,
		source: `${startId}.${count}`,
		target: `${startId}.end`,
		style: { stroke },
	})

	return edges
}

const defaultNodes = [
	{
		id: 'new',
		type: 'nodeHeading',
		data: { name: 'Flow Diagram' },
		position: { x: 550, y: 15 },
	},
]
const initialNodes = [...defaultNodes]
const initialEdges = []

const STROKE_COLOR = {
	notStarted: '#FFA58D',
	inProgress: '#8D99FF',
	completed: '#919EAB',
}

const defaultConnection = {
	joinType: JB_TYPE[0],
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
	status: STATUS[0].value,
}

const FlowDiagram = ({ isEditable }) => {
	const [nodes, setNodes] = useNodesState(initialNodes)
	const [edges, setEdges] = useEdgesState(initialEdges)
	const [seqNumber, setseqNumber] = useState(1)
	const [newObj, setnewObj] = useState(defaultNewObj)
	const { id } = useParams()
	const [loading, setloading] = useState(false)
	const [hasDiagram, sethasDiagram] = useState(false)

	const handleImageChange = (data) => {
		const { isEndbox, status } = data.data
		const type = data.data.imageUrl.split('svg/')[1].split('-')[0]
		if (isEndbox) {
			const image = type === JUNCTION_BOX[0].value ? JUNCTION_BOX[1].value : JUNCTION_BOX[0].value
			data.data.imageUrl = `/static/svg/${image}-${status}.svg`
		} else {
			const image = type === 'jb' ? 'mh' : 'jb'
			data.data.imageUrl = `/static/svg/${image}-${status}.svg`
		}
		setNodes((prevNodes) =>
			prevNodes.map((node) => (node.id === data.id ? { ...node, data: { ...node.data, ...data.data } } : node))
		)
	}

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
					<div onClick={() => handleImageChange(data)}>
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

	const handleSave = async () => {
		setloading(true)
		const _obj = { project: id, nodes, edges, seqNumber }
		const { data } = hasDiagram ? await updateProjectDiagram(_obj, id) : await createNewProjectDiagram(_obj)
		if (data) {
			sethasDiagram(true)
		}
		setloading(false)
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
				end: newObj.end,
				status: newObj.status,
				endX: newObj.length ? +newObj.length + 130 : 730,
			}),
		])
		setEdges([...edges, ...generateEdges(seqNumber, newObj.connections.length, STROKE_COLOR[newObj.status])])
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

				<DDD />
			</div>
		</>
	)
}

export default FlowDiagram
