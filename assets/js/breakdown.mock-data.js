(function () {
    'use strict';

    window.BreakdownMockData = {
        july: {
            month: '2026-07',
            categories: [
                { id: 'grocery', label: 'Groceries', amount: 12890, percentage: 28.10 },
                { id: 'fuel', label: 'Fuel', amount: 6240, percentage: 13.60 },
                { id: 'online', label: 'Online Shopping', amount: 18450, percentage: 40.20 },
                { id: 'travel', label: 'Travel', amount: 8300, percentage: 18.10 }
            ]
        },
        june: {
            month: '2026-06',
            categories: [
                { id: 'grocery', label: 'Groceries', amount: 11020, percentage: 28.30 },
                { id: 'fuel', label: 'Fuel', amount: 5100, percentage: 13.10 },
                { id: 'online', label: 'Online Shopping', amount: 14980, percentage: 38.50 },
                { id: 'other', label: 'Others', amount: 4840, percentage: 20.10 }
            ]
        },
        default: {
            month: '2026-05',
            categories: []
        }
    };
})();
