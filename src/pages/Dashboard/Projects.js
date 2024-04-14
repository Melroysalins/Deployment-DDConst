// @mui
import { Grid, Container } from '@mui/material'
// components
import Page from '../../components/Page'
// sections
import { ProjectList } from '../../sections/dashboard/app'

// ----------------------------------------------------------------------

export default function Projects() {
	return (
		<Page title="Dashboard">
			<Container maxWidth="xl">
				<ProjectList />
			</Container>
		</Page>
	)
}
