import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import {
  Grid,
  Container,
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  Alert,
  Typography,
  Box,
  Stack,
  Skeleton,
} from '@mui/material';
// components
import Page from '../../components/Page';
// sections
import { getProjectDetails } from 'supabase/projects';
import Iconify from 'components/Iconify';

// ----------------------------------------------------------------------

export default function Projects() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async (id) => {
    setLoading(true);
    const res = await getProjectDetails(id);
    if (res.status === 404) setToast(true);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  const handleClose = () => {
    setToast(null);
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Snackbar
          open={toast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="danger" sx={{ width: '100%' }}>
            Something went wrong!
          </Alert>
        </Snackbar>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {loading ? (
              <>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </>
            ) : (
              <Card>
                <CardHeader title={data?.title} />
                <CardContent>
                  <Typography variant="body2">Contract code: {data?.contractCode}</Typography>
                  <Typography variant="body2">Contract value: {data?.contractValue}</Typography>
                  <Typography variant="body2">
                    Project timeline: {data?.start} - {data?.end}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
          {loading ? (
            <Loading />
          ) : (
            events.map((event, index) => (
              <>
                <Grid item xs={12} md={6} lg={4}>
                  <EventCard event={event} key={index} />
                </Grid>
              </>
            ))
          )}
        </Grid>
      </Container>
    </Page>
  );
}
EventCard.propTypes = {
  key: PropTypes.number,
  event: PropTypes.shape({
    icon: PropTypes.element,
    title: PropTypes.string,
    description: PropTypes.string,
    redirect: PropTypes.string,
  }),
};

function EventCard({ event, key }) {
  const navigate = useNavigate();
  const redirectCard = () => {
    navigate(event.redirect);
  };
  return (
    <>
      <Box
        key={key}
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          cursor: 'pointer',
        }}
        align="center"
        p={2}
        onClick={redirectCard}
      >
        {event?.icon}
        <Typography m={1} align="center" variant="h6">
          {event?.title}
        </Typography>
        <Typography align="center" variant="caption">
          {event?.description}
        </Typography>
      </Box>
    </>
  );
}

function Loading() {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Stack
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
        }}
        align="center"
        p={2}
        spacing={2}
      >
        {/* For variant="text", adjust the height via font-size */}
        {/* For other variants, adjust the size with `width` and `height` */}
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" m={1} width={210} height={20} />
        <Skeleton variant="rectangular" width={210} height={20} />
      </Stack>
    </Grid>
  );
}

const events = [
  {
    icon: <Iconify width={40} height={40} color="#8D99FF" icon="ph:users-light" />,
    title: 'Daily Workforce Planning',
    description: 'Installation team, Connection Team 1, Connection Team 2',
    redirect: '/dashboard/workforce-planning',
  },
  {
    icon: <Iconify width={40} height={40} color="#FFA58D" icon="heroicons-outline:calendar" />,
    title: 'Weekly Process Planning',
    description: '24/02/2022 - 02/03/2022 - 45.78%',
    redirect: '#',
  },
  {
    icon: <Iconify width={40} height={40} color="#8D99FF" icon="heroicons:truck" />,
    title: 'Travel Expenses / Overtime',
    description: '3 day shifts, 54 night shifts, 5 Overtime, 3 Nighttime, 4 Move on rest day',
    redirect: 'travel-expenses?filters=te,specialTe,outsourced,tasks',
  },
  {
    icon: <Iconify width={40} height={40} color="#8CCC67" icon="ant-design:money-collect-outlined" />,
    title: 'Contract Execution Budget',
    description: '169,000,000 (Operating profit: 1,435,293 (0.8%))',
    redirect: '#',
  },
  {
    icon: <Iconify width={40} height={40} color="#7FBCFE" icon="fluent:clipboard-bullet-list-ltr-16-regular" />,
    title: 'Implementation Schedule',
    description: ' 15/06/2022 - 14/08/2022',
    redirect: '/dashboard/project-schedule',
  },
  {
    icon: <Iconify width={40} height={40} color="#FF62B5" icon="heroicons:chart-bar" />,
    title: 'Profit & Loss Reports',
    description: 'Pellentesque in ipsum id orci porta dapibus',
    redirect: '#',
  },
];
