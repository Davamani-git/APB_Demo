window.BudgetMockData = (function() {
    'use strict';

    var data = {
        '2026-07': {
            monthlyBudget: 50000,
            currentSpend: 24500.75,
            remainingBudget: 25499.25,
            utilizationPercentage: 49.00
        },
        '2026-06': {
            monthlyBudget: 50000,
            currentSpend: 38750.50,
            remainingBudget: 11249.50,
            utilizationPercentage: 77.50
        }
    };

    function getSummary(month) {
        month = month || '2026-07';
        return data[month] || data['2026-07'];
    }

    return {
        getSummary: getSummary
    };
})();