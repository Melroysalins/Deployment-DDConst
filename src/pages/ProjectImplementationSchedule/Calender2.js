import React, { useEffect, useRef } from 'react';
import { Scheduler, SchedulerPro, ResourceStore } from '@bryntum/schedulerpro';
import './Calender2.css';
import '@bryntum/schedulerpro/schedulerpro.stockholm.css';
import useMain from 'pages/context/context'
import { customMonthViewPreset, resources } from './SchedulerConfig';

const Calender2 = () => {
    const schedulerRef = useRef(null);
    const { objs, setObjs } = useMain()

    useEffect(() => {
        if (!schedulerRef.current) return; // Ensure the ref is set before proceeding
        // Check if objs is defined and has the expected structure
        const connections = objs?.[0]?.currentObj?.connections || []; // Fallback to an empty array if no data
        const installations = objs?.[0]?.currentObj?.installations || []; // 
        const events = [
            ...connections.map((connection, index) => ({
                id: connection.id || `connection-${index + 1}`,
                resourceId: 'connection',
                startDate: connection.task_period[0],
                endDate: connection.task_period[1] ,
                name: connection.title
            })),
            ...installations.map((installation, index) => ({
                id: installation.id ,
                resourceId: 'installation', // Fixed resourceId for installations
                startDate: installation.task_period[0] ,
                endDate: installation.task_period[1] ,
                name: installation.title ,
            }))
        ];

        console.log('events', events)
        const scheduler = new SchedulerPro({
            appendTo: schedulerRef.current,
            autoHeight: true,
            width: '100%',
            startDate: new Date(2025, 3, 4),
            endDate: new Date(2025, 3, 30),
            viewPreset: customMonthViewPreset,
            columns: [
                { text: 'Work / Team', field: 'name', width: 200},
            ],
            resources,
            listeners: {
                
            },
            onAfterEventSave: (data) => {
                console.log('after event saved:', data);
            },
            onEventCreated: (data) => {
                console.log('Event created:', data);
            },
            onAfterEventEdit: (data) => {
                console.log('after event edited:', data);
            },
            // events,
            eventRenderer({ eventRecord }) {
                return `<div class="custom-event">${eventRecord.name}</div>`;
            },
            features: {
                eventTooltip: true, // Enable tooltips for events
                timeRanges: true, // Highlight weekends or specific ranges,
                columnLines: true, // Show column lines
            }
        });
        scheduler.events = events; // Set the events data
        scheduler.onEventCreated(({ eventRecord }) => {
            const formattedData = {
                id: eventRecord.id,
                resourceId: eventRecord.resourceId,
                startDate: eventRecord.startDate,
                endDate: eventRecord.endDate,
                name: eventRecord.name,
            };
            // Send the formatted data to your backend
            console.log('Event created with event:', formattedData);
            // sendDataToBackend('create', formattedData);
        });
        scheduler.on('afterEventSave', ({ eventRecord }) => {
            const formattedData = {
                id: eventRecord.id,
                resourceId: eventRecord.resourceId,
                startDate: eventRecord.startDate,
                endDate: eventRecord.endDate,
                name: eventRecord.name,
            };
            // Send the formatted data to your backend
            console.log('Event saved  wit h event:', formattedData);
            // sendDataToBackend('update', formattedData);
        });

        const { eventStore } = scheduler;
        eventStore.on('add', ({ records }) => {
            records.forEach((record) => {
                const { startDate, endDate } = record;
                console.log(`Event added: ${record.name}, Start: ${startDate}, End: ${endDate}`);
            });
        });
        eventStore.on('update', ({ record, changes }) => {
            const updatedData = {
                id: record.id,
                ...changes, // Contains the fields that were changed
            };
            console.log(`Event updated: ${record.name}`, updatedData);
            // Send the updated data to your backend
            // sendDataToBackend('update', updatedData);
        });

        // Listener for event deletions
        eventStore.on('remove', ({ records }) => {
            records.forEach(event => {
                console.log(`Event deleted: ${event.name}`);
                // Inform the backend about the deletion
                // sendDataToBackend('delete', { id: event.id });
            });
        });
        return () => {
            scheduler.destroy();
        };
    }, [objs]);

    return <div ref={schedulerRef} style={{ height: '500px', width: '100%' }} />;
};

export default Calender2;
