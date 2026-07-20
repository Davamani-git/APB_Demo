(function () {
    'use strict';

    window.KpiMockData = {
        july: [
            {
                id: 'totalSpend',
                label: 'Total Monthly Spend',
                value: 45872,
                unit: 'currency',
                formattedValue: 'Higher than last month'
            },
            {
                id: 'transactionCount',
                label: 'Transactions',
                value: 92,
                unit: 'count',
                formattedValue: 'Includes all eligible card accounts'
            },
            {
                id: 'averageTransactionValue',
                label: 'Average Transaction Value',
                value: 498,
                unit: 'currency',
                formattedValue: 'Average amount per transaction'
            }
        ],
        june: [
            {
                id: 'totalSpend',
                label: 'Total Monthly Spend',
                value: 38940,
                unit: 'currency',
                formattedValue: 'Lower than July 2026'
            },
            {
                id: 'transactionCount',
                label: 'Transactions',
                value: 81,
                unit: 'count',
                formattedValue: 'Moderate activity'
            },
            {
                id: 'averageTransactionValue',
                label: 'Average Transaction Value',
                value: 481,
                unit: 'currency',
                formattedValue: 'Average amount per transaction'
            }
        ],
        default: [
            {
                id: 'totalSpend',
                label: 'Total Monthly Spend',
                value: 0,
                unit: 'currency',
                formattedValue: 'No spend in this month'
            },
            {
                id: 'transactionCount',
                label: 'Transactions',
                value: 0,
                unit: 'count',
                formattedValue: 'No transactions recorded'
            },
            {
                id: 'averageTransactionValue',
                label: 'Average Transaction Value',
                value: 0,
                unit: 'currency',
                formattedValue: 'No activity to calculate average'
            }
        ]
    };
})();
