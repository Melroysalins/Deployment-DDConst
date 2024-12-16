import React, { useState } from 'react';
import { Typography, Stack, Button as MuiButton, Tooltip } from '@mui/material';
import Iconify from 'components/Iconify';

export default function Project({t}) {
  const [open, setOpenActions] = useState(false);
  const handleToggle = () => setOpenActions((prev) => !prev);

  const renderCustomHeader = () => (
    <Stack width="100%" flexDirection="row" justifyContent="space-between">
      <Typography textAlign="center" variant="subtitle2">
        {t('Project')}
      </Typography>
      <Stack flexDirection="row">
        {open && (
          <>
            <MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
              <Iconify icon="tabler:crane" width={20} height={20} />
            </MuiButton>
            <Tooltip title="Add travel expenses" arrow>
              <MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
                <Iconify icon="lucide:calendar-check" width={20} height={20} />
              </MuiButton>
            </Tooltip>
            <Tooltip title="Add special travel expenses" arrow>
              <MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
                <Iconify icon="tabler:plane-tilt" width={20} height={20} />
              </MuiButton>
            </Tooltip>
            <Tooltip title="Add overtime" arrow>
              <MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
                <Iconify icon="mdi:auto-pay" width={20} height={20} />
              </MuiButton>
            </Tooltip>
          </>
        )}
        <MuiButton onClick={handleToggle} sx={{ minWidth: 0 }} size="small" color="inherit">
          <Iconify icon={`ic:baseline-${open ? 'minus' : 'plus'}`} width={20} height={20} />
        </MuiButton>
      </Stack>
    </Stack>
  );

  return <div>{renderCustomHeader()}</div>;
}
