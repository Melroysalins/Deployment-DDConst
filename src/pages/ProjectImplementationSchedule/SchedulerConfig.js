
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
    { id: 'connection', name: 'Connection', width: 100 },
    { id: 'installation', name: 'Installation', width: 100 },
    { id: 'metal_fittings', name: 'Metal Fittings', width: 100 },
    { id: 'completion_test', name: 'Completion Test (AC)', width: 100 },
];


export const columns = [
    { text: 'Work / Team', field: 'name', width: 200 }
]