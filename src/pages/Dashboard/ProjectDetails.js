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
  Avatar,
  Chip,
} from '@mui/material';
// components
import Page from '../../components/Page';
// sections
import { getProjectDetails } from 'supabase/projects';
import Iconify from 'components/Iconify';
import { useTheme } from '@mui/material/styles';

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

        {/* <Grid item xs={12}>
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
                <Typography variant="body2">Contract code: {data?.contract_code}</Typography>
                <Typography variant="body2">Contract value: {data?.contract_value}</Typography>
                <Typography variant="body2">
                  Project timeline: {data?.start} - {data?.end}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid> */}

        <Grid container spacing={3}>
          {eventCost.map((event, index) => (
            <>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <EventCardCost event={event} key={index} />
              </Grid>
            </>
          ))}

          <Grid item xs={12} sm={4} md={3}>
            <ProjectInfo projectInfo={projectInfo} />
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <TeamMates projectInfo={projectInfo} title={data?.title} />
          </Grid>

          {loading ? (
            <Loading />
          ) : (
            events.map((event, index) => (
              <>
                <Grid item xs={12} sm={6} md={4} lg={2}>
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
          height: '100%',
        }}
        align="center"
        p={2}
        onClick={redirectCard}
        maxHeight={'sm'}
      >
        {event?.icon}
        <Typography m={1} align="center" sx={{ fontWeight: 600 }}>
          {event?.title}
        </Typography>
        <Typography align="center" variant="caption">
          {event?.description}
        </Typography>
      </Box>
    </>
  );
}

function EventCardCost({ event, key }) {
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
          height: '100%',
        }}
        align="center"
        p={2}
        maxHeight={'sm'}
      >
        <Typography m={1} align="center" sx={{ fontWeight: 600, fontSize: 14 }}>
          {event?.title}
        </Typography>
        <Typography align="center" variant="caption" color={event?.color} fontSize={16}>
          {event?.cost}
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

function ProjectInfo({ projectInfo }) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: 2,
          height: '100%',
        }}
        p={2}
      >
        <Typography m={1} sx={{ fontWeight: 600, fontSize: 16 }}>
          Project info
        </Typography>
        {projectInfo?.map((e) => (
          <Grid container spacing={2} style={{ alignItems: 'center' }} mt={1} pl={3}>
            <Iconify width={15} height={15} icon={e.icon} />
            <Typography m={1} sx={{ fontSize: 12, color: 'text.secondary' }}>
              {e.title}
            </Typography>
          </Grid>
        ))}
      </Box>
    </>
  );
}

function TeamMates({ projectInfo, title }) {
  const theme = useTheme();
  const randomPick = () => {
    const colors = ['#FF62B5', '#8CCC67', '#8D99FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: 2,
        }}
        p={2}
      >
        <Typography m={1} sx={{ fontWeight: 600, fontSize: 16 }}>
          TeamMates
        </Typography>
        <Grid container spacing={4}>
          {Array.from(Array(16).keys())?.map((e) => {
            return (
              <Grid item xs={12} sm={6} md={5} lg={3} style={{ flexDirection: 'row' }} mt={1} pl={3}>
                <Box sx={{ display: 'flex' }}>
                  <Box pt={0.3}>
                    <Avatar sx={{ bgcolor: randomPick, width: 18, height: 18, fontSize: 12 }}>E</Avatar>
                  </Box>
                  <Box pl={1}>
                    <Box justifyContent={'space-between'} display="flex">
                      <Typography variant="caption" color={theme.palette.text.secondary}>
                        Employee_{(Math.random() + 1).toString(36).substring(9)}
                      </Typography>
                      {e % 12 === 0 && (
                        <Typography
                          style={{
                            borderRadius: 3,
                            background: '#FF6B00',
                            color: 'white',
                            fontSize: 8,
                            height: 15,
                            paddingInline: 5,
                            paddingBlock: 1,
                          }}
                          variant={'caption'}
                        >
                          TEAM LEAD
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="caption">{title}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
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
    redirect: 'travel-expenses?filters=te,ste,outsourced,tasks',
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

const eventCost = [
  {
    title: 'Fixed Cost',
    cost: '1,278,663,306',
    color: '#8D99FF',
  },
  {
    title: 'Labor Cost',
    cost: '1,200,629,509',
    color: '#FFA58D',
  },
  {
    title: 'Administrative Expenses',
    cost: '42,033,797',
    color: '#98D2C3',
  },
  {
    title: 'Asset Maintenance Cost',
    cost: '36,000,000',
    color: '#8CCC67',
  },
  {
    title: 'Operating Profit',
    cost: '-143,207,384',
    color: '#7FBCFE',
  },
  {
    title: 'Operating Profit (%)',
    cost: '-4%',
    color: '#FF62B5',
  },
];

const projectInfo = [
  {
    title: 'Private Co',
    icon: 'material-symbols:handshake-outline-sharp',
  },
  {
    title: 'Full Service',
    icon: 'material-symbols:home-repair-service-outline',
  },
  {
    title: '154 kV',
    icon: 'radix-icons:lightning-bolt',
  },
  {
    title: 'Jinju-Hadong Underground',
    icon: 'heroicons-outline:location-marker',
  },
  {
    title: 'Iljin Electric',
    icon: 'bi:buildings',
  },
  {
    title: '43993',
    icon: 'ion:document-text-outline',
  },
  {
    title: '169,000,000',
    icon: 'material-symbols:account-balance-wallet-outline',
  },
];
