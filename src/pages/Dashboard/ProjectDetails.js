// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Card, CardHeader, CardContent } from '@mui/material';
// components
import Page from '../../components/Page';
// sections
import { ProjectList } from '../../sections/dashboard/app';

// ----------------------------------------------------------------------

export default function Projects() {
  const theme = useTheme();

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Card>
          <CardHeader title="PRoject detail page" />
          <CardContent></CardContent>
        </Card>
      </Container>
    </Page>
  );
}
