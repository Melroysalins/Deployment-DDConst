import React from 'react';
import { useSearchParams } from 'react-router-dom';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import {
  Eventcalendar,
  setOptions,
  Popup,
  Button,
  Input,
  formatDate,
  Datepicker,
  momentTimezone,
  CalendarNav,
  CalendarPrev,
  CalendarToday,
  CalendarNext,
} from '@mobiscroll/react';
import moment from 'moment-timezone';
import { styled } from '@mui/material/styles';
import { Avatar, Typography, Box, Stack, Button as MuiButton } from '@mui/material';
import Iconify from 'components/Iconify';
import './calendar.scss';

import Page from 'components/Page';
import { Loader } from 'reusables';
import Filters from './Filters';
import Drawer from './Drawer';

import { listAllEvents, createNewEvent, deleteEvent } from 'supabase/events';
import data from './data.json';
import getHolidays from './getHolidays';

setOptions({
  theme: 'ios',
  themeVariant: 'light',
});
momentTimezone.moment = moment;

const viewSettings = {
  timeline: {
    type: 'month',
    size: 2,
    eventList: true,
    rowHeight: 'equal',
  },
};
const responsivePopup = {
  medium: {
    display: 'anchored',
    width: 520,
    fullScreen: false,
    touchUi: false,
  },
};

const defaultHolidays = [
  { background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SU' } },
  { background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SA' } },
];

const Rating = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'rating',
})(({ theme, rating }) => {
  let color = null;
  switch (rating) {
    case 'S':
      color = theme.palette.chart.violet[0];
      break;
    case 'A':
      color = theme.palette.chart.red[0];
      break;
    case 'B':
      color = theme.palette.chart.yellow[0];
      break;
    case 'C':
      color = theme.palette.chart.green[0];
      break;

    default:
      color = theme.palette.grey[500];
      break;
  }
  return {
    height: 20,
    width: 20,
    fontSize: 11,
    marginLeft: 11,
    backgroundColor: color,
  };
});

const initialFilters = { te: true, specialTe: true, outsourced: false, tasks: false };

function App() {
  const [searchParams] = useSearchParams();
  const [myEvents, setMyEvents] = React.useState(data.events);
  const [tempEvent, setTempEvent] = React.useState(null);
  const [isOpen, setOpen] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [anchor, setAnchor] = React.useState(null);
  const [start, startRef] = React.useState(null);
  const [end, endRef] = React.useState(null);
  const [popupEventTitle, setTitle] = React.useState('');
  const [popupEventSite, setSite] = React.useState('');
  const [popupEventColor, setColor] = React.useState('');
  const [popupEventDate, setDate] = React.useState([]);
  const [mySelectedDate, setSelectedDate] = React.useState(new Date());
  const [checkedResources, setCheckedResources] = React.useState([]);
  const [myResources, setMyResources] = React.useState(data.resources);
  const [invalid, setInvalid] = React.useState([
    {
      recurring: {
        repeat: 'daily',
      },
      resource: [],
    },
  ]);
  const [loader, setLoader] = React.useState(false);
  const [projectError, setProjectError] = React.useState(false);
  const [holidays, setHolidays] = React.useState(defaultHolidays);
  const [filters, setFilters] = React.useState(initialFilters);

  const handleFilters = React.useCallback(() => {
    let _filters = searchParams.get('filters');
    console.log(_filters);
    _filters = _filters?.split(',').reduce((acc, cur) => ({ ...acc, [cur]: true }), {});
    if (_filters) setFilters((prev) => ({ ...initialFilters, ..._filters }));
  }, [searchParams]);

  React.useEffect(() => {
    handleFilters();
    return () => {};
  }, [searchParams]);

  React.useEffect(() => {
    if (filters.outsourced) {
      setMyResources(data.resources);
    } else {
      setMyResources(() => data.resources.filter((team) => team.team_type !== 'Outsource'));
    }
    if (filters.tasks) {
      setMyEvents(data.events);
    } else {
      setMyEvents(() => data.events.filter((event) => event.type !== 'task'));
    }
  }, [filters]);

  const handleValidation = () => {
    if (popupEventSite !== null && popupEventSite !== '') {
      setProjectError(false);
      return true;
    }
    setProjectError(true);
    return false;
  };

  const saveEvent = React.useCallback(() => {
    if (handleValidation()) {
      setLoader(true);
      const startDate = moment(popupEventDate[0]).format('YYYY-MM-DD');
      const endDate = moment(popupEventDate[1]).format('YYYY-MM-DD');
      const newEvent = {
        title: popupEventTitle,
        start: startDate,
        end: endDate,
        site_id: popupEventSite,
        employee_id: checkedResources,
      };
      createNewEvent(newEvent).then((res) => {
        listAllEvents().then((data) => {
          setLoader(false);
          setMyEvents(data);
        });
      });

      setMyEvents([...myEvents]);

      // close the popup
      setOpen(false);
    }
  }, [isEdit, myEvents, popupEventDate, popupEventColor, popupEventTitle, popupEventSite, tempEvent, checkedResources]);

  const renderMyResource = (resource) => {
    const parent = resource.children;
    return (
      <Typography
        variant="body2"
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: parent ? '#1dab2f' : '' }}
      >
        {resource.name}
        {!parent && <Rating rating={resource.rating}>{resource.rating}</Rating>}{' '}
        {resource.team_type && (
          <Rating rating={resource.rating}>
            {resource.team_type === 'InHome' ? (
              <Iconify icon="material-symbols:home-outline-rounded" width={15} height={15} />
            ) : (
              <Iconify icon="material-symbols:handshake-outline" width={15} height={15} />
            )}
          </Rating>
        )}
      </Typography>
    );
  };

  const loadPopupForm = React.useCallback((event) => {
    try {
      let startDate = new Date(event.start);
      let endDate = new Date(event.end);
      startDate = moment(startDate).format('YYYY-MM-DD');
      endDate = moment(endDate).format('YYYY-MM-DD');
      setTitle(event.title);
      setSite(event.location);
      setColor(event.color);
      setDate([startDate, endDate]);
      setCheckedResources(event.resource);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // handle popup form changes

  const dateChange = React.useCallback((args) => {
    setDate(args.value);
  }, []);

  const onDeleteClick = React.useCallback(() => {
    setLoader(true);
    deleteEvent(tempEvent.id).then((res) => {
      listAllEvents().then((data) => {
        setLoader(false);
        setMyEvents(data);
      });
    });

    setOpen(false);
  }, [deleteEvent, tempEvent]);

  // scheduler options

  const onSelectedDateChange = React.useCallback((event) => {
    setSelectedDate(event.date);
  }, []);

  const onEventClick = React.useCallback(
    (args) => {
      setEdit(true);

      setTempEvent({ ...args.event });
      // fill popup form with event data
      loadPopupForm(args.event);
      setAnchor(args.domEvent.target);
      setOpen(true);
    },
    [loadPopupForm]
  );

  const onEventCreated = React.useCallback(
    (args) => {
      setEdit(false);
      setTempEvent(args.event);
      // fill popup form with event data
      if (args.event.resource !== 'day') {
        loadPopupForm(args.event);
        setOpen(true);
      } else {
        loadPopupForm(args.event);
      }
      setAnchor(args.target);
      // open the popup
    },
    [loadPopupForm]
  );

  const onEventDeleted = React.useCallback(
    (args) => {
      deleteEvent(args.event);
    },
    [deleteEvent]
  );

  // popup options
  const headerText = React.useMemo(() => (isEdit ? 'View work order' : 'New work order'), [isEdit]);
  const popupButtons = React.useMemo(() => {
    if (isEdit) {
      return ['cancel'];
    }

    return [
      'cancel',
      {
        handler: () => {
          saveEvent();
        },
        keyCode: 'enter',
        text: 'Add',
        cssClass: 'mbsc-popup-button-primary',
      },
    ];
  }, [isEdit, saveEvent]);

  const onClose = React.useCallback(() => {
    if (!isEdit) {
      // refresh the list, if add popup was canceled, to remove the temporary event
      setMyEvents([...myEvents]);
    }
    setOpen(false);
  }, [isEdit, myEvents]);

  const extendDefaultEvent = React.useCallback((args) => {
    return {
      title: 'Work order',
      location: '',
    };
  }, []);

  async function onPageLoading(event, inst) {
    const start = new Date(event.firstDay);
    const end = new Date(event.lastDay);
    const data = await getHolidays(start, end);
    if (data) setHolidays((prev) => [...defaultHolidays, ...data]);
  }
  const renderHeader = () => {
    return (
      <>
        <Stack
          sx={{ color: 'black' }}
          variant
          component="subtitle1"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 0, minWidth: 0 }}>
            <CalendarPrev className="cal-header-prev" />
          </MuiButton>
          <CalendarNav className="cal-header-nav" />
          <MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 0, minWidth: 0 }}>
            <CalendarNext className="cal-header-next" />
          </MuiButton>
        </Stack>
      </>
    );
  };
  const renderScheduleEvent = (event) => {
    return (
      <div className="timeline-event" style={{ background: color(event.original.type) }}>
        {['overtime', 'restDayMove', 'nightTime'].includes(event.original.type) ? '' : event.title}
      </div>
    );
  };

  const orderMyEvents = React.useCallback((event) => {
    return event.accepted ? 1 : -1;
  }, []);
  const renderCustomDay = (args) => {
    const date = args.date;
    let eventOccurrence = 'none';

    if (args.events) {
      const eventNr = args.events.length;
      if (eventNr === 0) {
        eventOccurrence = 'none';
      } else if (eventNr === 1) {
        eventOccurrence = 'one';
      } else if (eventNr < 4) {
        eventOccurrence = 'few';
      } else {
        eventOccurrence = 'more';
      }
    }

    return (
      <div>
        <div className="md-date-header-day-name">{formatDate('DDD', date)}</div>
      </div>
    );
  };
  return (
    <Page title="Travel expenses">
      <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'absolute', top: '24px', right: '40px' }}>
        <Filters filters={filters} />
        <MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 1, minWidth: 0 }}>
          <Iconify icon="heroicons-outline:document-text" width={20} height={20} />
        </MuiButton>
        <MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 1, minWidth: 0 }}>
          <Iconify icon="material-symbols:download-rounded" width={20} height={20} />
        </MuiButton>
        <MuiButton
          startIcon={<Iconify icon="tabler:checkbox" width={20} height={20} />}
          size="small"
          variant="outlined"
          color="inherit"
          sx={{ padding: '8px 24px', minWidth: 0 }}
        >
          Pending
        </MuiButton>
      </Stack>
      <Box marginLeft={3} marginRight={3} sx={{ boxShadow: (theme) => theme.customShadows.z8 }}>
        <Drawer />
        <Loader open={loader} setOpen={setLoader} />
        <Eventcalendar
          cssClass="mbsc-calendar-projects"
          view={viewSettings}
          data={myEvents}
          invalid={invalid}
          displayTimezone="local"
          dataTimezone="local"
          onPageLoading={onPageLoading}
          renderResource={renderMyResource}
          renderScheduleEvent={renderScheduleEvent}
          renderHeader={renderHeader}
          renderDay={renderCustomDay}
          resources={myResources}
          clickToCreate="double"
          dragToCreate={true}
          dragTimeStep={30}
          selectedDate={mySelectedDate}
          onSelectedDateChange={onSelectedDateChange}
          onEventClick={onEventClick}
          onEventCreated={onEventCreated}
          onEventDeleted={onEventDeleted}
          extendDefaultEvent={extendDefaultEvent}
          eventOrder={orderMyEvents}
          colors={holidays}
          dayNamesShort={['', '', '', '', '', '', '']}
        />
        <Popup
          display="bottom"
          fullScreen={true}
          contentPadding={false}
          headerText={headerText}
          anchor={anchor}
          buttons={popupButtons}
          isOpen={isOpen}
          onClose={onClose}
          responsive={responsivePopup}
        >
          <div className="mbsc-form-group">
            <Input ref={startRef} label="Starts" />
            <Input ref={endRef} label="Ends" />
            <Datepicker
              readOnly={isEdit}
              select="range"
              controls={['date']}
              touchUi={true}
              startInput={start}
              endInput={end}
              showRangeLabels={false}
              onChange={dateChange}
              value={popupEventDate}
            />
          </div>

          <div className="mbsc-form-group">
            {isEdit && (
              <div className="mbsc-button-group">
                <Button className="mbsc-button-block" color="danger" variant="outline" onClick={onDeleteClick}>
                  Delete event
                </Button>
              </div>
            )}
          </div>
        </Popup>
      </Box>
    </Page>
  );
}

export default App;

const color = (type) => {
  switch (type) {
    case 'lodging':
      return '#FFA58D';
    case 'meals':
      return '#85CDB7';
    case 'task':
      return '#BDB2E9';
    case 'overtime':
      return '#DA4C57';
    case 'nightTime':
      return '#8FA429';
    case 'restDayMove':
      return '#A3888C';
    case 'blockedDays':
      return '#919EAB';

    default:
      return '#919EAB';
  }
};
