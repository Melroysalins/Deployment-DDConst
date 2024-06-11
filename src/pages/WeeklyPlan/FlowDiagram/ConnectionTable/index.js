import React, { useState } from 'react';
import { Box, InputLabel, FormControl, FormHelperText, Typography, IconButton, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TableCell, TableRow, Collapse, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Iconify from 'components/Iconify';
import style from './ConnectionTable.module.scss';
import PropTypes from 'prop-types';

const renderTableCell = (label, selectLabel, tableWidth, isEdit) => {
        return (
                <TableCell className={style.TableCell} sx={{ padding: "6px 10px", width: tableWidth}}>
                        {isEdit ? (
                                <FormControl
                                        variant="outlined"
                                        sx={{ width: "121.5px", height: "32px" }}
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
                        ) : (
                                <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>{label}</Typography>
                        )}
                </TableCell>
        );
};

const renderTableRow = (index, isEdit) => {
        return (
                <TableRow key={index}>
                        <TableCell className={style.TableCell} sx={{ padding: "6px 10px", width: '92px' }}>
                                <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>{`#${index + 1}`}</Typography>
                        </TableCell>
                        {renderTableCell("M/H", "S/S", '141.5px', isEdit)}
                        {renderTableCell("IJ", "EB-G", '141.5px', isEdit)}
                        <TableCell className={style.TableCell} sx={{ padding: "12px 8px", width: '130px' }}>   
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

const ConnectionTable = ({ handleAddInstallation, handleCloseInstallation, isEdit }) => {
        const [midPoints, setMidPoints] = useState([1]);
        const [isExpanded, setIsExpanded] = useState(false);

        const addPanel = () => {
                setMidPoints(prevMidPoints => [...prevMidPoints, prevMidPoints.length + 1]);
                handleAddInstallation();
        };

        const toggleExpand = () => {
                setIsExpanded(prevIsExpanded => !prevIsExpanded);
        };

        return (
                <>
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
                                <TableContainer sx={{ width: "max-content", border: '1px solid lightgrey', borderRadius: "0px 8px 0px 0px" }}>
                                        <Table sx={{ overflow: 'hidden' }} >
                                                <TableHead>
                                                        <TableRow style={{ backgroundColor: "#f9f9fa" }}>
                                                                <TableCell className={style.TableCell} sx={{ padding: "6px 10px", width: '92px' }} >
                                                                        <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Location</Typography>
                                                                </TableCell>
                                                                <TableCell className={style.TableCell} sx={{ padding: "6px 10px", width: '141.5px' }}>
                                                                        <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Transformer</Typography>
                                                                </TableCell>
                                                                <TableCell className={style.TableCell} sx={{ padding: "6px 10px", width: '141.5px' }}>
                                                                        <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Connector</Typography>
                                                                </TableCell>
                                                                <TableCell className={style.TableCell} sx={{ padding: "6px 10px", width: '130px' }}>
                                                                        <Typography className={style.Typography} variant="body1" sx={{ padding: "0px", fontSize: "14px", textAlign: "center" }}>Status</Typography>
                                                                </TableCell>
                                                        </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {renderTableRow(0, isEdit)}
                                                        {renderTableRow(1, isEdit)}
                                                </TableBody>
                                        </Table>
                                </TableContainer>
                        </Box>
                        <Box
                                sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start"
                                }}
                        >
                                <Box
                                        sx={{
                                                maxHeight: '104px',
                                                minHeight: '67px',
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
                                                Mid {midPoints.length > 1 ? 'point' : ''}
                                        </Typography>
                                </Box>
                                <TableContainer sx={{ width: "max-content", borderRadius: '0px 0px 8px 0px', border: '1px solid lightgrey' }}>
                                        <Box sx={{ overflow: 'hidden' }}>
                                                <Table >
                                                        <TableBody>
                                                                <Collapse in={isExpanded} collapsedSize={midPoints.length < 7 ? midPoints.length * 65 : 390}>
                                                                        <Box sx={{ maxHeight: isExpanded ? 'none' : '390px', overflow: 'auto' }}>
                                                                                {midPoints.map((index) => (
                                                                                        <>{renderTableRow(index - 1, isEdit)}</>
                                                                                ))}
                                                                        </Box>
                                                                </Collapse>
                                                                {isEdit && (
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
                                                                                        onClick={addPanel} // Add onClick event handler here
                                                                                >
                                                                                        <AddIcon sx={{ color: "#fff" }} />
                                                                                </IconButton>
                                                                                <Tooltip title="Done adding" arrow placement="right" >
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
                                                                                                onClick={handleCloseInstallation} // Add onClick event handler here
                                                                                        >
                                                                                                <Iconify icon="ic:round-check" width={16} height={16} sx={{ color: "#6ac78b" }} />
                                                                                        </IconButton>
                                                                                </Tooltip>
                                                                        </Box>
                                                                )}
                                                                {midPoints.length > 6 && (
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
                                                                                onClick={toggleExpand} // Add onClick event handler here
                                                                        >
                                                                                <Iconify icon={isExpanded ? "mi:chevron-double-up" : "mi:chevron-double-down"} width={16} height={16} sx={{ color: "#596570" }} />
                                                                        </IconButton>
                                                                )}
                                                        </TableBody>
                                                </Table>
                                        </Box>

                                </TableContainer>
                        </Box>

                </>
        );
}

ConnectionTable.propTypes = {
        handleAddInstallation: PropTypes.func.isRequired,
        handleCloseInstallation: PropTypes.func.isRequired,
        isEdit: PropTypes.bool.isRequired,
};

export default ConnectionTable;
