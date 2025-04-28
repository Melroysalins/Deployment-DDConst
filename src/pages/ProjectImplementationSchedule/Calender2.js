import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Scheduler, SchedulerPro, ResourceStore, DependencyStore, DateHelper, ProjectModel, EventStore, PredecessorsTab, SuccessorsTab } from '@bryntum/schedulerpro';
import './Calender2.css';
import '@bryntum/schedulerpro/schedulerpro.stockholm.css';

import {
    createNewTasks,
    listAllTasksByProject2,
    updateTask,
    createTaskDependency,
    getAllTaskDependencyByProject,
} from 'supabase'

import { customMonthViewPreset, resources } from './SchedulerConfig';


const Calender2 = () => {
    const schedulerRef = useRef(null);
    const { id } = useParams()
    const { data, isLoading, error } = useQuery(
        ['projectData', id],
        async () => {
            const [tasks, dependencies] = await Promise.all([
                listAllTasksByProject2(id),
                getAllTaskDependencyByProject(id)
            ]);
            return { tasks, dependencies };
        }
    );
    // Group tasks as before
    const groupedTasks = React.useMemo(() => {
        if (!data?.tasks) return null;
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
        data.tasks.data?.forEach(task => {
            const groupId = task.task_group_id;
            if (groupId !== null && task_groups[groupId]) {
                grouped[task_groups[groupId]].push(task);
            }
        });
        return grouped;
    }, [data?.tasks]);

    // Use dependencies from the query result
    console.log('data', data)
    const dependencyTypeMap = {
        'StartToStart': 0,
        'StartToEnd': 1,
        'EndToStart': 2,
        'EndToEnd': 3
    }
    const dependencies = React.useMemo(() => {
        if (!data?.dependencies?.data) return [];
        return data.dependencies.data.map(dep => ({
            id: dep.id, 
            fromEvent: dep.from_task_id,
            toEvent: dep.to_task_id,
            type: dependencyTypeMap[dep.type] || 2, // default to Finish-to-Start(connection points)
            active: dep.active || true,
            lag: dep.lag || 0,
            lagUnit: dep.lag_unit || 'd',
        }));
    }, [data?.dependencies]);
    console.log('dependencies', dependencies)

    const events = React.useMemo(() => {
        if (!groupedTasks) return [];
        const { connections, installations, metal_fittings, completion_test } = groupedTasks;
        return [
            ...connections.map((connection, index) => ({
                id: connection.id || `connection-${index + 1}`,
                resourceId: 'connections',
                startDate: connection.start_date ? new Date(connection.start_date).toISOString() : new Date().toISOString(),
                endDate: connection.end_date ? new Date(connection.end_date).toISOString() : (() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 3);
                    return today.toISOString();
                })(),
                name: connection.title
            })),
            ...installations.map((installation, index) => ({
                id: installation.id,
                resourceId: 'installations',
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
                startDate: metal_fitting.start_date ? new Date(metal_fitting.start_date).toISOString() : new Date().toISOString(),
                endDate: metal_fitting.end_date ? new Date(metal_fitting.end_date).toISOString() : (() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 3);
                    return today.toISOString();
                })(),
                name: metal_fitting.title,
            })),
            ...completion_test.map((completion_test, index) => ({
                id: completion_test.id || `completion_test-${index + 1}`,
                resourceId: 'completion_test',
                startDate: completion_test.start_date ? new Date(completion_test.start_date).toISOString() : new Date().toISOString(),
                endDate: completion_test.end ? new Date(completion_test.end).toISOString() : (() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 3);
                    return today.toISOString();
                })(),
                name: completion_test.title || `Completion Test + ${index + 1}`,
            })),
        ];
    }, [groupedTasks]);

    const project = new ProjectModel({
        eventsData: [...events],
        resourcesData: resources,
        dependenciesData: dependencies,
    });
    useEffect(() => {
        if (!schedulerRef.current) return;
        const scheduler = new SchedulerPro({
            appendTo: schedulerRef.current,
            autoHeight: true,
            width: '100%',
            // startDate: new Date(2025, 3, 4),
            // endDate: new Date(2025, 3, 30),
            viewPreset: customMonthViewPreset,
            multiEventSelect: true,
            columns: [
                { text: 'Work / Team', field: 'name', width: 200 },
            ],
            // resources,
            // events,
            // dependencyStore,
            project,
            // onAfterEventSave: (data) => {
            //     console.log('after event saved:', data);
            // },
            // onEventCreated: (data) => {
            //     console.log('Event created:', data);
            // },
            // onAfterEventEdit: (data) => {
            //     console.log('after event edited:', data);
            // },
            listeners: {
                beforeDependencySave: (data) => {
                    console.log('Dependency save:', data);
                },
                afterDependencySave: (data) => {
                    console.log('Dependency saved:', data);
                },
                beforeDependencyDelete: (data) => {
                    console.log('Dependency delete:', data);
                },

                eventDragStart: (data) => {
                    console.log('Event drag started:', data);
                },
                eventDrop: (data) => {
                    console.log('Event drag ended:', data);
                },
                // eventDragAbort: (data) => {
                //     console.log('Event drag aborted:', data);
                // },
                eventResizeStart: ({ eventRecord }) => {
                    console.log('Event resize started:', eventRecord);
                },
                eventResizeEnd: ({ eventRecord }) => {
                    console.log('Event resize ended:', eventRecord);
                },
                eventDragSelect: ({ selectedEvents }) => {
                    console.log('Selected events:', selectedEvents.map(event => event.name));
                },
                eventCopyPaste: ({ copiedEvents }) => {
                    console.log('Copied events:', copiedEvents.map(event => event.name));
                },
                eventDelete: ({ eventRecord }) => {
                    console.log('Event deleted:', eventRecord.name);
                },
                eventEdit: ({ eventRecord }) => {
                    console.log('Event edited:', eventRecord.name);
                },
            },
            eventRenderer({ eventRecord }) {
                return `<div class="custom-event">${eventRecord.name}</div>`;
            },

            features: {
                // dependencies: true,
                dependencyEdit: true,
                eventDrag: {
                    constrainDragToTimeline: true,
                    showExactDropPosition: true,
                    constrainDragToResource: true // <-- Only allow dragging within the same row/resource
                },
                eventResize: true,
                // Add event drag selection feature
                eventDragSelect: {
                    disabled: false,  
                    showTooltip: true // Show tooltip with selected events count
                },
                eventCopyPaste: {
                    disabled: false
                },
                dependencies: {
                    allowDependencyCreation: true
                },
                // taskEdit: {
                //     items: {
                //             // SuccessorsTab: true,
                //         // PredecessorsTab: true,
                //         predecessorsTab: true,
                //         successorsTab: true,
                //             notesTab: true,
                //         }
                // },
                // Optionally add tooltip to show scheduling conflicts
                // eventTooltip: {
                //     template: data => {
                //         return `
                //         <div class="b-sch-event-title">${data.eventRecord.name}</div>
                //         <div class="b-sch-event-time">${DateHelper.format(data.eventRecord.startDate, 'HH:mm')} - ${DateHelper.format(data.eventRecord.endDate, 'HH:mm')}</div>
                //     `;
                //     }
                // }
            },
        });

        scheduler.on('afterDragCreate', ({ source, target, dependencyRecord }) => {
            console.log('Dependency created via drag:', dependencyRecord);
        });
        const dependencyTypeMap = {
            0: 'StartToStart',
            1: 'StartToEnd',
            2: 'EndToStart',
            3: 'EndToEnd'
        }
        scheduler.dependencyStore.on('add', ({ records }) => {
            records.forEach(dep => {
                console.log('New dependency created: from', dep.fromEvent, ' to  → ', dep.toEvent);
                createTaskDependency({
                    from_task_id: dep.fromEvent.data.id,
                    to_task_id: dep.toEvent.data.id,
                    project_id: id,
                    type: dependencyTypeMap[dep.type] || 2,
                    lag: dep.lag,
                    lag_unit: dep.lagUnit,
                    active: dep.active || true,
                }).then((res) => {
                    console.log('Backend dependency created:', res);
                    if (res.error === null) {
                        console.log('dependency created successfully ', res);
                    }
                    else { 
                        console.log('Error creating task:', res.error.message);
                    }
                })
            });
        });
        scheduler.dependencyStore.on('update', ({ record, changes }) => {
            console.log('Dependency updated:', record);
            console.log('Changes:', changes);
        });
        scheduler.dependencyStore.on('remove', ({ records }) => {
            records.forEach(dep => {
                console.log('Dependency removed:', dep);
                // sendDependencyToBackend('delete', dep.id);
            });
        }
        );
        scheduler.on('afterEventSave', ({ eventRecord }) => {
            const isNewEvent = !events.some(e => e.id === eventRecord.id);
            const task_groups = {
                'metal_fittings': 1,
                'installations': 2,
                'connections': 3,
                'completion_test': 4,
            };
            console.log('eventRecord.resourceId', eventRecord.resourceId)
            const groupName = eventRecord.resourceId;
            const taskGroupId = task_groups[groupName];
            const formattedData = {
                task_group_id: taskGroupId,
                start_date: eventRecord.startDate,
                end_date: eventRecord.endDate,
                title: eventRecord.name,
            };
            if (isNewEvent) {
                formattedData.project = id
                createNewTasks(formattedData).then((res) => {
                    console.log('Backend created:', res);
                    if (res.error === null) {
                        console.log('Task created successfully ', res);
                    }
                    else { 
                        console.log('Error creating task:', res.error.message);
                    }
                });
            }
            else {
                updateTask(formattedData, eventRecord.id).then((res) => {
                    console.log('Backend updated:', res);
                    if (res.error === null) {
                        console.log('Task updated successfully');
                    }
                    else { 
                        console.log('Error updating task:', res.error.message);
                    }
                })
            }
        });
        scheduler.on('afterEventUpdate', ({ eventRecord }) => {
            const formattedData = {
                id: eventRecord.id,
                resourceId: eventRecord.resourceId,
                startDate: eventRecord.startDate,
                endDate: eventRecord.endDate,
                name: eventRecord.name,
            };
            console.log('Event updated:', formattedData);
        });
        scheduler.on('afterEventCancel', ({ eventRecord }) => {
            const formattedData = {
                id: eventRecord.id,
                resourceId: eventRecord.resourceId,
                startDate: eventRecord.startDate,
                endDate: eventRecord.endDate,
                name: eventRecord.name,
            };
            console.log('Event cancelled:', formattedData);
            // sendDataToBackend('cancel', formattedData);
        });
        // scheduler.on('afterEventEdit', (data) => {
        //     console.log('after event edited: ', data);
        //     // const formattedData = {
        //     //     id: eventRecord.id,
        //     //     resourceId: eventRecord.resourceId,
        //     //     startDate: eventRecord.startDate,
        //     //     endDate: eventRecord.endDate,
        //     //     name: eventRecord.name,
        //     // };
        //     // // Send the formatted data to your backend
        //     // console.log('Event updated:', formattedData);
        //     // sendDataToBackend('update', formattedData);
        // });
        scheduler.on('afterEventEdit', ({ source, action, eventEdit, eventRecord, resourceRecord, eventElement, editor }) => {
            console.log('Event edited:', eventRecord.name);
            console.log('Event edit action:', action); // 'edit' or 'resize'
        });
        return () => scheduler.destroy();
    }, [events]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading tasks</div>;
    return <div ref={schedulerRef} style={{ height: '500px', width: '100%' }} />;
};

export default Calender2;
