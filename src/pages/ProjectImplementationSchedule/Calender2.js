import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
    Scheduler,
    SchedulerPro,
    ResourceStore,
    DependencyStore,
    DateHelper,
    ProjectModel,
    DependencyTab,
    PredecessorsTab,
    SuccessorsTab,
    DependencyEdit,
    DependencyMenu,
} from '@bryntum/schedulerpro'

import './Calender2.css'
import '@bryntum/schedulerpro/schedulerpro.stockholm.css'

import {
    createNewTasks,
    listAllTasksByProject2,
    updateTask,
    deleteTasks,
    createTaskDependency,
    deleteTaskDependency,
    getAllTaskDependencyByProject,
    getSelectedWorkTypes,
} from 'supabase'

import { customMonthViewPreset, features, getTimelineRange, dependencyTypeMap, resources } from './SchedulerConfig'
import { forEach } from 'lodash'
import { duration } from 'moment';


const Calender2 = () => {
    const [range, setRange] = React.useState(getTimelineRange())
    const schedulerRef = useRef(null)
    const { id } = useParams()
    console.log('myID', id)

    const { data, isLoading, error } = useQuery(['projectData', id], async () => {
        const [tasks, dependencies] = await Promise.all([listAllTasksByProject2(id), getAllTaskDependencyByProject(id)])
        return { tasks, dependencies }
    })

    // Group tasks as before
    const groupedTasks = React.useMemo(() => {
        if (!data?.tasks) return null
        const task_groups = {
            1: 'metal_fittings',
            2: 'installations',
            3: 'connections',
            4: 'completion_test',
        }
        const grouped = {
            metal_fittings: [],
            installations: [],
            connections: [],
            completion_test: [],
        }
        // group nested task on the basis of parenId
        const nestedTasks = data.tasks.data.filter((task) => task.parent_id !== null);
        const nestedTaskGroupedOnParentId = {}

        nestedTasks.forEach((task) => {
            const parentId = task.parent_task;
            if (parentId) {
                if (!nestedTaskGroupedOnParentId[parentId]) {
                    nestedTaskGroupedOnParentId[parentId] = [];
                }
                nestedTaskGroupedOnParentId[parentId].push(task);
            }
        });

        console.log('nestedTaskGroupedOnPreantId', nestedTaskGroupedOnParentId)
        data.tasks.data?.forEach((task) => {
            const groupId = task.task_group_id
            if (!task.parent_task && groupId !== null && task_groups[groupId]) {
                grouped[task_groups[groupId]].push({
                    ...task,
                    children: nestedTaskGroupedOnParentId[task.id] || [],
                })
            }
        })
        console.log('grouped', grouped)
        return grouped
    }, [data?.tasks])

    // Use dependencies from the query result
    const dependencyTypeMap = {
        StartToStart: 0,
        StartToEnd: 1,
        EndToStart: 2,
        EndToEnd: 3,
    }
    const dependencies = React.useMemo(() => {
        if (!data?.dependencies?.data) return []
        return data.dependencies.data.map((dep) => ({
            id: dep.id,
            fromEvent: dep.from_task_id,
            toEvent: dep.to_task_id,
            type: dependencyTypeMap[dep.type] || 2, // default to Finish-to-Start(connection points)
            active: dep.active || true,
            lag: dep.lag || 0,
            lagUnit: dep.lag_unit || 'd',
        }))
    }, [data?.dependencies])
    console.log('dependencies', dependencies)

    const events = React.useMemo(() => {
        if (!groupedTasks) return [];
        const { connections, installations, metal_fittings, completion_test } = groupedTasks;
        return [
            ...connections.map((connection, index) => {
                const event = {
                id: connection.id || `connection-${index + 1}`,
                resourceId: 'connections',
                startDate: connection.start_date ? new Date(`${connection.start_date}T00:00:00`) : new Date(),
                endDate: connection.end_date ? new Date(`${connection.end_date}T00:00:00`): new Date(),
                name: connection.title,
                }
                if (connection.children && connection.children.length > 0) {
                    event.children = connection.children.map((child) => ({
                        id: child.id || `child-${child.id}`,
                        resourceId: 'connections',
                        startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
                        endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
                        name: child.title,
                        leaf: true,
                        eventColor: 'red',
                    }))
                }
                return event;
            }),
            ...installations.map((installation, index) => {
                const event = {
                    id: installation.id,
                    resourceId: 'installations',
                    startDate: installation.start_date ? new Date(`${installation.start_date}T00:00:00`).toISOString() : new Date().toISOString(),
                    endDate: installation.end_date ? new Date(`${installation.end_date}T00:00:00`).toISOString() : (() => {
                        const today = new Date();
                        today.setDate(today.getDate() + 3);
                        return today.toISOString();
                    })(),
                    // duration: 6,
                    name: installation.title,
                    expanded: true,
                }
                if (installation.children && installation.children.length > 0) {
                    event.children = installation.children.map((child) => ({
                        id: child.id || `child-${child.id}`,
                        resourceId: 'installations',
                        startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
                        endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
                        name: child.title,
                        leaf: true,
                        eventColor: 'blue',
                    }))
                }
                return event;
            }),
            ...metal_fittings.map((metal_fitting, index) => {
                const event = {
                    id: metal_fitting.id || `metal_fitting-${index + 1}`,
                    resourceId: 'metal_fittings',
                    startDate: metal_fitting.start_date ? new Date(`${metal_fitting.start_date}T00:00:00`) : new Date(),
                    endDate: metal_fitting.end_date ? new Date(`${metal_fitting.end_date}T00:00:00`) : new Date(),
                    duration: 4,
                    name: metal_fitting.title,
                    eventsColor: 'green',
                    expanded: true,
                }
                if (metal_fitting.children && metal_fitting.children.length > 0) {
                    event.children = metal_fitting.children.map((child) => ({
                        id: child.id || `child-${child.id}`,
                        resourceId: 'metal_fittings',
                        startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
                        endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
                        name: child.title,
                        leaf: true,
                        eventColor: 'green',
                    }))
                }
                return event;
            }),
            ...completion_test.map((completion_test, index) => {
                const event = {id: completion_test.id || `completion_test-${index + 1}`,
                resourceId: 'completion_test',
                startDate: completion_test.start_date ? new Date(`${completion_test.start_date}T00:00:00`).toISOString() : new Date().toISOString(),
                endDate: completion_test.end_date ? new Date(`${completion_test.end_date}T00:00:00`).toISOString() : new Date().toISOString(),
                name: completion_test.title || `Completion Test + ${index + 1}`,
                // manuallyScheduled: true,
                    expanded: true,
                }
                if (completion_test.children && completion_test.children.length > 0) {
                    event.children = completion_test.children.map((child) => ({
                        id: child.id || `child-${child.id}`,
                        resourceId: 'completion_test',
                        startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
                        endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
                        name: child.title,
                        leaf: true,
                        eventColor: 'green',
                    }))
                }

                return event;
            }),
        ];
    }, [groupedTasks]);

    const project = new ProjectModel({
        eventsData: [...events],
        resourcesData: resources,
        // dependenciesData: dependencies,
        dependencyStore: new DependencyStore({
            data: dependencies,
            autoLoad: true,
        }),
    });
    useEffect(() => {
        if (!schedulerRef.current) return;
        const scheduler = new SchedulerPro({
            appendTo: schedulerRef.current,
            autoHeight: true,
            width: '100%',
            infiniteScroll: true,
            autoAdjustTimeAxis: true,
            // startDate: range.startDate,
            // endDate: range.endDate,
            viewPreset: customMonthViewPreset,
            multiEventSelect: true,
            columns: [
                { text: 'Work / Team', field: 'name', width: 200 },
            ],
            project,
            listeners: {
                beforeDependencySave: (data) => {
                    console.log('before Dependency save:', data);
                },
                beforeDependencyCreateFinalize: ({ source, target }) => {
                    console.log('before Dependency create finalize:',);
                    console.log('source', source);
                    console.log('target', target);
                },
                afterDependencySave: (data) => {
                    console.log('Dependency saved:', data);
                },
                beforeDependencyDelete: (data) => {
                    console.log('Before dependency delete:', data);
                },

                eventDragStart: (data) => {
                    console.log('Event drag started:', data)
                },
                eventDrop: ({ eventRecords }) => {
                    console.log('Event drag ended:', eventRecords)
                    forEach(eventRecords, (event) => {
                        const start_date = event.data.startDate
                        const end_date = event.data.endDate
                        updateTask({ start_date, end_date }, event.data.id).then((res) => {
                            if (res.status >= 200 && res.status < 300) {
                                console.log('Task updated successfully:', res.data)
                            } else {
                                console.error('Error updating: ', res.error.message)
                            }
                        })
                    })
                },
                // eventDragAbort: (data) => {
                //     console.log('Event drag aborted:', data);
                // },
                eventResizeStart: ({ eventRecord }) => {
                    console.log('Event resize started:', eventRecord)
                },
                eventResizeEnd: ({ eventRecord }) => {
                    // update the start and end date in the backend
                    const start_date = eventRecord.data.startDate.toISOString();
                    const end_date = eventRecord.data.endDate.toISOString();
                    console.log('start date', start_date);
                    console.log('end date', end_date);
                    updateTask({ start_date, end_date }, eventRecord.data.id).then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            console.log('Task updated successfully:', res.data);
                        }
                        else {
                            console.error('Error updating: ', res.error.message);
                        }
                    });
                    console.log('Event resize ended:', eventRecord)
                },
                eventDragSelect: ({ selectedEvents }) => {
                    console.log(
                        'Selected events:',
                        selectedEvents.map((event) => event.name)
                    )
                },
                beforeEventDelete: ({ eventRecords }) => {
                    console.log('Before event delete:', data)
                    const eventIds = eventRecords.map((eventRecord) => eventRecord.id)

                    // Check if any event has dependencies
                    const hasDependencies = eventRecords.some((eventRecord) => {
                        const dependencies = scheduler.dependencyStore.getEventDependencies(eventRecord)

                        if (dependencies.length > 0) {
                            console.warn(`Cannot delete event "${eventRecord.name}" because it has dependencies.`)
                            alert(
                                `Cannot delete event "${eventRecord.name}" because it has dependencies. Please remove the dependencies first.`
                            )
                            return true // Found an event with dependencies
                        }
                        return false // No dependencies for this event
                    })
                    if (hasDependencies) {
                        return false
                    }
                    //     const dependencies = scheduler.dependencyStore.getEventDependencies(eventRecord);
                    //     console.log('dependencies', dependencies);
                    //     console.log(dependencies.length);
                    //     if (dependencies.length > 0) {
                    //         console.warn(`Cannot delete event "${eventRecord.name}" because it has dependencies.`);
                    //         console.warn(`Cannot delete event "${eventRecord.name}" because it has dependencies.`);
                    //         // Replace this with a custom notification or modal
                    //         // Example: showNotification({ message: `Cannot delete event "${eventRecord.name}" because it has dependencies. Please remove the dependencies first.`, type: 'warning' });
                    //         return false; // Prevent deletion for all events
                    //     }
                    // });
                    console.log(`Events to be deleted:`, eventIds)
                    return deleteTasks(eventIds)
                        .then((res) => {
                            console.log(`Backend response:`, res)
                            if (res.error === null) {
                                console.log(`Events deleted successfully from backend:`, eventIds)
                                return true
                            }
                            console.error(`Error deleting events:`, res.error.message)
                            alert(`Error deleting events: ${res.error.message}`)
                            return false
                        })
                        .catch((err) => {
                            console.error(`Error deleting events:`, err)
                            alert(`Error deleting events: ${err.message}`)
                            return false // Prevent deletion
                        })
                },
                afterEventEdit: ({ source, action }) => {
                    console.log('After event edit listener:', action)
                },
            },
            eventRenderer({ eventRecord }) {
                return `<div class="custom-event">${eventRecord.name}</div>`
            },
            features,
        })

        scheduler.dependencyStore.on('add', ({ records }) => {
            console.log('Dependency added:', records)
            records.forEach((dep) => {
                console.log('New dependency created: from', dep.fromEvent, ' to  → ', dep.toEvent)
                createTaskDependency({
                    from_task_id: dep.fromEvent.data.id,
                    to_task_id: dep.toEvent.data.id,
                    project_id: id,
                    type: dependencyTypeMap[dep.type] || 2,
                    lag: DateHelper.diff(
                        new Date(dep.fromEvent.originalData.endDate),
                        new Date(dep.toEvent.originalData.startDate),
                        'd'
                    ),
                    lag_unit: dep.lagUnit,
                    active: dep.active || true,
                }).then((res) => {
                    console.log('Backend dependency created:', res)
                    if (res.error === null) {
                        console.log('dependency created successfully ', res)
                    } else {
                        console.log('Error creating task:', res.error.message)
                    }
                })
            })
        })
        scheduler.dependencyStore.on('update', ({ record, changes }) => {
            console.log('Dependency updated:', record)
            console.log('Changes:', changes)
        })
        scheduler.dependencyStore.on('remove', ({ records }) => {
            console.log('Dependency removed:', records)
            records.forEach((dep) => {
                console.log('Dependency removed:', dep)
                // sendDependencyToBackend('delete', dep.id);
                deleteTaskDependency(dep.data.id)
                    .then((res) => {
                        console.log('Backend dependency deleted:', res)
                        if (res.error === null) {
                            console.log('Dependency deleted successfully:', res)
                            // return true;
                        } else {
                            console.error('Error deleting dependency:', res.error)
                            alert('Error deleting dependency:', res.error)
                            // return false; // Prevent deletion if there's an error
                        }
                    })
                    .catch((err) => {
                        console.error('Error deleting dependency:', err)
                        alert('Error deleting dependency:', err.message)
                        // return false; // Prevent deletion if there's an error
                    })
            })
        })
        scheduler.on('afterEventSave', ({ eventRecord }) => {
            const isNewEvent = !events.some((e) => e.id === eventRecord.id)
            const task_groups = {
                metal_fittings: 1,
                installations: 2,
                connections: 3,
                completion_test: 4,
            }
            console.log('eventRecord.resourceId', eventRecord.resourceId)
            const groupName = eventRecord.resourceId
            const taskGroupId = task_groups[groupName]
            const start_date = DateHelper.format(new Date(eventRecord.startDate), 'YYYY-MM-DD');
            const end_date = DateHelper.format(new Date(eventRecord.endDate), 'YYYY-MM-DD');
            const formattedData = {
                task_group_id: taskGroupId,
                start_date,
                end_date,
                title: eventRecord.name,
            }
            if (isNewEvent) {
                formattedData.project = id
                createNewTasks(formattedData).then((res) => {
                    console.log('Backend created:', res)
                    if (res.error === null) {
                        console.log('Task created successfully ', res)
                        eventRecord.id = res.data[0].id
                        eventRecord.commit()
                        console.log('Event created:', eventRecord)
                    } else {
                        console.log('Error creating task:', res.error.message)
                        eventRecord.remove()
                    }
                })
            } else {
                updateTask(formattedData, eventRecord.id).then((res) => {
                    console.log('Backend updated:', res)
                    if (res.error === null) {
                        console.log('Task updated successfully')
                    } else {
                        console.log('Error updating task:', res.error.message)
                    }
                })
            }
        })

        scheduler.on('afterEventUpdate', ({ eventRecord }) => {
            const formattedData = {
                id: eventRecord.id,
                resourceId: eventRecord.resourceId,
                startDate: eventRecord.startDate,
                endDate: eventRecord.endDate,
                name: eventRecord.name,
            }
            console.log('Event updated:', formattedData)
        })

        scheduler.on('afterEventCancel', ({ eventRecord }) => {
            console.log('Event cancelled:', eventRecord)
        })

        scheduler.on(
            'afterEventEdit',
            ({ source, action, eventEdit, eventRecord, resourceRecord, eventElement, editor }) => {
                console.log('Event edit action:', action)
            }
        )
        return () => scheduler.destroy()
    }, [events])

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading tasks</div>
    return <div ref={schedulerRef} style={{ height: '500px', width: '100%' }} />
}

export default Calender2
