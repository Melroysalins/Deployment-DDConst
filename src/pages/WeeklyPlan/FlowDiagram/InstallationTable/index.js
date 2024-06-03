import React from 'react'
import PropTypes from 'prop-types'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, TextField, Select, MenuItem } from '@mui/material'
import style from './InstallationTable.module.scss'

const renderTableCell = (text) => {
        return (
                <TableCell className={style.TableCell} sx={{ padding: "12px 8px"}}>
                        <Typography variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }} className={style.Typography}>{text}</Typography>
                </TableCell>
        )
}

const renderTableRow = (section) => {
        return (
                <TableRow>
                        {renderTableCell(section)}
                        <TableCell className={style.TableCell} sx={{ padding: "12px 8px", width: '100%'}}>
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
        )
}

const InstallationTable = ({ installations }) => {
        return (
                <TableContainer sx={{ width: "max-content", overflow: "hidden", marginLeft: '25px' }}>
                        <Table sx={{ border: '1px solid lightgrey'}}>
                                <TableHead>
                                        <TableRow style={{ backgroundColor: "#f9f9fa" }}>
                                                {renderTableCell("T/L Section")}
                                                {renderTableCell("Length(m)")}
                                                {renderTableCell("Status")}
                                        </TableRow>
                                </TableHead>
                                <TableBody>
                                        {renderTableRow(`NamyangS/S~M/H#1`)}
                                        {installations && (
                                                installations.map((installation, index) => (
                                                        installation === "YonsooS/S"
                                                        ? renderTableRow(`M/H#${index + 1}~YonsooS/S`) 
                                                        : renderTableRow(`M/H#${index + 1}~M/H#${index + 2}`)
                                                ))
                                        )}
                                </TableBody>
                        </Table>
                </TableContainer>
        )
}

InstallationTable.propTypes = {
        installations: PropTypes.array.isRequired
}

export default InstallationTable
