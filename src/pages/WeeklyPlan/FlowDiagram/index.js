import React from 'react'
import ReactFlow, { useNodesState, useEdgesState, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
	{
		id: '1',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png', name: 'Power' },
		position: { x: 100, y: 50 },
	},
	{
		id: '2',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png', name: 'J/B#1' },
		position: { x: 200, y: 100 },
	},
	{
		id: '3',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png', name: 'J/B#2' },
		position: { x: 400, y: 100 },
	},
	{
		id: '4',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png', name: 'J/B#3' },
		position: { x: 600, y: 100 },
	},
	{
		id: '5',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 720, y: 50 },
	},
	{
		id: '2-1',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 5, y: 50 },
	},
	{
		id: '2-2',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png' },
		position: { x: 200, y: 160 },
	},
	{
		id: '2-3',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png' },
		position: { x: 400, y: 160 },
	},
	{
		id: '2-4',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png' },
		position: { x: 600, y: 160 },
	},
	{
		id: '2-5',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 800, y: 50 },
	},

	{
		id: '2TL-1',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png', name: '2T/L' },
		position: { x: 100, y: 250 },
	},
	{
		id: '2TL-2',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png', name: 'J/B#1' },
		position: { x: 200, y: 300 },
	},
	{
		id: '2TL-3',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png', name: 'J/B#2' },
		position: { x: 360, y: 300 },
	},
	{
		id: '2TL-4',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png', name: 'J/B#3' },
		position: { x: 480, y: 300 },
	},
	{
		id: '2TL-5',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png', name: 'J/B#4' },
		position: { x: 600, y: 300 },
	},
	{
		id: '2TL-6',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 720, y: 250 },
	},
	{
		id: '2TL-2-1',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 5, y: 250 },
	},
	{
		id: '2TL-2-2',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png' },
		position: { x: 200, y: 350 },
	},
	{
		id: '2TL-2-3',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png' },
		position: { x: 360, y: 350 },
	},
	{
		id: '2TL-2-4',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png' },
		position: { x: 480, y: 350 },
	},
	{
		id: '2TL-2-5',
		type: 'image',
		data: { imageUrl: '/static/images/flowD2.png' },
		position: { x: 600, y: 350 },
	},
	{
		id: '2TL-2-6',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 800, y: 250 },
	},
	{
		id: 'new',
		type: 'nodeHeading',
		data: { name: 'New CV Section (Installation)' },
		position: { x: 300, y: 10 },
	},
	{
		id: 'old',
		type: 'nodeHeading',
		data: { name: 'Old OF Section (Demolition)' },
		position: { x: 300, y: 220 },
	},
]

const initialEdges = [
	{ id: 'e1-2', source: '1', target: '2', style: { stroke: '#FFA58D' } },
	{ id: 'e2-3', source: '2', target: '3', style: { stroke: '#FFA58D' } },
	{ id: 'e3-4', source: '3', target: '4', style: { stroke: '#FFA58D' } },
	{ id: 'e4-5', source: '4', target: '5', style: { stroke: '#FFA58D' } },
	{ id: 'e2-1-2', source: '2-1', target: '2-2', style: { stroke: '#FFA58D' } },
	{ id: 'e2-2-3', source: '2-2', target: '2-3', style: { stroke: '#FFA58D' } },
	{ id: 'e2-3-4', source: '2-3', target: '2-4', style: { stroke: '#FFA58D' } },
	{ id: 'e2-4-5', source: '2-4', target: '2-5', style: { stroke: '#FFA58D' } },

	{ id: 'e2TL-1-2', source: '2TL-1', target: '2TL-2', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-2-3', source: '2TL-2', target: '2TL-3', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-3-4', source: '2TL-3', target: '2TL-4', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-4-5', source: '2TL-4', target: '2TL-5', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-5-6', source: '2TL-5', target: '2TL-6', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-2-1-2', source: '2TL-2-1', target: '2TL-2-2', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-2-2-3', source: '2TL-2-2', target: '2TL-2-3', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-2-3-4', source: '2TL-2-3', target: '2TL-2-4', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-2-4-5', source: '2TL-2-4', target: '2TL-2-5', style: { stroke: '#FFA58D' } },
	{ id: 'e2TL-2-5-6', source: '2TL-2-5', target: '2TL-2-6', style: { stroke: '#FFA58D' } },
]

const nodeTypes = {
	image: ({ data }) => (
		<>
			{data.name && (
				<div style={{ position: 'absolute', top: -30 }}>
					<span
						style={{ padding: '5px 10px', border: '1px solid #EDEDEF', borderRadius: 7, marginLeft: 20, fontSize: 12 }}
					>
						{data.name}
					</span>
				</div>
			)}
			<div>
				<Handle type="target" position={Position.Left} isConnectable={false} />
				<div>
					<img src={data.imageUrl} alt="Custom Node" />
				</div>
				<Handle type="source" position={Position.Right} id="a" isConnectable={false} />
			</div>
		</>
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

const App = () => {
	const [nodes, setNodes] = useNodesState(initialNodes)
	const [edges, setEdges] = useEdgesState(initialEdges)

	return (
		<div style={{ height: 500, overflow: 'hidden' }}>
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
		</div>
	)
}

export default App
