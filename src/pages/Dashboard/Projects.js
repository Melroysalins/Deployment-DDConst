// @mui
import { Grid, Container } from '@mui/material';
// components
import Page from '../../components/Page';
// sections
import { ProjectList } from '../../sections/dashboard/app';

// ----------------------------------------------------------------------

export default function Projects() {
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
