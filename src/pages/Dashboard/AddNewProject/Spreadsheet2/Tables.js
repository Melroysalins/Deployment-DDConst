// import React, { useState } from 'react'
// import { Box, Stack, Typography, TextField } from '@mui/material'
// import TableView from './TableView'
// import VisualLine from './VisualLine'
// import Sidebar from './Sidebar'
// import TableTitle from './TableTitle'
// import ThreeInputFields from './ThreeInputFields'

// const PROJECT_TIMELINE_DATA = [
// 	['Project Timeline'],
// 	['', 'Start Date', 'End Date', 'Manday'],
// 	['Total Construction', '4/6/12', '5/6/12', 40],
// 	['Connection Construction', '6/6/12', '7/6/12', 40],
// 	['Installation Work', '8/6/12', '9/6/12', 40],
// ]

// const PROJECT_OVERVIEW_DATA = [
// 	['Project Overview'],
// 	['Connection Classification', 'Connection Count', '', 'Manpower Count', 'People', '', 'On-site Work', '154kv', '', 'Completion', ""],
// 	['EB-A', '-', '', 'On-site Work', 4, '', 'Sp.Lvl', 0, '', 'Count', 1],
// 	['EB-G', 12, '', 'Service Work', 0, '', 'Lvl1', 1, '', 'Days', 2],
// 	['PMJ(Isolated)', 0, '', 'On-site Management', 1, '', 'Lvl2', 1, '', 'Insulator Replacement', 0],
// 	['PMJ(Normal)', '-', '', 'Safety Management', 0, '', 'Lvl3', 2],
// ]

// const CONSUMABLES_DATA = [
// 	['Consumables'],
// 	['Type', 'EB-A', 'EB-G', 'PMJ', 'PMJ(Normal)'],
// 	['Cost', 187.526, 187.526, 187.526, 187.526]
// ];

// const LABOUR_COST_DATA = [
// 	['Labour Cost'],
// 	['Role', 'Manday', 'People', 'Unit Price', 'Cost Subtotal'],
// 	['On-site Worker', '26', '8', '215,000', '44,720,000'],
// 	['Installers', '31', '6', '144,000', '26,784,000'],
// 	['On-site Manager', '40', '1', '237,000', '9,480,000'],
// 	['Safety Manager', '0', '0', '120,000', '0']
// ];

// const MANUFACTURING_COST_DATA = [
// 	['Manufacturing Cost'],
// 	['Type', 'Count', 'Months', 'Fuel Fee', 'Transport Cost', 'Subtotal'],
// 	['Connection van, work vehicle', '2', '0.8', '250000', '100,000', '606,667'],
// 	['Installation van, work vehicle', '2', '1.0', '250000', '100,000', '723,333'],
// 	['On-site Manager Vehicle', '2', '1.3', '300000', '100,000', '1,066,667']
// ];

// const TRAVEL_EXPENSES_DATA = [
// 	['Travel Expenses'],
// 	['On-site Worker', 'Installer', 'On-site Manager', 'Safety Manager', 'Unit Price', 'Cost', ""],
// 	['Business Traveler', 8, 6, 1, 0, 75000, 32550000],
// 	["Non-Business Traveler", 9, 0, 0, 1, 30000, 0]
// ];

// const VEHICLE_MAINTENANCE_COST_DATA =
// 	[
// 		['Vehicle Maintenance Cost'],
// 		["Count", "Month #", "Fuel Fee/Month", "Transportation Cost/Month", "Cost Subtotal", ""],
// 		["Connection van, work vehicle", 2, 0.8, 250000, 100000, 606667],
// 		["Installation van, work vehicle", 2, 10, 260000, 100000, 725535],
// 		["On-site Manager vehicle", 2, 13, 300000, 100000, 1066667]
// 	]

// const OTHER_COST_DATA =
// 	[
// 		['Other'],
// 		["Item", "Cost", "Baseline"], // Header Row
// 		["Employee Benefits", 234000, "30,000won monthly per one person (On-site Manager & On-site Worker)"],
// 		["Entertainment", 500000, "500,000won/monthly"],
// 		["Fees", 150000, "150,000won/monthly"],
// 		["Consumables", 2500000, "2,500,000won per PJT"],
// 		["Book Printing Fee", 2000000, "2,000,000won per PJT"],
// 		["Repair Fee", 300000, "300,000won per PJT"],
// 		["Training Education Fee", 0, "200,000won per PJT"],
// 		["Other", 100000, "1% of the Contract Value"],
// 		["Total", 1484000, ""]
// 	];

// const MATERIAL_COST_DATA = [
// 	['Material Cost'],
// 	['', 'KEPCO Designer Cost', 'Rate', 'Cost Subtotal'],
// 	['On-site Installation rate', '111,169,469', '155,637,257', '14']
// ]

// const OTHER_SUBCONTRACT_COST_DATA = [
// 	['Other Subcontract'],
// 	['', 'Count', 'Unit Price', 'Subtotal'],
// 	['Disaster Prevention Work', '1', '85000000', '85000000'],
// 	['EB-G Scaffold', '2', '10000000', '20000000'],
// ]

// const PROJECT_OVERVIEW_DATA1 = [
// 	['Project Overview'],
// 	['Connection Classification', 'Connection Count'],
// 	['EB-A', '-'],
// 	['EB-G', 12],
// 	['PMJ(Isolated)', 0],
// 	['PMJ(Normal)', '-'],
// ]
// const PROJECT_OVERVIEW_DATA2 = [
// 	['Project Overview'],
// 	['Manpower Count', 'People'],
// 	['On-site Work', 4],
// 	['Service Work', 0],
// 	['On-site Management', 1],
// 	['Safety Management', 0],
// ]
// const PROJECT_OVERVIEW_DATA3 = [
// 	['Project Overview'],
// 	['On-site Work', '154kv'],
// 	['Sp.Lvl', 0],
// 	['Lvl1', 1],
// 	['Lvl2', 1],
// 	['Lvl3', 2],
// ]
// const PROJECT_OVERVIEW_DATA4 = [
// 	['Project Overview'],
// 	['Completion', ""],
// 	['Count', 1],
// 	['Days', 2],
// ]
// const PROJECT_OVERVIEW_DATA5 = [
// 	['Project Overview'],
// 	['Insulator Replacement', 80],
// ]

// const LABOUR_COST_DATA1 = [
// 	['Labour Cost'],
// 	['Role', 'Manday', 'People'],
// 	['On-site Worker', '26', '8'],
// 	['Installers', '31', '6'],
// 	['On-site Manager', '40', '1'],
// 	['Safety Manager', '0', '0']
// ];

// const LABOUR_COST_DATA2 = [
// 	['Labour Cost'],
// 	['Unit Price', 'Cost Subtotal'],
// 	['215,000', '44,720,000'],
// 	['144,000', '26,784,000'],
// 	['237,000', '9,480,000'],
// 	['120,000', '0']
// ];

// const Tables = ({savedData = {}, handleTableDataChange, budgetId}) => {
//     const [selectedTable, setSelectedTable] = useState('timeline');
//     const [selectedCell, setSelectedCell] = useState(null);
//     const style = {
// 		tableContainer: {

// 		},
// 		tableHead: {
// 			backgroundColor: '#eaf3f2',
// 		},
// 		tableRow: {
// 			'&:last-child td, &:last-child th': { border: 0 },
// 		},
// 		tableRowCell: {
// 			borderBottom: '1px solid #e0e0e1',
// 		},
// 	}
// 	const styleTypography = {
// 		fontFamily: 'Manrope',
// 		fontSize: '18px',
// 		fontWeight: 600,
// 		lineHeight: '24px',
// 		textAlign: 'left',
// 		textUnderlinePosition: 'from-font',
// 		color: '#6AC79B',
// 	}

// 	const styleValue = {
// 		fontFamily: 'Manrope',
// 		fontSize: '18px',
// 		fontWeight: 700,
// 		lineHeight: '24px',
// 		textAlign: 'right',
// 		color: 'black',
// 	};

// 	// Initialize default data structures
//     const defaultData = {
//         timeline: PROJECT_TIMELINE_DATA,
//         overview: PROJECT_OVERVIEW_DATA,
//         consumables: CONSUMABLES_DATA,
//         labour_cost: LABOUR_COST_DATA,
//         manufacturing_cost: MANUFACTURING_COST_DATA,
//         travel_expenses: TRAVEL_EXPENSES_DATA,
//         other_cost: OTHER_COST_DATA,
//         vehicle_maintenance_cost: VEHICLE_MAINTENANCE_COST_DATA
//     };

//     // Use saved data or fall back to default data
//     const getTableData = (type) => {
//         return savedData[type] || defaultData[type] || [];
//     };

//     return (
//         <div>
//             <Stack spacing={6} direction="row">
//                 <Box sx={{ flex: 4 }}>
//                     <Stack spacing={4}>
//                         <Box
//                             onClick={() => setSelectedTable('timeline')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <Typography variant="h6" sx={styleTypography} gutterBottom>Project Timeline</Typography>
//                             <TableView
//                                 data={getTableData('timeline')}
//                                 type="timeline"
//                                 style={style}
//                                 onDataChange={handleTableDataChange}
//                                 onCellSelect={setSelectedCell}
//                             />
//                             {selectedTable === 'timeline' && (
//                                 <VisualLine/>
//                             )}
//                         </Box>

//                         <Box
//                             onClick={() => setSelectedTable('overview')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <Typography variant="h6" sx={styleTypography} gutterBottom>Project Overview</Typography>
//                             <Box display="flex" flexDirection="row" justifyContent="space-between">
//                                 <Box sx={{ marginRight: '8px', width: "100%" }}>
//                                     <TableView
//                                         data={PROJECT_OVERVIEW_DATA1}
//                                         type="overview"
//                                         style={style}
//                                         onDataChange={handleTableDataChange}
//                                         onCellSelect={setSelectedCell}
//                                     />
//                                 </Box>
//                                 <Box sx={{ marginRight: '8px', width: "100%" }}>
//                                     <TableView
//                                         data={PROJECT_OVERVIEW_DATA2}
//                                         type="overview"
//                                         style={style}
//                                         onDataChange={handleTableDataChange}
// 										onCellSelect={setSelectedCell}
//                                     />
//                                 </Box>
//                                 <Box sx={{ marginRight: '8px', width: "100%" }}>
//                                     <TableView
//                                         data={PROJECT_OVERVIEW_DATA3}
//                                         type="overview"
//                                         style={style}
//                                         onDataChange={handleTableDataChange}
// 										onCellSelect={setSelectedCell}
//                                     />
//                                 </Box>
//                                 <Box sx={{ marginRight: '8px', width: "100%" }}>
//                                     <TableView
//                                         data={PROJECT_OVERVIEW_DATA4}
//                                         type="overview"
//                                         style={style}
//                                         onDataChange={handleTableDataChange}
// 										onCellSelect={setSelectedCell}
//                                     />
//                                     <Box sx={{ width: '100%', marginTop: '16px', height: '70px' }}>
//                                         <TableView
//                                             data={PROJECT_OVERVIEW_DATA5}
//                                             type="overview"
//                                             style={style}
//                                             onDataChange={handleTableDataChange}
// 											onCellSelect={setSelectedCell}
//                                         />
//                                     </Box>
//                                 </Box>
//                             </Box>
//                             {selectedTable === 'overview' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('execution_budget')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Execution Budget"} value={8585844} />
//                             {/* <TableView  for exe bud */}
//                             {/* TODO add table for execution budget here */}
//                             {selectedTable === 'execution_budget' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('contract_value')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Contract Value"} value={8585844} />
//                             {/* <TableView  for exe bud */}
//                             {/* TODO add table for execution budget here */}
//                             {selectedTable === 'contract_value' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('material_cost')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Material Cost"} value={8585844} />
//                             {/* <Typography variant="h6" sx={styleTypography} gutterBottom>Consumables</Typography> */}
//                             <TableView
//                                 data={MATERIAL_COST_DATA}
//                                 type="material_cost"
//                                 style={style}
//                                 onDataChange={handleTableDataChange}
// 								onCellSelect={setSelectedCell}
//                             />
//                             {selectedTable === 'material_cost' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('consumables')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Consumables"} value={8585844} />
//                             {/* <Typography variant="h6" sx={styleTypography} gutterBottom>Consumables</Typography> */}
//                             <TableView
//                                 data={getTableData('consumables')}
//                                 type="consumables"
//                                 style={style}
//                                 onDataChange={handleTableDataChange}
//                                 onCellSelect={setSelectedCell}
//                             />
//                             {selectedTable === 'consumables' && (
//                                 <VisualLine />
//                             )}
//                         </Box>

//                         <Box
//                             onClick={() => setSelectedTable('labour_cost')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Labour Cost"} value={575896} />
//                             {/* <Typography variant="h6" sx={styleTypography} gutterBottom>Labour Cost</Typography> */}
//                             <Box display="flex" flexDirection="row" justifyContent="space-between">
//                                 <Box sx={{ marginRight: '8px', width: "100%" }}>
//                                     <TableView
//                                         data={LABOUR_COST_DATA1}
//                                         type="labour_cost"
//                                         style={style}
//                                         onDataChange={handleTableDataChange}
//                                         onCellSelect={setSelectedCell}
//                                     />
//                                 </Box>
//                                 <Box sx={{ marginRight: '8px', width: "100%" }}>
//                                     <TableView
//                                         data={LABOUR_COST_DATA2}
//                                         type="labour_cost"
//                                         style={style}
//                                         onDataChange={handleTableDataChange}
//                                         onCellSelect={setSelectedCell}
//                                     />
//                                 </Box>
//                             </Box>
//                             {selectedTable === 'labour_cost' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('manufacturing_cost')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Manufacturing Cost"} value={90000} />
//                             <TableView
//                                 data={savedData.manufacturing_cost || MANUFACTURING_COST_DATA}
//                                 type="manufacturing_cost"
//                                 style={style}
//                                 onDataChange={handleTableDataChange}
// 								onCellSelect={setSelectedCell}
//                             />
//                             {selectedTable === 'manufacturing_cost' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('travel_expenses')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Travel Expenses"} value={78789060} />
//                             {/* <Typography variant="h6" gutterBottom sx={styleTypography}> Travel Expenses </Typography> */}
//                             <TableView
//                                 data={getTableData('travel_expenses')}
//                                 type="travel_expenses"
//                                 style={style}
//                                 onDataChange={handleTableDataChange}
//                                 onCellSelect={setSelectedCell}
//                             />
//                             {selectedTable === 'travel_expenses' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('vehicle_maintenance_cost')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Vehicle Maintenance Cost"} value={789000} />
//                             <TableView
//                                 data={getTableData('vehicle_maintenance_cost')}
//                                 type="vehicle_maintenance_cost"
//                                 style={style}
//                                 onDataChange={handleTableDataChange}
// 								onCellSelect={setSelectedCell}
//                             />
//                             {selectedTable === 'vehicle_maintenance_cost' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box>
//                             <TableTitle title={"Subcontract Cost (installation)"} labelText={"Director Jang's Personnel Addition Cost"} value={7899646} />
//                             <ThreeInputFields value1={'4 people'} value2={'13 days'} value3={'30000 won'} />
//                         </Box>
//                         <Box>
//                             <TableTitle title={"Subcontract Fee (#of signals)"} labelText={"Director Jang's Personnel Addition Cost"} value={899000} />
//                             <ThreeInputFields value1={"2 people"} value2={'11 days'} value3={'10000 won'} />
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('other_subcontract_cost')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Other Subcontract Cost"} value={900000} />
//                             <TableView
//                                 data={savedData.other_subcontract_cost || OTHER_SUBCONTRACT_COST_DATA}
//                                 type="other_subcontract_cost"
//                                 style={style}
//                                 onDataChange={handleTableDataChange}
// 								onCellSelect={setSelectedCell}
//                             />
//                             {selectedTable === 'other_subcontract_cost' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                         <Box
//                             onClick={() => setSelectedTable('other_cost')}
//                             sx={{ cursor: 'pointer', position: 'relative' }}
//                         >
//                             <TableTitle title={"Other Cost"} value={900000} />
//                             <TableView
//                                 data={getTableData('other_cost')}
//                                 type="other_cost"
//                                 style={style}
//                                 onDataChange={handleTableDataChange}
// 								onCellSelect={setSelectedCell}
//                             />
//                             {selectedTable === 'other_cost' && (
//                                 <VisualLine />
//                             )}
//                         </Box>
//                     </Stack>
//                 </Box>
//                 <Sidebar 
//                     selectedTable={selectedTable} 
//                     selectedCell={selectedCell}
//                     budgetId={budgetId}
//                 />
//             </Stack>
//         </div>
//     );
// };

// export default Tables;