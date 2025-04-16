import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Scheduler, SchedulerPro, ResourceStore } from '@bryntum/schedulerpro';
import './Calender2.css';
import '@bryntum/schedulerpro/schedulerpro.stockholm.css';

import {
    listAllTasksByProject2,
} from 'supabase'

import { customMonthViewPreset, resources } from './SchedulerConfig';

const Calender2 = () => {
    const schedulerRef = useRef(null);

    const { id } = useParams()
    const { data: groupedTasks, isLoading, error } = useQuery(
        ['tasks', id], () =>  listAllTasksByProject2(id),
        {
            select: (data) => {
                const task_groups = {
                    1: 'metal_fittings',
                    2: 'installations',
                    3: 'connections',
                    4: 'completion_test'
                };
                const grouped = {
                    metal_fittings: [],
                    installations: [],
                    connections: [],
                    completion_test: [],
                };
                console.log(data)
                data.data?.forEach(task => {
                    const groupId = task.task_group_id;
                    if (groupId !== null && task_groups[groupId]) {
                        grouped[task_groups[groupId]].push(task);
                    }
                });
                console.log('groupedTasks', grouped)
                return grouped;
            }
        }
    );
    const events = React.useMemo(() => {
        if (!groupedTasks) return [];
        const { connections, installations, metal_fittings, completion_test } = groupedTasks;
        return [
            ...connections.map((connection, index) => ({
                id: connection.id || `connection-${index + 1}`,
                resourceId: 'connection',
                startDate: connection.start_date? new Date(connection.start_date).toISOString() : new Date().toISOString(),
                endDate: connection.end_date ? new Date(connection.end_date).toISOString() : (() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 3);
                    return today.toISOString();
                })(),
                name: connection.title
            })),
            ...installations.map((installation, index) => ({
                id: installation.id,
                resourceId: 'installation',
                startDate: installation.start_date ? new Date(installation.start_date).toISOString() : new Date().toISOString(),
                endDate: installation.end_date ? new Date(installation.end_date).toISOString() : (() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 3);
                    return today.toISOString();
                })(),
                name: installation.title,
            })),
            ...metal_fittings.map((metal_fitting, index) => ({
                id: metal_fitting.id || `metal_fitting-${index + 1}`,
                resourceId: 'metal_fittings',
                startDate: metal_fitting.start_date ? new Date(metal_fitting.start).toISOString() : new Date().toISOString(),
                endDate: metal_fitting.end_date ? new Date(metal_fitting.end).toISOString() : (() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 3);
                    return today.toISOString();
                })(),
                name: metal_fitting.title || `Metal Fitting + ${index + 1}`,
            })),
            ...completion_test.map((completion_test, index) => ({
                id: completion_test.id || `completion_test-${index + 1}`,
                resourceId: 'completion_test',
                startDate: completion_test.start_date ? new Date(completion_test.start).toISOString() : new Date().toISOString(),
                endDate: completion_test.end ? new Date(completion_test.end).toISOString() : (() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 3);
                    return today.toISOString();
                })(),
                name: completion_test.title || `Completion Test + ${index + 1}`,
            })),
        ];
    }, [groupedTasks]);
    console.log('events', events);
    useEffect(() => {
        if (!schedulerRef.current) return;
        const scheduler = new SchedulerPro({
            appendTo: schedulerRef.current,
            autoHeight: true,
            width: '100%',
            startDate: new Date(2025, 3, 4),
            endDate: new Date(2025, 3, 30),
            viewPreset: customMonthViewPreset,
            columns: [
                { text: 'Work / Team', field: 'name', width: 200 },
            ],
            resources,
            events,
                    // onAfterEventSave: (data) => {
                    //     console.log('after event saved:', data);
                    // },
                    // onEventCreated: (data) => {
                    //     console.log('Event created:', data);
                    // },
                    // onAfterEventEdit: (data) => {
                    //     console.log('after event edited:', data);
                    // },
            eventRenderer({ eventRecord }) {
                return `<div class="custom-event">${eventRecord.name}</div>`;
            },
            features: {
                eventTooltip: true,
                timeRanges: true,
                columnLines: true,
            }
        });
        return () => scheduler.destroy();
    }, [events]);
    // useEffect(() => {
    //     console.log('1')
    //     let scheduler;
    //     const fetchTasks = async () => {
    //             const data = await getTasks()
    //             console.log('data', data)
    //         // setTasks(data)
    //         console.log('2')
    //         const connections = data?.connections || [];
    //         const installations = data?.installations || [];
    //         const metal_fittings = data?.metal_fittings || [];
    //         const completion_test = data?.completion_test || [];
    //         const events = [
    //             ...connections.map((connection, index) => ({
    //                 id: connection.id || `connection-${index + 1}`,
    //                 resourceId: 'connection',
    //                 startDate: connection.task_period[0],
    //                 endDate: connection.task_period[1],
    //                 name: connection.title
    //             })),
    //             ...installations.map((installation, index) => ({
    //                 id: installation.id,
    //                 resourceId: 'installation', // Fixed resourceId for installations
    //                 startDate: installation.task_period[0],
    //                 endDate: installation.task_period[1],
    //                 name: installation.title,
    //             })),
    //             ...metal_fittings.map((metal_fitting, index) => ({
    //                 id: metal_fitting.id || `metal_fitting-${index + 1}`,
    //                 resourceId: 'metal_fittings', // Fixed resourceId for metal fittings
    //                 startDate: metal_fitting.start !== null ? new Date(metal_fitting.start).toISOString() : new Date().toISOString(), // Format the current date in ISO 8601
    //                 endDate: metal_fitting.end !== null ? new Date(metal_fitting.end).toISOString() : (() => {
    //                     const today = new Date();
    //                     today.setDate(today.getDate() + 3); // Add 3 days to today's date
    //                     return today.toISOString(); // Format the date in ISO 8601
    //                 })(),
    //                 name: metal_fitting.title || `Metal Fitting + ${index + 1}`,
    //             })),
    //             ...completion_test.map((completion_test, index) => ({
    //                 id: completion_test.id || `completion_test-${index + 1}`,
    //                 resourceId: 'completion_test', // Fixed resourceId for completion test
    //                 startDate: completion_test.start !== null ? new Date(completion_test.start).toISOString() : new Date().toISOString(),
    //                 endDate: completion_test.end !== null
    //                     ? new Date(completion_test.end).toISOString()
    //                     : (() => {
    //                         const today = new Date();
    //                         today.setDate(today.getDate() + 3); // Add 3 days to today's date
    //                         return today.toISOString(); // Format the date in ISO 8601
    //                     })(),
    //                 name: completion_test.title || `Completion Test + ${index + 1}`,
    //             })),
    //         ];
    //         // setEvents(events)
    //         console.log('events', events)
    //         console.log('3')
    //         // console.log('groupedTasksData', groupedTasksData())
    //         if (!schedulerRef.current || events.length === 0) return;
    //     // Check if objs is defined and has the expected structure
        
    //         // approval_status
    //         // :
    //         // "Planned"
    //         // created_at
    //         // :
    //         // "2025-04-16T07:24:17.019+00:00"
    //         // end_date
    //         // :
    //         // "2025-04-17"
    //         // from_page
    //         // :
    //         // "projects"
    //         // id
    //         // :
    //         // 419
    //         // notes
    //         // :
    //         // ""
    //         // project
    //         // :
    //         // 26
    //         // project_diagram_id
    //         // :
    //         // 654
    //         // start_date
    //         // :
    //         // "2025-04-16"
    //         // task_group_id
    //         // :
    //         // 3
    //         // task_type
    //         // :
    //         // null
    //         // title
    //         // :
    //         // "#mh1"

    //     console.log('events', events)
    //     scheduler = new SchedulerPro({
    //         appendTo: schedulerRef.current,
    //         autoHeight: true,
    //         width: '100%',
    //         startDate: new Date(2025, 3, 4),
    //         endDate: new Date(2025, 3, 30),
    //         viewPreset: customMonthViewPreset,
    //         columns: [
    //             { text: 'Work / Team', field: 'name', width: 200},
    //         ],
    //         resources,
    //         listeners: {
                
    //         },
    //         onAfterEventSave: (data) => {
    //             console.log('after event saved:', data);
    //         },
    //         onEventCreated: (data) => {
    //             console.log('Event created:', data);
    //         },
    //         onAfterEventEdit: (data) => {
    //             console.log('after event edited:', data);
    //         },
    //         // events,
    //         eventRenderer({ eventRecord }) {
    //             return `<div class="custom-event">${eventRecord.name}</div>`;
    //         },
    //         features: {
    //             eventTooltip: true, // Enable tooltips for events
    //             timeRanges: true, // Highlight weekends or specific ranges,
    //             columnLines: true, // Show column lines
    //         }
    //     });
    //     scheduler.events = events; // Set the events data
    //     scheduler.onEventCreated(({ eventRecord }) => {
    //         const formattedData = {
    //             id: eventRecord.id,
    //             resourceId: eventRecord.resourceId,
    //             startDate: eventRecord.startDate,
    //             endDate: eventRecord.endDate,
    //             name: eventRecord.name,
    //         };
    //         // Send the formatted data to your backend
    //         console.log('Event created with event:', formattedData);
    //         // sendDataToBackend('create', formattedData);
    //     });
    //     scheduler.on('afterEventSave', ({ eventRecord }) => {
    //         const formattedData = {
    //             id: eventRecord.id,
    //             resourceId: eventRecord.resourceId,
    //             startDate: eventRecord.startDate,
    //             endDate: eventRecord.endDate,
    //             name: eventRecord.name,
    //         };
    //         // Send the formatted data to your backend
    //         console.log('Event saved  wit h event:', formattedData);
    //         // sendDataToBackend('update', formattedData);
    //     });
        
    //     const { eventStore } = scheduler;
    //     eventStore.on('add', ({ records }) => {
    //         records.forEach((record) => {
    //             const { startDate, endDate } = record;
    //             console.log(`Event added: ${record.name}, Start: ${startDate}, End: ${endDate}`);
    //         });
    //     });
    //     eventStore.on('update', ({ record, changes }) => {
    //         const updatedData = {
    //             id: record.id,
    //             ...changes, // Contains the fields that were changed
    //         };
    //         console.log(`Event updated: ${record.name}`, updatedData);
    //         // Send the updated data to your backend
    //         // sendDataToBackend('update', updatedData);
    //     });
        
    //     // Listener for event deletions
    //     eventStore.on('remove', ({ records }) => {
    //         records.forEach(event => {
    //             console.log(`Event deleted: ${event.name}`);
    //             // Inform the backend about the deletion
    //             // sendDataToBackend('delete', { id: event.id });
    //         });
    //     });
    //     }
    //     fetchTasks()
    //     return () => {
    //         if (scheduler) scheduler.destroy();
    //     };
    // }, [tasks, schedulerRef]);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading tasks</div>;
    return <div ref={schedulerRef} style={{ height: '500px', width: '100%' }} />;
};

export default Calender2;
