import React from 'react';
import useTE from './context/context';
import { TEActionType } from './context/types';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import {
  Eventcalendar,
  setOptions,
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
import { Avatar, Typography, Box, Stack, Button as MuiButton, Tooltip } from '@mui/material';

import './calendar.scss';

// components
import AddFormPopup from './popups/AddFormPopup';
import ViewEventPopup from './popups/ViewEventPopup';
import Popup from 'components/Popups/Popup';
import Iconify from 'components/Iconify';
import { Loader } from 'reusables';
import Drawer from './Drawer';
import { listAllEvents, subscribeEvent, deleteEvent } from 'supabase/events';
import data from './data.json';
import getHolidays from './getHolidays';
import { getTeResources } from 'supabase/travelExpenses';

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

const defaultHolidays = [
  { background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SU' } },
  { background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SA' } },
];

export const Rating = styled(Avatar, {
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

export default function Timeline() {
  const { state, dispatch } = useTE();

  const [tempEvent, setTempEvent] = React.useState(null);
  const [isOpen, setOpen] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [anchor, setAnchor] = React.useState(null);
  const [start, startRef] = React.useState(null);
  const [end, endRef] = React.useState(null);
  const [popupData, setPopupData] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [employees, setEmployees] = React.useState([]);
  const [popupEventColor, setColor] = React.useState('');
  const [popupEventDate, setDate] = React.useState([]);
  const [mySelectedDate, setSelectedDate] = React.useState(new Date());
  const [checkedResources, setCheckedResources] = React.useState([]);
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
  const [open, setOpenActions] = React.useState(false);

  const [openPopup, setOpenPopup] = React.useState(null);
  const [popupType, setPopupType] = React.useState(null);
  const [viewPopup, setViewPopup] = React.useState(null);

  const handlePopupTypeChange = React.useCallback((title) => setPopupType(title), []);

  const onClose = React.useCallback(() => {
    if (!isEdit) {
      // refresh the list, if add popup was canceled, to remove the temporary event
      dispatch({ type: TEActionType.UPDATE_EVENTS, payload: [...state.events] });
    }
    setAnchor(null);
  }, [isEdit, state.events, state.resources]);

  const handleOpenViewPopup = React.useCallback(
    (anchor) => {
      setViewPopup(anchor);
    },
    [onClose]
  );

  const handleCloseViewPopup = React.useCallback(() => {
    setViewPopup(null);
  }, [onClose]);

  const handleClosePopup = React.useCallback(() => {
    setOpenPopup(null);
    onClose();
  }, [onClose]);

  const handleOpenPopup = React.useCallback((anchor) => {
    setOpenPopup(anchor);
    setAnchor(null);
  }, []);

  const handleToggle = () => setOpenActions((prev) => !prev);

  const updateCalendarData = React.useCallback((resources, events) => {
    const teamEvents = [];
    let employees = [];

    const updatedResources = resources.map((project) => ({
      ...project,
      id: String(project.id),
      children: project.children.map((team) => {
        const teamEmployees = [];
        const updatedEmployees =
          team?.children?.map((employee) => {
            teamEmployees.push({ id: String(employee.id), name: employee.name });
            return {
              ...employee,
              id: String(employee.id),
              children: travelExpensesForEmployee(employee.id),
              collapsed: true,
            };
          }) ?? [];
        teamEvents.push({
          title: `EMPLOYEES: ${teamEmployees.map((x) => x.name).join(', ')}`,
          resource: String(team.id),
          start: team.start,
          end: team.end,
        });
        employees = [...employees, ...teamEmployees];
        return {
          ...team,
          children: updatedEmployees,
        };
      }),
    }));

    setEmployees(employees);

    const updatedEvents = events.map((event) =>
      event.type === 'te' || event.sub_type === 'task'
        ? { ...event, resource: `${event.employee}-${event.sub_type}` }
        : { ...event, resource: event.employee }
    );
    return { resources: updatedResources, events: [...updatedEvents, ...teamEvents] };
  }, []);

  // for handling calendar data to create one more layer with expenses of meals, lodging, task
  const fetchData = async () => {
    // setLoading(true);
    // const res = await getProjectDetails(id);
    const resources = await getTeResources();
    const events = await listAllEvents();
    const res = updateCalendarData(resources, events);
    dispatch({ type: TEActionType.UPDATE_RESOURCES, payload: res.resources });
    dispatch({ type: TEActionType.UPDATE_EVENTS, payload: res.events });
  };

  const fetchEvents = async () => {
    const events = await listAllEvents();
    const res = updateCalendarData(state.resources, events);
    dispatch({ type: TEActionType.UPDATE_EVENTS, payload: res.events });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (state.beep) {
      fetchEvents();
      dispatch({ type: TEActionType.BEEP, payload: false });
    }

    // const res = updateCalendarData(data.resources, data.events);
    // dispatch({ type: TEActionType.UPDATE_RESOURCES, payload: res.resources });
    // dispatch({ type: TEActionType.UPDATE_EVENTS, payload: res.events });
  }, [state.beep]);

  const travelExpensesForEmployee = React.useCallback(
    (employee_id) => [
      {
        id: `${employee_id}-lodging`,
        type: 'lodging',
      },
      {
        id: `${employee_id}-meals`,
        type: 'meals',
      },
      {
        id: `${employee_id}-task`,
        type: 'task',
      },
    ],
    []
  );

  const renderMyResource = (resource) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...(resource.depth === 3 && { justifyContent: 'flex-end' }),
        }}
      >
        {resource.name}
        {symbolsForResource(resource)}
      </Box>
    );
  };
  const styles = (keyword, bgColor) => {
    switch (keyword) {
      case 'Planned':
        return {
          background: (theme) => theme.palette.background.paper,
          borderRadius: '8px',
          border: `2px solid ${bgColor}`,
          color: `${bgColor} !important`,
        };

      case 'Rejected':
        return {
          background: `repeating-linear-gradient( -45deg, ${bgColor}, ${bgColor} 5px, #fff 5px, #fff 10px )`,
          minWidth: 0,
          fontSize: '10px',
          color: `${bgColor} !important`,
        };

      case 'Approved':
        return {
          borderRadius: '8px',
          border: `2px solid ${bgColor}`,
        };

      default:
        break;
    }
  };

  const renderScheduleEvent = (event) => {
    const bgColor = color(event.original.sub_type);
    const startDate = moment(event.startDate);
    const endDate = moment(event.endDate);
    const diff = endDate.diff(startDate, 'days');

    if (event.original.type === 'te' || event.original.type === 'task') {
      return (
        <>
          <Stack
            component="div"
            justifyContent="flex-between"
            className="timeline-event"
            sx={{
              background: bgColor,
              color: bgColor === '#fff' ? '#000 !important' : '#fff !important',
              boxShadow: (theme) => theme.customShadows.z8,
              justifyContent: 'flex-between',
              alignItems: 'initial !important',
              padding: '0 !important',
              ...styles(event.original.status, bgColor),
            }}
          >
            {event.original.status === 'Rejected' ? (
              <Typography
                variant="caption"
                sx={{ background: (theme) => theme.palette.background.paper, lineHeight: 'inherit' }}
              >
                {diff}하숙
              </Typography>
            ) : (
              <>{diff}하숙</>
            )}
          </Stack>
        </>
      );
    }

    return (
      <>
        <Box
          component="div"
          className="timeline-event"
          sx={{
            background: bgColor,
            color: bgColor === '#fff' ? '#000 !important' : '#fff !important',
            boxShadow: (theme) => theme.customShadows.z8,
          }}
        >
          {event.title}
        </Box>
      </>
    );
  };

  const symbolsForResource = React.useCallback((resource) => {
    switch (resource.depth) {
      case 0:
        return (
          <>
            <Stack direction="column">
              <Typography variant="caption">{resource.branchTitle}</Typography>
              <Typography variant="subtitle2">{resource.projectTitle}</Typography>
            </Stack>
          </>
        );
      case 1:
        return (
          <Rating rating={resource.rating}>
            {resource.team_type === 'InHome' ? (
              <Iconify icon="material-symbols:home-outline-rounded" width={15} height={15} />
            ) : (
              <Iconify icon="material-symbols:handshake-outline" width={15} height={15} />
            )}
          </Rating>
        );
      case 2:
        // if (resource.teamLead)
        //   return (
        //     <Typography
        //       variant="overline"
        //       sx={{
        //         background: '#FF6B00',
        //         boxShadow: (theme) => theme.customShadows.z8,
        //         borderRadius: '4px',
        //         padding: '0px 4px',
        //         color: '#fff',
        //         fontSize: '12px',
        //       }}
        //     >
        //       Team lead
        //     </Typography>
        //   );
        return <Rating rating={resource.rating}>{resource.rating}</Rating>;
      case 3:
        if (resource.type === 'lodging') {
          return (
            <Tooltip title="Lodging" arrow>
              <Iconify icon="icon-park-outline:double-bed" width={15} height={15} />
            </Tooltip>
          );
        }
        if (resource.type === 'meals') {
          return (
            <Tooltip title="Lodging" arrow>
              <Iconify icon="bxs:bowl-rice" width={15} height={15} />
            </Tooltip>
          );
        }
        return <Iconify icon="mdi:calendar-task-outline" width={15} height={15} />;
      default:
        break;
    }
  }, []);

  const renderCustomHeader = () => {
    return (
      <Stack width="100%" flexDirection="row" justifyContent="space-between">
        <Typography textAlign="center" variant="subtitle2">
          Project
        </Typography>
        <Stack flexDirection="row">
          {open && (
            <>
              <MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
                <Iconify icon="tabler:crane" width={20} height={20} />
              </MuiButton>
              <Tooltip title="Add travel expenses" arrow>
                <MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
                  <Iconify icon="lucide:calendar-check" width={20} height={20} />
                </MuiButton>
              </Tooltip>
              <Tooltip title="Add special travel expenses" arrow>
                <MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
                  <Iconify icon="tabler:plane-tilt" width={20} height={20} />
                </MuiButton>
              </Tooltip>
              <Tooltip title="Add overtime" arrow>
                <MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
                  <Iconify icon="mdi:auto-pay" width={20} height={20} />
                </MuiButton>
              </Tooltip>
            </>
          )}
          <MuiButton onClick={handleToggle} sx={{ minWidth: 0 }} size="small" color="inherit">
            <Iconify icon={`ic:baseline-${open ? 'minus' : 'plus'}`} width={20} height={20} />
          </MuiButton>
        </Stack>
      </Stack>
    );
  };

  const loadPopupForm = React.useCallback((event) => {
    try {
      console.log(event);
      let startDate = new Date(event.start);
      let endDate = new Date(event.end);
      startDate = moment(startDate).format('YYYY-MM-DD');
      endDate = moment(endDate).format('YYYY-MM-DD');
      const resource = String(event?.resource)?.split('-');
      const data = {
        start: startDate,
        end: endDate,
        employee: resource[0],
        sub_type: resource[1] ?? null,
        id: event.id,
        status: event.status,
      };
      setPopupData(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // scheduler options

  const onSelectedDateChange = React.useCallback((event) => {
    setSelectedDate(event.date);
  }, []);

  const onEventClick = React.useCallback(
    (args) => {
      try {
        setEdit(true);
        setTempEvent({ ...args.event });
        // fill popup form with event data
        loadPopupForm(args.event);
        const expense_type = String(args?.event?.resource)?.split('-');
        console.log(args);
        if (
          (expense_type.length > 1 && (expense_type[1] === 'lodging' || expense_type[1] === 'meals')) ||
          args.event.type === 'ste'
        ) {
          handlePopupTypeChange(args.event.type);
          handleOpenViewPopup(args.domEvent.target);
        } else {
          // setAnchor(args.target);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [loadPopupForm]
  );

  const onEventCreated = React.useCallback(
    (args) => {
      setEdit(false);
      setTempEvent(args.event);
      const expense_type = args.event.resource?.split('-');
      if (expense_type.length > 1 && expense_type[1] !== 'task') {
        handlePopupTypeChange('te');
        handleOpenPopup(args.target);
      } else {
        setAnchor(args.target);
      }
      // fill popup form with event data

      loadPopupForm(args.event);
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

  const extendDefaultEvent = React.useCallback((args) => {
    return {
      title: 'Add Expenses',
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
        <Stack sx={{ color: 'black' }} flexDirection="row" justifyContent="space-between" width="100%">
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
      <Stack p="10px" justifyContent="center" alignItems="center" className="">
        <Typography variant="body2" className="">
          {formatDate('DD', date)}
        </Typography>
        <Typography variant="caption" className="">
          {formatDate('DDD', date).substring(0, 1)}
        </Typography>
      </Stack>
    );
  };

  return (
    <>
      {popupType && (
        <AddFormPopup
          data={popupData}
          employees={employees}
          type={popupType}
          handleClose={handleClosePopup}
          anchor={openPopup}
        />
      )}
      {popupType && (
        <ViewEventPopup
          employees={employees}
          data={popupData}
          type={popupType}
          handleClose={handleCloseViewPopup}
          anchor={viewPopup}
        />
      )}

      <Loader open={loader} setOpen={setLoader} />
      <Eventcalendar
        cssClass="mbsc-calendar-projects md-timeline-height"
        view={viewSettings}
        data={state.events}
        invalid={invalid}
        displayTimezone="local"
        dataTimezone="local"
        onPageLoading={onPageLoading}
        renderResource={renderMyResource}
        renderScheduleEvent={renderScheduleEvent}
        renderHeader={renderHeader}
        renderResourceHeader={renderCustomHeader}
        resources={state.resources}
        clickToCreate="double"
        dragToCreate={true}
        dragTimeStep={30}
        selectedDate={mySelectedDate}
        onSelectedDateChange={onSelectedDateChange}
        onEventClick={onEventClick}
        onEventCreated={onEventCreated}
        onEventDeleted={onEventDeleted}
        extendDefaultEvent={extendDefaultEvent}
        renderDay={renderCustomDay}
        colors={holidays}
        dayNamesMin={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
      />
      <Popup variant="secondary" anchor={anchor} handleClose={onClose}>
        <Stack flexDirection="row" justifyContent="space-between" sx={{ p: 1 }}>
          <MuiButton
            onClick={() => {
              handlePopupTypeChange('ste');
              handleOpenPopup(anchor);
            }}
            startIcon={<Iconify icon="tabler:plane-tilt" width={15} height={15} />}
            size="small"
            color="inherit"
          >
            Add Overtime
          </MuiButton>
          <MuiButton
            onClick={() => {
              handlePopupTypeChange('te');
              handleOpenPopup(anchor);
            }}
            startIcon={<Iconify icon="mdi:auto-pay" width={15} height={15} />}
            size="small"
            color="inherit"
          >
            Add Travel Expenses
          </MuiButton>
        </Stack>
        {/* <div className="mbsc-form-group">
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
          </div> */}
      </Popup>
    </>
  );
}

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
      return '#fff';
  }
};
