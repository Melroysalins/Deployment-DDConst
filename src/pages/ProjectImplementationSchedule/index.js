import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import Calendar from './Calendar';

const ProjectIntro = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 24,
  marginTop: 24,
}));

const ProjectImplementationSchedule = () => {
  return (
    <div>
      <Box
        sx={{
          padding: '24px 30px',
        }}
      >
        <h3>154kV Gwangyang Port-Sepoong UndergroundT/L Construction Work Implementation Schedule (09/22)</h3>

        <ProjectIntro>
          <h5>Project Name : 154kV Gwangyang Port-Sepoong UndergroundT/L Construction Work</h5>
          <h5>Line Type and Length: 154kV XLPE 200mm 2Line(D)-5.3km</h5>
          <h5>Installation & On-site : Install 13 sections, Connections 52(Middle 48, End 4)</h5>
        </ProjectIntro>
        <Calendar />
      </Box>
    </div>
  );
};

export default ProjectImplementationSchedule;
