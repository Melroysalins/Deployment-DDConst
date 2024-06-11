import React, { useState } from 'react';
import { TableContainer, Box, Typography, IconButton, Table, TextField, TableRow, TableCell, Select, MenuItem, FormControl, InputLabel, FormHelperText, TableHead, TableBody, Collapse } from '@mui/material';
import style from './DemolitionTable.module.scss';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import Iconify from 'components/Iconify';

const renderTableCell = (text, tableWidth) => {
    return (
        <TableCell className={style.TableCell} sx={{ width: tableWidth }}>
            <Typography variant="body1" className={style.Typography}>{text}</Typography>
        </TableCell>
    );
};
const renderFormControl = (label, selectLabel, tableWidth, isEdit) => {
    return (
        isEdit ? (
            <TableCell className={style.TableCell} sx={{ width: tableWidth }}>
                <FormControl
                    variant="outlined"
                    sx={{ width: "100%", height: "32px" }}
                    className={style.FormControl}
                >
                    <InputLabel className={style.InputLabel} color="primary">{label}</InputLabel>
                    <Select
                        className={style.Select}
                        color="primary"
                        sx={{ height: "32px" }}
                        label={selectLabel}
                        disableUnderline
                        displayEmpty
                    >
                        <MenuItem value="">None</MenuItem>
                        {/* Add more menu items here */}
                    </Select>
                    <FormHelperText />
                </FormControl>
            </TableCell>
        ) : (
            renderTableCell(label, tableWidth)
        )
    );
};

const renderTableRow = (section, isEdit, index) => {
    return (
        <TableRow index={index}>
            {renderTableCell(section, '10%')}
            {renderFormControl("M/H", "S/S", '19%', isEdit)}
            {renderFormControl("IJ", "EB-G", '19%', isEdit)}
            {renderTableCell("NamyangS/S~M/H#1", '19%')}
            {isEdit ? (
                <TableCell className={style.TableCell} sx={{ padding: "12px 8px", width: '19%' }}>
                    <TextField
                        variant="outlined"
                        sx={{ "& .MuiInputBase-root": { height: 32 } }}
                        placeholder="320"
                    />
                </TableCell>
            ) : (
                renderTableCell("320", '19%')
            )}
            <TableCell className={style.TableCell} sx={{ padding: "12px 8px", width: '14%' }}>
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
    );
};


const DemolitionTable = ({ isEdit }) => {

    const [demolitions, setDemolitions] = useState([1, 2]);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAddDemolition = () => {
        setDemolitions(prevDemolitions => [...prevDemolitions, prevDemolitions.length + 1]); // Add a new row
    };

    return (
            <Box sx={{ position: 'relative', left: '24px', width: '95%' }}>
                <TableContainer sx={{ overflow: 'hidden',border: '1px solid lightgrey', borderRadius: "8px" }}>
                <Table >
                <Collapse in={isExpanded} collapsedSize={demolitions.length < 7 ? demolitions.length * 53 + 33.5 : 350}>
                    <Box sx={{ maxHeight: isExpanded ? 'none' : '350px', overflow: 'auto' }}>
                        <TableHead >
                            <TableRow style={{ backgroundColor: "#f9f9fa" }} >
                                {renderTableCell("#", '10%')}
                                {renderTableCell("Transformer", '19%')}
                                {renderTableCell("Connector", '19%')}
                                {renderTableCell("T/L Section", '19%')}
                                {renderTableCell("Length", '19%')}
                                {renderTableCell("Status", '14%')}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {demolitions.map((demolition, index) => (
                                renderTableRow(`#${demolition}`, isEdit, index)
                            ))}        
                        </TableBody>     
                    </Box>   
                </Collapse>
                    
                    {isEdit && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: "-12px",
                                left: "24px",
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
                                onClick={handleAddDemolition}
                            >
                                <AddIcon sx={{ color: "#fff" }} />
                            </IconButton>
                        </Box>
                    )}
                    {demolitions.length > 6 && (
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
                            onClick={setIsExpanded(prevIsExpanded => !prevIsExpanded)} 
                        >
                            <Iconify icon={isExpanded ? "mi:chevron-double-up" : "mi:chevron-double-down"} width={16} height={16} sx={{ color: "#596570" }} />
                        </IconButton>
                    )}
                </Table>
                </TableContainer>
            </Box>
    );
};

DemolitionTable.propTypes = {
    isEdit: PropTypes.bool.isRequired,
};

export default DemolitionTable;
