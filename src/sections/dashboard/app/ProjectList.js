import React from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Card, Typography, CardHeader, Grid, CardContent, Snackbar, Alert } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { listAllProjects } from 'supabase/project';

export default function ProjectList() {
  const [loader, setLoader] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await listAllProjects();
      if (res.status === 404) {
        setToast({ severity: 'danger', message: 'Something went wrong!' });
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      }
    } catch (err) {
      setToast({ severity: 'danger', message: 'Something went wrong!' });
    }
  };

  const handleClose = () => {
    setToast(null);
  };

  return (
    <>
      <Snackbar
        open={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={toast?.severity} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
      <Grid container spacing={3}>
        {data.map((project) => (
          <Grid item xs={12} sm={6} md={3}>
            <ProjectItem data={project} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== '_color',
})(({ theme, _color }) => ({
  height: 28,
  borderRadius: 8,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 8,
    backgroundColor: _color,
  },
}));

const Header = styled(CardHeader)(({ theme }) => {
  return {
    '& .MuiCardHeader-title': {
      ...theme.typography.subtitle2,
      fontWeight: 700,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkitLineClamp': '3',
      '-webkitBoxOrient': 'vertical',
      height: '4rem',
    },
  };
});

ProjectItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    location: PropTypes.string,
    contractCode: PropTypes.string,
    color: PropTypes.string,
    contractValue: PropTypes.number,
    rateOfCompletion: PropTypes.number,
  }),
};

function ProjectItem({ data }) {
  console.log(data);
  const navigate = useNavigate();
  const { title, location, contractCode, contractValue, start, end, rateOfCompletion, color, id } = data;

  const changeView = React.useCallback(() => {
    navigate(String(id));
  }, [id]);

  return (
    <>
      {' '}
      <Card key={id} onClick={changeView}>
        <Header
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          }}
          title={title}
          subheader={location}
        />
        <CardContent>
          <Box sx={{ position: 'relative' }}>
            <BorderLinearProgress _color={color} variant="determinate" value={rateOfCompletion} />
            <Typography
              sx={{ position: 'absolute', top: '25%', left: 'calc(50% - 65px)', fontSize: '10px' }}
              variant="overline"
            >
              COMPLETED: {rateOfCompletion}%
            </Typography>
          </Box>

          <Box sx={{ p: '10px 0', color: '#596570' }}>
            <Typography variant="body2">
              {' '}
              <span style={{ color: 'black' }}>Contract code:</span> {contractCode}
            </Typography>
            <Typography variant="body2">
              <span style={{ color: 'black' }}>Contract value:</span> {contractValue}
            </Typography>
            <Typography variant="body2">
              <span style={{ color: 'black' }}>Project timeline:</span>&nbsp;
              {start} to {end}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
