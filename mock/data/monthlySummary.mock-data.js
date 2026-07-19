(function () {
    "use strict";

    window.MonthlySummaryMockData = {
        "2026-06": {
            month: "2026-06",
            totalSpend: 28500.00,
            transactionCount: 54,
            averageTransactionAmount: 527.78,
            currency: "INR",
            isPartial: false,
            dataSource: "MOCK_READ_REPLICA"
        },
        "2026-07": {
            month: "2026-07",
            totalSpend: 45872.50,
            transactionCount: 92,
            averageTransactionAmount: 498.61,
            currency: "INR",
            isPartial: false,
            dataSource: "MOCK_ANALYTICS_STORE"
        },
        "2026-05": {
            month: "2026-05",
            totalSpend: 0,
            transactionCount: 0,
            averageTransactionAmount: 0,
            currency: "INR",
            isPartial: false,
            dataSource: "MOCK_READ_REPLICA"
        },
        "partial-2026-07": {
            month: "2026-07",
            totalSpend: 32000.00,
            transactionCount: 70,
            averageTransactionAmount: 457.14,
            currency: "INR",
            isPartial: true,
            dataSource: "MOCK_PARTIAL_ANALYTICS"
        }
    };
})();
