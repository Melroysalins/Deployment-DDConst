import React from 'react';
import { Box, InputLabel, FormControl, FormHelperText, Typography, IconButton, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TableCell, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Iconify from 'components/Iconify';
import style from './ConnectionTable.module.scss';

const ConnectionTable = () => {
    return (
        <>
            <TableContainer sx={{ width: "max-content", borderRadius: '8px', overflowX: 'visible' }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-end"
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
                    <Typography
                        className={style.Typography} // Add className here
                        sx={{
                            writingMode: 'vertical-rl',
                            fontWeight: '600',
                            color: '#fff',
                            transform: 'rotate(180deg)',
                        }}
                    >
                        End point
                    </Typography>
                </Box>
                <Table sx={{ border: '1px solid lightgrey', borderRadius: "0px 8px 0px 0px"}} >
                    <TableHead>
                            <TableRow style={{ backgroundColor: "#f9f9fa" }}>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '92px'}} >
                                            <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Location</Typography>
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '141.5px'}}>
                                            <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Transformer</Typography>
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '141.5px'}}>
                                            <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Connector</Typography>
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '130px'}}>
                                            <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Status</Typography>
                                    </TableCell>
                            </TableRow>
                    </TableHead>
                    <TableBody>
                            <TableRow>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '92px'}}>
                                            <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Namyang</Typography>
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '141.5px'}}>
                                            <FormControl
                                                    variant="outlined"
                                                    sx={{ width: "121.5px" }}
                                                    className={style.FormControl} // Add className here
                                            >
                                                    <InputLabel className={style.InputLabel} color="primary">S/S</InputLabel>
                                                    <Select
                                                            className={style.Select}
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
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '141px'}}>
                                            <FormControl
                                                    variant="outlined"
                                                    sx={{ width: "121.5px"}}
                                                    className={style.FormControl} // Add className here
                                            >
                                                    <InputLabel className={style.InputLabel} color="primary">EB-G</InputLabel>
                                                    <Select
                                                            className={style.Select}
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
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '130px'}}>
                                            <Select
                                                    className={style.StyledSelect}
                                                    size='small'
                                                    value="Completed"
                                                    variant="outlined"
                                            >
                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                                    <MenuItem value="Not Started">Not Started</MenuItem>
                                            </Select>
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '92px'}}>
                                            <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Yeonsu</Typography>
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", wiscssdth: '141px'}}>
                                            <FormControl
                                                    variant="outlined"
                                                    sx={{ width: "121.5px", height: "32px" }}
                                                    className={style.FormControl} // Add className here
                                            >
                                                    <InputLabel className={style.InputLabel} color="primary">T/R</InputLabel>
                                                    <Select
                                                            className={style.Select}
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
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '141px'}}>
                                            <FormControl
                                                    variant="outlined"
                                                    sx={{ width: "121.5px", height: "32px" }}
                                                    className={style.FormControl} // Add className here
                                            >
                                                    <InputLabel className={style.InputLabel} color="primary">EB-A</InputLabel>
                                                    <Select
                                                            className={style.Select}
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
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "12px 8px", width: '130px'}}>
                                            <Select
                                                    className={style.StyledSelect}
                                                    value="Completed"
                                                    variant="outlined"
                                                    size='small'
                                            >
                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                                    <MenuItem value="Not Started">Not Started</MenuItem>
                                            </Select>
                                    </TableCell>
                            </TableRow>
                    </TableBody>
                </Table>
            </Box>
            </TableContainer>
            <TableContainer sx={{ width: "max-content", borderRadius: '8px', overflowX: "visible" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-end"
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
                        <Typography
                        sx={{
                        writingMode: 'vertical-rl', 
                        fontWeight: '600',
                        color: '#fff',
                        transform: 'rotate(180deg)',
                        }}
                        className={style.Typography}
                        >
                        Mid
                        </Typography>
                </Box>
                <Table sx={{ border: '1px solid lightgrey'}} >
                    <TableBody>
                            <TableRow>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '92px'}}>
                                            <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Namyang</Typography>
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '141.5px'}}>
                                            <FormControl
                                                    variant="outlined"
                                                    sx={{ width: "121.5px", height: "32px" }}
                                                    className={style.FormControl} // Add className here
                                            >
                                                    <InputLabel className={style.InputLabel} color="primary">M/H</InputLabel>
                                                    <Select
                                                            className={style.Select}
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
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "8px 10px", width: '141px'}}>
                                            <FormControl
                                                    variant="outlined"
                                                    sx={{ width: "121.5px", height: "32px" }}
                                                    className={style.FormControl} // Add className here
                                            >
                                                    <InputLabel className={style.InputLabel} color="primary">IJ</InputLabel>
                                                    <Select
                                                            className={style.Select}
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
                                    </TableCell>
                                    <TableCell className={style.TableCell} sx={{ padding: "12px 8px", width: '130px'}}>
                                            <Select
                                                    className={style.StyledSelect}
                                                    value="Completed"
                                                    variant="outlined"
                                                    size='small'
                                            >
                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                                    <MenuItem value="Not Started">Not Started</MenuItem>
                                            </Select>
                                    </TableCell>
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
        </>
        
    );
}

export default ConnectionTable;
