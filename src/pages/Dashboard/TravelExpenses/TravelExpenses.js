import React from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import {
  Eventcalendar,
  setOptions,
  Popup,
  Button,
  Input,
  formatDate,
  Checkbox,
  Datepicker,
  snackbar,
  Select,
  momentTimezone,
} from '@mobiscroll/react';
import moment from 'moment-timezone';
import { styled } from '@mui/material/styles';
import { Avatar, Typography, Box } from '@mui/material';
import Drawer from './Drawer';
import './calendar.scss';

import { Loader } from 'reusables';

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
      color = theme.palette.chart.blue[0];
      break;
  }
  return {
    height: 16,
    width: 16,
    fontSize: 11,
    marginLeft: 11,
    backgroundColor: color,
  };
});

function App() {
  const [myEvents, setMyEvents] = React.useState(data.events);
  const [tempEvent, setTempEvent] = React.useState(null);
  const [isOpen, setOpen] = React.useState(false);
  const [addNewTravelOtEvent, setaddNewTravelOtEvent] = React.useState(false);
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
  const [projectSites, setProjectSites] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [projectError, setProjectError] = React.useState(false);
  const [holidays, setHolidays] = React.useState(defaultHolidays);

  // React.useEffect(() => {
  //   (async function () {
  //     getEmployees().then((data) => {
  //       const resource = data.map((item) => item.id);
  //       setInvalid((prev) => {
  //         return [
  //           {
  //             recurring: {
  //               repeat: 'daily',
  //             },
  //             resource,
  //           },
  //         ];
  //       });
  //       setMyResources(data);
  //     });
  //     listAllEvents().then((data) => setMyEvents(data));
  //     // console.log(listAllEvents());
  //     // setMyEvents(listAllEvents())
  //   })();
  //   return () => {};
  // }, []);

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
        className={parent ? 'md-shift-resource' : ''}
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: parent ? '#1dab2f' : '' }}
      >
        {resource.name} {!parent && <Rating rating={resource.rating}>{resource.rating}</Rating>}
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
      console.log(args.event);
      if (args.event.resource !== 'day') {
        loadPopupForm(args.event);
        setOpen(true);
      } else {
        loadPopupForm(args.event);
        setaddNewTravelOtEvent(true);
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
    setaddNewTravelOtEvent(false);
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

  const renderScheduleEvent = (event) => {
    console.log(event);
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
        <div className="md-date-header-day-nr">{formatDate('DD', date)}</div>
      </div>
    );
  };
  return (
    <Box>
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
