import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, Typography } from '@mui/material'
import style from './InstallationTable.module.scss'

const InstallationTable = () => {
    return (
        <TableContainer sx={{ width: "max-content", overflow: "hidden", marginLeft: '25px' }}>
                <Table sx={{ border: '1px solid lightgrey'}}>
                        <TableHead>
                                <TableRow style={{ backgroundColor: "#f9f9fa" }}>
                                        <TableCell className={style.TableCell} sx={{ padding: "8px 10px"}}>
                                                <Typography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }} className={style.Typography}>T/L Section</Typography>
                                        </TableCell>
                                        <TableCell className={style.TableCell} sx={{ padding: "8px 10px"}}>
                                                <Typography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }} className={style.Typography}>Length(m)</Typography>
                                        </TableCell>
                                        <TableCell className={style.TableCell} sx={{ padding: "8px 10px"}}>
                                                <Typography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }} className={style.Typography}>Status</Typography>
                                        </TableCell>
                                </TableRow>
                        </TableHead>
                        <TableBody>
                                <TableRow>
                                        <TableCell className={style.TableCell} sx={{ padding: "12px 8px"}}>
                                                <Typography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }} className={style.Typography}>Namdong S/S~M/H#1</Typography>
                                        </TableCell>
                                        <TableCell className={style.TableCell} sx={{ padding: "12px 8px"}}>
                                                <TextField
                                                        variant="outlined"
                                                        sx={{ width: "70px", "& .MuiInputBase-root": { height: 32 } }}
                                                        placeholder="320"
                                                />
                                        </TableCell>
                                        <TableCell className={style.TableCell} sx={{ padding: "12px 8px", width: '130px'}}>
                                                <Select
                                                        value="Completed"
                                                        variant="outlined"
                                                        className={style.StyledSelect}
                                                        size="small" 
                                                >
                                                        <MenuItem value="Completed">Completed</MenuItem>
                                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                                        <MenuItem value="Not Started">Not Started</MenuItem>
                                                </Select>
                                        </TableCell>
                                </TableRow>
                                <TableRow>
                                        <TableCell className={style.TableCell} sx={{ padding: "12px 8px"}}>
                                                <Typography variant="body1" sx={{ padding: "0px", fontSize: "14px" }} className={style.Typography}>M/H#1~M/H#2</Typography>
                                        </TableCell>
                                        <TableCell className={style.TableCell} sx={{ padding: "12px 8px"}}>
                                                <TextField
                                                        variant="outlined"
                                                        sx={{ width: "70px", "& .MuiInputBase-root": { height: 32 } }}
                                                        placeholder="320"
                                                />
                                        </TableCell>
                                        <TableCell className={style.TableCell} sx={{ padding: "12px 8px", width: '130px'}}>
                                                <Select
                                                        value="Completed"
                                                        variant="outlined"
                                                        className={style.StyledSelect}
                                                        size="small" 
                                                >
                                                        <MenuItem value="Completed">Completed</MenuItem>
                                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                                        <MenuItem value="Not Started">Not Started</MenuItem>
                                                </Select>
                                        </TableCell>
                                </TableRow>
                        </TableBody>
                </Table>
        </TableContainer>
    )
}

export default InstallationTable
