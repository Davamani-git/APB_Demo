(function () {
    "use strict";

    window.MonthlySummaryMockDatasets = {
        "2026-07": {
            cardId: "CARD123",
            month: "2026-07",
            currency: "USD",
            totalSpend: 1234.56,
            dataFreshness: "ETL completed 2026-07-31T23:00Z",
            kpis: [
                { id: "totalSpend", label: "Total Spend", value: 1234.56 },
                { id: "numTransactions", label: "Number of Transactions", value: 42 },
                { id: "avgTransactionValue", label: "Average Transaction Value", value: 29.39 }
            ],
            breakdown: [
                { categoryId: "groceries", categoryName: "Groceries", amount: 345.67, percentageOfTotal: 28.0 },
                { categoryId: "travel", categoryName: "Travel", amount: 456.78, percentageOfTotal: 37.0 },
                { categoryId: "entertainment", categoryName: "Entertainment", amount: 123.45, percentageOfTotal: 10.0 }
            ]
        },
        "2026-06": {
            cardId: "CARD123",
            month: "2026-06",
            currency: "USD",
            totalSpend: 987.65,
            dataFreshness: "ETL completed 2026-06-30T23:00Z",
            kpis: [
                { id: "totalSpend", label: "Total Spend", value: 987.65 },
                { id: "numTransactions", label: "Number of Transactions", value: 35 },
                { id: "avgTransactionValue", label: "Average Transaction Value", value: 28.24 }
            ],
            breakdown: [
                { categoryId: "groceries", categoryName: "Groceries", amount: 300.10, percentageOfTotal: 30.4 },
                { categoryId: "utilities", categoryName: "Utilities", amount: 200.55, percentageOfTotal: 20.3 },
                { categoryId: "dining", categoryName: "Dining", amount: 150.25, percentageOfTotal: 15.2 }
            ]
        },
        "2026-05": {
            cardId: "CARD123",
            month: "2026-05",
            currency: "USD",
            totalSpend: 0,
            dataFreshness: "ETL completed 2026-05-31T23:00Z",
            kpis: [
                { id: "totalSpend", label: "Total Spend", value: 0 },
                { id: "numTransactions", label: "Number of Transactions", value: 0 },
                { id: "avgTransactionValue", label: "Average Transaction Value", value: 0 }
            ],
            breakdown: []
        }
    };
})();
