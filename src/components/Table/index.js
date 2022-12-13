import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { isNotEmpty } from 'utils/helper';
import { Stack } from '@mui/system';
import Iconify from 'components/Iconify';
import style from './table.module.scss';

const CreateRow = ({ row, open, setOpen, isChild = false }) => {
  const { name, rightIcon, rightIconText, hasDetail, values, leftImg } = row;
  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell component="th" scope="row" className={style.tableRow}>
        <Stack direction="row" justifyContent={'space-between'} width={'250px'}>
          <Stack direction="row" gap={'5px'} alignItems={'center'}>
            {!!leftImg && (
              <div className={style.imgContainer}>
                <img src={leftImg} alt="employee" />
              </div>
            )}

            {!isChild ? <b>{name}</b> : <span>{name}</span>}
            {!!rightIcon && (
              <div className={style.rightIcon}>
                <Iconify icon={rightIcon} width={16} height={16} />
              </div>
            )}

            {!!rightIconText && (
              <div className={style.rightIconText}>
                <span>{rightIconText}</span>
              </div>
            )}
          </Stack>
          {hasDetail && (
            <IconButton className={style.toggleIcon} onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </Stack>
      </TableCell>

      {values?.map((e, index) => (
        <TableCell key={index}>{e}</TableCell>
      ))}
    </TableRow>
  );
};

function Row({ row }) {
  const [open, setOpen] = React.useState(false);
  const { detail } = row;

  return (
    <>
      <CreateRow row={row} open={open} setOpen={setOpen} />
      {open &&
        detail.map((e) => (
          <React.Fragment key={e.name}>
            <CreateRow row={e} isChild={true} />
          </React.Fragment>
        ))}
    </>
  );
}

export default function CollapsibleTable({ mainCol, headerCol, rows, startRow, className = '' }) {
  return (
    <TableContainer component={Paper} className={`cutomTable ${className}`}>
      <Table aria-label="collapsible table">
        <TableHead>
          {isNotEmpty(mainCol) && (
            <TableRow>
              <TableCell />
              {mainCol.map((e, index) => (
                <TableCell key={index} colSpan={e.col} className={style.seperation}>
                  {e.name}
                </TableCell>
              ))}
            </TableRow>
          )}
          <TableRow>
            <TableCell> {startRow} </TableCell>
            {headerCol.map((e, index) => (
              <TableCell key={index}>{e}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
