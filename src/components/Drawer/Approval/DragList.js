import { Box, Stack, Avatar } from '@mui/material'
import Iconify from 'components/Iconify'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

DragList.propTypes = {
	addedEmp: PropTypes.array,
	setaddedEmp: PropTypes.func,
	handleEmployeeRemove: PropTypes.func,
}

function DragList({ addedEmp, setaddedEmp, handleEmployeeRemove }) {
	const handleDragEnd = (result) => {
		if (!result.destination) return
		const reorderedItems = Array.from(addedEmp)
		const [reorderedItem] = reorderedItems.splice(result.source.index, 1)
		reorderedItems.splice(result.destination.index, 0, reorderedItem)
		setaddedEmp(reorderedItems)
	}

	return (
		<>
			<Box mb={2} mt={2}>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId="list">
						{(provided) => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{addedEmp?.map((e, index) => (
									<Draggable key={e.id} draggableId={String(e.id)} index={index}>
										{(provided) => (
											// eslint-disable-next-line react/jsx-key
											<Stack
												direction="row"
												justifyContent={'space-between'}
												alignItems={'center'}
												mt={1}
												key={e.id}
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={{
													cursor: 'grabbing',
													userSelect: 'none',
													padding: 4,
													backgroundColor: '#fff',
													borderRadius: '4px',
													boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
													...provided.draggableProps.style,
												}}
											>
												<Stack direction={'row'} gap={2} alignItems={'center'}>
													<img src={'/static/icons/Drag.svg'} alt={'drag'} />
													<Avatar alt="avatar image" sx={{ width: 46, height: 46 }}>
														{e.name ? e.name[0] : e.email_address[0]}
													</Avatar>
													<Box>
														<h5>{e.name || e.email_address}</h5>
														<div style={{ fontSize: '0.75rem', color: '#596570' }}>{e.rating}</div>
													</Box>
												</Stack>

												<Iconify
													style={{ cursor: 'pointer' }}
													icon="ic:round-close"
													width={14}
													height={14}
													onClick={() => handleEmployeeRemove(e.id)}
												/>
											</Stack>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</Box>
		</>
	)
}

export default DragList
