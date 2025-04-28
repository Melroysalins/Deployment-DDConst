
// view preset config object
export const customMonthViewPreset = {
        id: 'customMonthViewPreset',
        name: 'Custom Month View',
        base: 'weekAndMonth',
        tickWidth: 40,
        headers: [
            { unit: 'year', dateFormat: 'YYYY' }, // Year header (e.g., "2025")
            { unit: 'month', dateFormat: 'MMMM YYYY', align: 'start' }, // Month header
            { unit: 'day', dateFormat: 'DD' }, 
            {
                unit: 'day', dateFormat: 'dd', align: 'center'
            }
        ]
    };

// resources array
export const resources = [
    { id: 'metal_fittings', name: 'Metal Fittings', width: 100 },
    { id: 'installations', name: 'Installation', width: 100 },
    { id: 'connections', name: 'Connection', width: 100 },
    { id: 'completion_test', name: 'Completion Test (AC)', width: 100 },
];


export const columns = [
    { text: 'Work / Team', field: 'name', width: 200 }
]

export const dependencyTypeMap = {
    0: 'StartToStart',
    1: 'StartToEnd',
    2: 'EndToStart',
    3: 'EndToEnd'
}

const lagUnitMap = {
    ms: 'ms', // milliseconds
    s: 's', // seconds
    m: 'm', // minutes
    h: 'h', // hours
    d: 'd', // days
    w: 'w', // weeks
    M: 'M', // months
    y: 'y' // years
};
