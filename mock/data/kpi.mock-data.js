(function () {
    "use strict";

    window.KpiMockData = {
        baseKpis: [
            {
                id: "totalSpend",
                label: "Total Spend",
                supportingLabel: "Combined credit card spend",
                iconClass: "fa-credit-card"
            },
            {
                id: "transactionCount",
                label: "Number of Transactions",
                supportingLabel: "Posted transactions",
                iconClass: "fa-list-ul"
            },
            {
                id: "averageTransactionAmount",
                label: "Average Transaction Amount",
                supportingLabel: "Per posted transaction",
                iconClass: "fa-calculator"
            }
        ]
    };
})();
