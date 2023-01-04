import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function HrAdmin() {
  return (
    <Page title="Dashboard: Blog">
      {/* <Container> */}

      <iframe
        title="hr admin"
        frameBorder="0"
        scrolling="yes"
        seamless="seamless"
        style={{display:"block", width:"100%", height:"100vh"}}
        src="https://app.appsmith.com/app/hr-dashboard/employees-637b15e73d59b3216e3291c6?branch=master"
      />
      {/* </Container> */}
    </Page>
  );
}
