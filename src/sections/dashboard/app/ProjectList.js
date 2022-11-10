// @mui
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Card, Typography, CardHeader, Grid, CardContent } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import data from 'pages/Dashboard/data.json';

export default function ProjectList() {
  return (
    <>
      <Grid container spacing={3}>
        {data.projects.map((project) => (
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
  const { title, location, contractCode, contractValue, start, end, rateOfCompletion, color } = data;

  return (
    <Card>
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
            <span style={{ color: 'black' }}>Project timeline:</span>
            {start} to {end}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
