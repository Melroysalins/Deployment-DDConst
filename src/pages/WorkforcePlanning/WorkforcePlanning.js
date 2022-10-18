import React, { useCallback } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
import {
  Eventcalendar,
  setOptions,
  Popup,
  Button,
  Input,
  Textarea,
  Checkbox,
  Datepicker,
  snackbar,
  Select,
  momentTimezone,
} from '@mobiscroll/react';
import moment from 'moment-timezone';
import './calendar.scss';

import { Loader } from 'reusables';

import { getEmployees, getAllEvents, getAllProjects, createNewProject, createNewEvent, deleteEvent } from './api';
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

function App() {
  const [myEvents, setMyEvents] = React.useState([]);
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
  const [myResources, setMyResources] = React.useState([]);
  const [invalid, setInvalid] = React.useState([
    {
      recurring: {
        repeat: 'daily',
      },
      resource: [],
    },
  ]);
  const [projectSites, setProjectSites] = React.useState([]);
  const [addNewProject, setAddNewProject] = React.useState(false);
  const [newProjectDetails, setNewProjectDetails] = React.useState({ location: '', color: '#ababab' });
  const [loader, setLoader] = React.useState(false);
  const [projectError, setProjectError] = React.useState(false);
  const [holidays, setHolidays] = React.useState(defaultHolidays);

  React.useEffect(() => {
    (async function () {
      setLoader(true);
      getEmployees().then((data) => {
        const resource = data.map((item) => item.id);
        setInvalid((prev) => {
          return [
            {
              recurring: {
                repeat: 'daily',
              },
              resource,
            },
          ];
        });
        setMyResources(data);
      });
      getAllEvents().then((data) => setMyEvents(data));
      getAllProjects().then((data) => {
        setLoader(false);
        setProjectSites(data);
      });
    })();
    return () => {};
  }, []);

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
        getAllEvents().then((data) => {
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
      <div className={parent ? 'md-shift-resource' : ''} style={{ color: parent ? '#1dab2f' : '' }}>
        {resource.name}
      </div>
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
      getAllEvents().then((data) => {
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
      loadPopupForm(args.event);
      setAnchor(args.target);
      // open the popup
      setOpen(true);
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

  const saveNewProject = () => {
    setLoader(true);
    createNewProject(newProjectDetails).then((res) => {
      getAllProjects().then((data) => {
        setProjectSites(data);
        setLoader(false);
      });
    });
    onCloseNewProject();
  };

  const popupButtonsNewProject = React.useMemo(() => {
    return [
      'cancel',
      {
        handler: () => {
          saveNewProject();
        },
        keyCode: 'enter',
        text: 'Add',
        cssClass: 'mbsc-popup-button-primary',
      },
    ];
  }, [saveEvent, newProjectDetails]);

  const onClose = React.useCallback(() => {
    if (!isEdit) {
      // refresh the list, if add popup was canceled, to remove the temporary event
      setMyEvents([...myEvents]);
    }
    setOpen(false);
  }, [isEdit, myEvents]);

  const onCloseNewProject = React.useCallback(() => {
    setAddNewProject(false);
  }, []);

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

  return (
    <>
      <Loader open={loader} setOpen={setLoader} />
      <Eventcalendar
        view={viewSettings}
        data={myEvents}
        invalid={invalid}
        displayTimezone="local"
        dataTimezone="local"
        onPageLoading={onPageLoading}
        renderResource={renderMyResource}
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
        colors={holidays}
      />
      <Popup
        display="bottom"
        fullScreen={false}
        contentPadding={false}
        headerText={'Add New Project'}
        buttons={popupButtonsNewProject}
        isOpen={addNewProject}
        onClose={onCloseNewProject}
        responsive={responsivePopup}
      >
        <div className="mbsc-form-group">
          <Input
            value={newProjectDetails?.location}
            onChange={(e) => {
              setNewProjectDetails((prev) => {
                return { ...prev, location: e.target.value };
              });
            }}
            label="Site name"
          />
          Color:{' '}
          <input
            value={newProjectDetails?.color}
            onChange={(e) => {
              setNewProjectDetails((prev) => {
                return { ...prev, color: e.target.value };
              });
            }}
            type="color"
            name=""
            id=""
          />
        </div>
      </Popup>
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
          <Select
            readOnly={isEdit}
            onChange={(e) => {
              setTitle(e.valueText);
              setSite(e.value);
            }}
            value={popupEventSite}
            data={projectSites}
            touchUi={false}
            label="Project Site"
            labelStyle="floating"
            error={projectError}
            errorMessage={'Please select a project'}
          />
          <Button
            onClick={() => {
              setAddNewProject(true);
            }}
            startIcon="plus"
          >
            Add new Project
          </Button>
        </div>
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
    </>
  );
}

export default App;
