import { TableContainer, FormHelperText, InputLabel, Box, FormControl as MuiFormControl, MenuItem, Select as MuiSelect, Typography, TextField, Divider, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import { useState , React } from 'react'
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Iconify from 'components/Iconify';

export const MIN_X = 200
export const NAMYUNG = ['XLPE', 'OF', 'Other']
export const CABLE_TYPE = ['154kV', '345kV', '746kV']
export const JUNCTION_BOX = [
    { label: 'T/R', value: 'recTri' },
    { label: 'S/S', value: 'square' },
]
export const JB_TYPE = [
    { label: 'J/B', value: 'jb' },
    { label: 'M/H', value: 'mh' },
]
export const PMJ = ['IJ', 'NJ', 'Pass']
export const STATUS = [
    { label: 'Not Started', value: 'notStarted' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Completed', value: 'completed' },
]

export const JB_TYPE_MAP = {
    jb: 'J/B',
    mh: 'M/H',
}
export const JUNCTION_BOX_MAP = {
    recTri: 'T/R',
    square: 'S/S',
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

const ConnectionTable = styled(Box)({
    borderRadius: '8px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    gap: '8px',
});

const InstallationTable = styled(Box)({
    alignSelf: 'stretch',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontSize: '14px',
    color: '#596570',
    gap: '8px',
});

const StyledSelect = styled(MuiSelect)({
    borderRadius: '4px',
    backgroundColor: '#f8dbdd',
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        padding: '0px 8px',
        gap: '4px',
        fontFamily: 'Manrope',
        fontWeight: 600,
        fontSize: '14px',
        color: '#da4c57',
    },
    '@media (max-width: 1440px)': {
        '& .MuiSelect-select': {
            fontSize: '10px',
            padding: '4px 6px',
            height: '14px',
        },
    },
    '@media (max-width: 1336px)': {
        '& .MuiSelect-select': {
            fontSize: '8px',
            padding: '2px 4px',
            height: '10px',
        },
    },
    '@media (max-width: 1280px)': {
        '& .MuiSelect-select': {
            fontSize: '6px',
            padding: '2px 4px',
            height: '8px',
        },
    },
});

const Select = styled(MuiSelect)({
    '@media (max-width: 1440px)': {
        '& .MuiSelect-select': {
            fontSize: '10px',
            width: '40px',
            height: '21px',
        },
        '& .MuiInputBase-root': {
            height: '1px',
        },
    },
    '@media (max-width: 1336px)': {
        '& .MuiSelect-select': {
            fontSize: '8px',
            width: '30px',
            height: '16px',
        },
    },
    '@media (max-width: 1280px)': {
        '& .MuiSelect-select': {
            fontSize: '6px',
            width: '20px',
            height: '12px',
        },
    },
});

const StyledTableCell = styled(TableCell)({
    '@media (max-width: 1440px)': {
        fontSize: '10px',
        padding: '4px 6px',
        width: '100%',
    },
    '@media (max-width: 1336px)': {
        fontSize: '8px',
        padding: '2px 4px',
        width: '100%',
    },
    '@media (max-width: 1280px)': {
        fontSize: '6px',
        padding: '2px 4px',
        width: '100%',
    },
});

const StyledInputLabel = styled(InputLabel)({
    '@media (max-width: 1440px)': {
        fontSize: '10px',
        padding: '4px 6px'
    },
    '@media (max-width: 1336px)': {
        fontSize: '8px',
        padding: '2px 4px',
    },
    '@media (max-width: 1280px)': {
        fontSize: '6px',
        padding: '2px 4px',
    },
});

const StyledTypography = styled(Typography)({
    '@media (max-width: 1440px)': {
        fontSize: '10px',
        padding: '2px'
    },
    '@media (max-width: 1336px)': {
        fontSize: '8px',
        padding: '1px',
    },
    '@media (max-width: 1280px)': {
        fontSize: '6px',
        padding: '1px',
    },
});

const StyledTextField = styled(TextField)({
    '@media (max-width: 1440px)': {
        fontSize: '10px',
        padding: '4px 6px'
    },
    '@media (max-width: 1336px)': {
        fontSize: '8px',
        padding: '2px 4px',
    },
    '@media (max-width: 1280px)': {
        fontSize: '6px',
        padding: '2px 4px',
    },
});

const FormControl = styled(MuiFormControl)({
    '@media (max-width: 1440px)': {
        width: '100%',
    },
    '@media (max-width: 1336px)': {
        width: '80%',
    },
    '@media (max-width: 1280px)': {
        width: '60%',
    },
});

export default function FormDiagram() {
	const [newObj, setnewObj] = useState(defaultNewObj);

	return (
		<>
			<ConnectionTable>
			<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "flex-end",
				justifyContent: "flex-start",
				padding: "0px 0px 0px 28px",
				gap: "4px",
				fontSize: "18px",
				color: "#ffa58d",
				fontFamily: "Manrope",
				'@media (max-width: 1440px)': {
					fontSize: '14px',
				},
			}}
		>
			<Box
				sx={{
					position: "relative",
					lineHeight: "24px",
					fontWeight: "600",
				}}
			>
				Connection
			</Box>
			<Box
				sx={{
					flex: "1",
					position: "relative",
					fontSize: "16px",
					color: "#596570",
					display: "flex",
					alignItems: "center",
					overflow: "hidden",
					textOverflow: "ellipsis",
					height: "22px",
					'@media (max-width: 1440px)': {
						fontSize: '10px',
					},
				}}>
				<StyledTypography>
					<StyledTypography
						sx={{ lineHeight: "28px", fontWeight: "600" }}
						component="span"
					>
						14 Points
					</StyledTypography>
					<StyledTypography
						sx={{ lineHeight: "26px" }}
						component="span"
					>{` (IJ 5 Points + NJ 2 Points) x `}</StyledTypography>
					<StyledTypography
						sx={{ lineHeight: "28px", fontWeight: "600" }}
						component="span"
					>
						2 Lines
					</StyledTypography>
					<StyledTypography sx={{ lineHeight: "2</Box>6px" }} component="span">
						(aka T/L)
					</StyledTypography>
				</StyledTypography>
			</Box>
		</Box>
				<TableContainer sx={{ width: "max-content", borderRadius: '8px', overflowX: "visible"}}>
					<Box
						sx={{
							display: "flex",
							flexDirection:"row",
							justifyContent:"flex-start",
							alignItems:"flex-end"
						}}
					>
						<Box
							sx={{
								minHeight: '96px',
								width: '100%',
								maxWidth: '28px', 
								borderRadius: '8px 0px 0px 8px',
								backgroundColor: '#ffa58d',
								display: 'flex',
								alignItems: 'center', 
								justifyContent: 'center', 
								padding: '16px 2px',
								boxSizing: 'border-box',
							}}
						>
							<StyledTypography
								sx={{
								writingMode: 'vertical-rl', 
								fontWeight: '600',
								color: '#fff',
								transform: 'rotate(180deg)',
								}}
							>
								End point
							</StyledTypography>
						</Box>
						<Table sx={{ border: '1px solid lightgrey', borderRadius: "0px 8px 0px 0px"}} >
							<TableHead>
								<TableRow style={{ backgroundColor: "#f9f9fa" }}>
									<StyledTableCell sx={{ padding: "8px 10px", width: '92px'}} >
										<StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Location</StyledTypography>
									</StyledTableCell>
									<StyledTableCell sx={{ padding: "8px 10px", width: '141.5px'}}>
										<StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Transformer</StyledTypography>
									</StyledTableCell>
									<StyledTableCell sx={{ padding: "8px 10px", width: '141.5px'}}>
										<StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Connector</StyledTypography>
									</StyledTableCell>
									<StyledTableCell sx={{ padding: "8px 10px", width: '130px'}}>
										<StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Status</StyledTypography>
									</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<StyledTableCell sx={{ padding: "8px 10px", width: '92px'}}>
										<StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Namyang</StyledTypography>
									</StyledTableCell>
									<StyledTableCell sx={{ padding: "8px 10px", width: '141.5px'}}>
										<FormControl
											variant="outlined"
											sx={{ width: "121.5px" }}
										>
											<StyledInputLabel color="primary">S/S</StyledInputLabel>
											<Select
												color="primary"
												sx={{ height: "32px" }}
												label="S/S"
												size='small'
												disableUnderline
												displayEmpty
											>
												<MenuItem value="">None</MenuItem>
												{/* Add more menu items here */}
											</Select>
											<FormHelperText />
										</FormControl>
									</StyledTableCell>
									<StyledTableCell sx={{ padding: "8px 10px", width: '141px'}}>
										<FormControl
											variant="outlined"
											sx={{ width: "121.5px"}}
										>
											<StyledInputLabel color="primary">EB-G</StyledInputLabel>
											<Select
												color="primary"
												sx={{ height: "32px" }}
												label="EB-G"
												disableUnderline
												displayEmpty
											>
												<MenuItem value="">None</MenuItem>
												{/* Add more menu items here */}
											</Select>
											<FormHelperText />
										</FormControl>
									</StyledTableCell>
									<StyledTableCell sx={{ padding: "8px 10px", width: '130px'}}>
										<StyledSelect
											value="Completed"
											variant="outlined"
										>
											<MenuItem value="Completed">Completed</MenuItem>
											<MenuItem value="In Progress">In Progress</MenuItem>
											<MenuItem value="Not Started">Not Started</MenuItem>
										</StyledSelect>
									</StyledTableCell>
								</TableRow>
								<TableRow>
									<StyledTableCell sx={{ padding: "8px 10px", width: '92px'}}>
										<StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Yeonsu</StyledTypography>
									</StyledTableCell>
									<StyledTableCell sx={{ padding: "8px 10px", wiscssdth: '141px'}}>
										<FormControl
											variant="outlined"
											sx={{ width: "121.5px", height: "32px" }}
										>
											<StyledInputLabel color="primary">T/R</StyledInputLabel>
											<Select
												color="primary"
												sx={{ height: "32px" }}
												label="T/R"
												disableUnderline
                                                displayEmpty
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                {/* Add more menu items here */}
                                            </Select>
                                            <FormHelperText />
                                        </FormControl>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "8px 10px", width: '141px'}}>
                                        <FormControl
                                            variant="outlined"
                                            sx={{ width: "121.5px", height: "32px" }}
                                        >
                                            <StyledInputLabel color="primary">EB-A</StyledInputLabel>
                                            <Select
                                                color="primary"
                                                sx={{ height: "32px" }}
                                                label="EB-A"
                                                disableUnderline
                                                displayEmpty
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                {/* Add more menu items here */}
                                            </Select>
                                            <FormHelperText />
                                        </FormControl>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "12px 8px", width: '130px'}}>
                                        <StyledSelect
                                            value="Completed"
                                            variant="outlined"
                                        >
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Not Started">Not Started</MenuItem>
                                        </StyledSelect>
                                    </StyledTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
                <TableContainer sx={{ maxWidth: "max-content", borderRadius: '8px', overflowX: "visible"}}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection:"row",
                            justifyContent:"flex-start",
                            alignItems:"flex-end"
                        }}
                    >
                        <Box
                            sx={{
                                maxHeight: '96px',
                                width: '100%',
                                maxWidth: '28px', 
                                borderRadius: '8px 0px 0px 8px',
                                backgroundColor: '#ffa58d',
                                display: 'flex',
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                padding: '16px 2px',
                                boxSizing: 'border-box',
                            }}
                        >
                            <StyledTypography
                                sx={{
                                writingMode: 'vertical-rl', 
                                fontWeight: '600',
                                color: '#fff',
                                transform: 'rotate(180deg)',
                                }}
                            >
                                Mid
                            </StyledTypography>
                        </Box>
                        <Table sx={{ border: '1px solid lightgrey'}} >
                            <TableBody>
                                <TableRow>
                                    <StyledTableCell sx={{ padding: "8px 10px", width: '92px'}}>
                                        <StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Namyang</StyledTypography>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "8px 10px", width: '141.5px'}}>
                                        <FormControl
                                            variant="outlined"
                                            sx={{ width: "121.5px", height: "32px" }}
                                        >
                                            <StyledInputLabel color="primary">M/H</StyledInputLabel>
                                            <Select
                                                color="primary"
                                                sx={{ height: "32px" }}
                                                label="S/S"
                                                disableUnderline
                                                displayEmpty
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                {/* Add more menu items here */}
                                            </Select>
                                            <FormHelperText />
                                        </FormControl>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "8px 10px", width: '141px'}}>
                                        <FormControl
                                            variant="outlined"
                                            sx={{ width: "121.5px", height: "32px" }}
                                        >
                                            <StyledInputLabel color="primary">IJ</StyledInputLabel>
                                            <Select
                                                color="primary"
                                                sx={{ height: "32px" }}
                                                label="EB-G"
                                                disableUnderline
                                                displayEmpty
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                {/* Add more menu items here */}
                                            </Select>
                                            <FormHelperText />
                                        </FormControl>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "12px 8px", width: '130px'}}>
                                        <StyledSelect
                                            value="Completed"
                                            variant="outlined"
                                        >
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Not Started">Not Started</MenuItem>
                                        </StyledSelect>
                                    </StyledTableCell>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: "-12px",
                                            left: "40px",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            gap: "12px",
                                            zIndex: 4,
                                        }}
                                        >
                                        <IconButton
                                            style={{
                                                backgroundColor: '#ffa58d',
                                                boxShadow: '0px 8px 16px rgba(255, 165, 141, 0.24)',
                                                borderRadius: '32px',
                                                width: '24px',
                                                height: '24px',
                                            }}
                                        >
                                            <AddIcon sx={{ color: "#fff"}} />
                                        </IconButton>
                                        <IconButton
                                            style={{
                                                border: "1px solid #6ac79b",
                                                backgroundColor: "#fff",
                                                boxShadow: "0px 8px 16px rgba(152, 210, 195, 0.24)",
                                                borderRadius: "32px",
                                                padding: "0px",
                                                width: "24px",
                                                height: "24px",
                                            }}
                                        >
                                            <Iconify icon="ic:round-check" width={16} height={16} sx={{ color: "#6ac78b" }} />
                                        </IconButton>
                                    </Box>
                                    <IconButton
                                        style={{
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#fff',
                                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
                                            borderRadius: '32px',
                                            width: '24px',
                                            height: '24px',
                                            boxSizing: 'border-box',
                                            zIndex: '5',
                                            position: 'absolute',
                                            right: '12px',
                                            bottom: '-12px',
                                            padding: '0px',
                                        }}
                                    >
                                        <Iconify icon="mi:chevron-double-down" width={16} height={16} sx={{ color: "#596570" }} />
                                    </IconButton>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
            </ConnectionTable>
            <InstallationTable>
            <Box
                sx={{
                    alignSelf: "stretch",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: "4px",
                    textAlign: "left",
                    fontSize: "18px",
                    color: "#6ac79b",
                    fontFamily: "Manrope",
					'@media (max-width: 1440px)': {
						fontSize: '14px',
					},
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            lineHeight: "24px",
                            fontWeight: "600",
                        }}
                    >
                        Installation
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: "1",
                        position: "relative",
                        fontSize: "16px",
                        color: "#596570",
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        height: "22px",
						'@media (max-width: 1440px)': {
							fontSize: '10px',
						},
                    }}
                >
                    <StyledTypography>
                        <StyledTypography
                            sx={{ lineHeight: "28px", fontWeight: "600" }}
                            component="span"
                        >
                            16 Sections
                        </StyledTypography>
                        <StyledTypography sx={{ lineHeight: "26px" }} component="span">
                            {" "}
                            (8 Sections) x 2 Lines
                        </StyledTypography>
                    </StyledTypography>
                </Box>
            </Box>
               <TableContainer sx={{ width: "max-content", overflow: "hidden"}}>
                    <Table sx={{ border: '1px solid lightgrey'}}>
                            <TableHead>
                                <TableRow style={{ backgroundColor: "#f9f9fa" }}>
                                    <StyledTableCell sx={{ padding: "8px 10px"}}>
                                        <StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>T/L Section</StyledTypography>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "8px 10px"}}>
                                        <StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Length(m)</StyledTypography>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "8px 10px"}}>
                                        <StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Status</StyledTypography>
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <StyledTableCell sx={{ padding: "12px 8px"}}>
                                        <StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Namdong S/S~M/H#1</StyledTypography>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "12px 8px"}}>
                                        <TextField
                                            variant="outlined"
                                            sx={{ width: "70px", "& .MuiInputBase-root": { height: 32 } }}
                                            placeholder="320"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "12px 8px", width: '130px'}}>
                                        <StyledSelect
                                            value="Completed"
                                            variant="outlined"
                                        >
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Not Started">Not Started</MenuItem>
                                        </StyledSelect>
                                    </StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell sx={{ padding: "12px 8px"}}>
                                        <StyledTypography variant="body1" sx={{ padding: "0px", fontSize: "14px" }}>M/H#1~M/H#2</StyledTypography>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "12px 8px"}}>
                                        <TextField
                                            variant="outlined"
                                            sx={{ width: "70px", "& .MuiInputBase-root": { height: 32 } }}
                                            placeholder="320"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ padding: "12px 8px", width: '130px'}}>
                                    <StyledSelect
                                            value="Completed"
                                            variant="outlined"
                                        >
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Not Started">Not Started</MenuItem>
                                        </StyledSelect>
                                    </StyledTableCell>
                                </TableRow>
                            </TableBody>
                    </Table>
               </TableContainer>
            </InstallationTable>
        </>
    );
}