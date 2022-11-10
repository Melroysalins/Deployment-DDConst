// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
// sections
import { ProjectList } from '../../sections/dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProjectList />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
