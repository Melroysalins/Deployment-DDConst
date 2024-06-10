import { Box, Typography } from '@mui/material'
import { useState , React, useCallback } from 'react'
import { styled } from '@mui/material/styles';
import ConnectionTable from './ConnectionTable';
import InstallationTable from './InstallationTable';
import DemolitionTable from './DemolitionTable';
import PropTypes from 'prop-types';
import { set } from 'lodash';

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

const StyledConnection = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    gap: '8px',
});

const StyledInstallation = styled(Box)({
    flex: '1 1 auto',
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

const StyledDemolition = styled(Box)({
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: '8px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    alignSelf: 'auto',
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

const HeaderText = ({ title, color }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            padding: "0px 0px 0px 28px",
            gap: "4px",
            fontSize: "18px",
            color: { color },
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
            {title}
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
                <StyledTypography sx={{ lineHeight: "26px" }} component="span">
                    (aka T/L)
                </StyledTypography>
            </StyledTypography>
        </Box>
    </Box>
);

export default function FormDiagram({ showDemolitionTable, isEdit, setIsEditing }) {
    const [installations, setInstallations] = useState([]);

    const handleAddInstallation = useCallback(() => {
        setInstallations(prevInstallations => [...prevInstallations, prevInstallations.length + 1]);
    }, []);

    const handleCloseInstallation = useCallback(() => {
        setInstallations(prevInstallations => [...prevInstallations, 'YonsooS/S']);
        setIsEditing(false);
    }, []);

    return (
        <>
            <StyledConnection>
                <HeaderText title="Connection" color="#ffa58d" />
                <ConnectionTable isEdit={isEdit} handleAddInstallation={handleAddInstallation} handleCloseInstallation={handleCloseInstallation}/>
            </StyledConnection>
            <StyledInstallation>
                <HeaderText title="Installation" color="#6ac79b" />
                <InstallationTable installations={installations} isEdit={isEdit} />
            </StyledInstallation>
            {showDemolitionTable && (
                <StyledDemolition>
                    <HeaderText title="Demolition" color="#7FBCFE" />
                    <DemolitionTable isEdit={isEdit} />
                </StyledDemolition>
            )}
        </>
    );
}

FormDiagram.propTypes = {
    showDemolitionTable: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool,
    setIsEditing: PropTypes.func,
};
