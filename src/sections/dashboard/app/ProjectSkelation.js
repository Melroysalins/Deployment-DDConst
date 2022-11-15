import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';

export default function Variants() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </Stack>
      </Grid>
    </Grid>
  );
}
