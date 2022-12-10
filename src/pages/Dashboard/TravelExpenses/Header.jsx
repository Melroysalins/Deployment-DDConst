import React from 'react';
import { Avatar, Typography, Box, Stack, Button as MuiButton, Tooltip } from '@mui/material';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Iconify from 'components/Iconify';
import {Logs} from 'components'

// components
import Filters from './Filters';

const initialFilters = { te: true, specialTe: true, outsourced: true, tasks: true };

const Header = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = React.useState(initialFilters);

  const handleFilters = React.useCallback(() => {
    let _filters = searchParams.get('filters');
    _filters = _filters?.split(',').reduce((acc, cur) => ({ ...acc, [cur]: true }), {});
    if (_filters) setFilters((prev) => ({ ...initialFilters, ..._filters }));
    else
      navigate({
        pathname,
        search: `?filters=te,specialTe,outsourced,tasks`,
      });
  }, [searchParams]);

  // // for checking filter parameters
  // React.useEffect(() => {
  // handleFilters();
  // return () => {};
  // }, [searchParams]);

  // // for handling filters
  // React.useEffect(() => {
  // let updatedResources = state.resources;
  // let updatedEvents = state.events;
  // if (!filters.outsourced) {
  //   updatedResources = state.resources.map((project) => ({
  //     ...project,
  //     children: project.children.filter((team) => team.team_type !== 'Outsource'),
  //   }));
  // }
  // if (!filters.tasks) {
  //   updatedEvents = state.events.filter((event) => event.subType !== 'task');
  // }
  // if (!filters.te) {
  //   updatedEvents = state.events.filter((event) => event.type !== 'travel');
  // }
  // if (!filters.specialTe) {
  //   updatedEvents = state.events.filter((event) => event.type !== 'special');
  // }
  // const res = updateCalendarData(updatedResources, updatedEvents);
  // dispatch({ type: TEActionType.UPDATE_EVENTS, payload: res.events });
  // dispatch({ type: TEActionType.UPDATE_RESOURCES, payload: res.resources });
  // }, [filters]);

   const [isDrawerOpen, setisDrawerOpen] = React.useState(false);

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'absolute', top: '24px', right: '40px' }}>
      {/* Not responsive */}
      {/* <Filters filters={filters} /> */}
      <MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 1, minWidth: 0 }} onClick={()=> setisDrawerOpen(true)}>
        <Iconify icon="heroicons-outline:document-text" width={20} height={20} />
      </MuiButton>
      <MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 1, minWidth: 0 }}>
        <Iconify icon="material-symbols:download-rounded" width={20} height={20} />
      </MuiButton>
      <MuiButton
        startIcon={<Iconify icon="ph:hourglass-simple-bold" width={20} height={20} />}
        size="small"
        variant="outlined"
        color="inherit"
        sx={{ padding: '8px 24px', minWidth: 0 }}
      >
        Pending
      </MuiButton>

       <Logs open={isDrawerOpen} setopen={setisDrawerOpen}/>
    </Stack>
  );
};

export default Header;
