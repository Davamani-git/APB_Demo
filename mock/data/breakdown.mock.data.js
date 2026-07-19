(function () {
    'use strict';

    window.BreakdownMockData = {
        '2026-06': {
            month: '2026-06',
            totalSpend: 28500.75,
            segments: [
                { label: 'Online', value: 15000.25, percentage: 52.7 },
                { label: 'In-Store', value: 13500.50, percentage: 47.3 }
            ]
        },
        '2026-07': {
            month: '2026-07',
            totalSpend: 45872.50,
            segments: [
                { label: 'Online', value: 25000.00, percentage: 54.5 },
                { label: 'In-Store', value: 20872.50, percentage: 45.5 }
            ]
        },
        '2026-05': {
            month: '2026-05',
            totalSpend: 0,
            segments: []
        }
    };
})();
