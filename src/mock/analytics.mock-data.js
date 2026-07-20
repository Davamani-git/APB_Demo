window.AnalyticsMockData = (function() {
    'use strict';

    var baseData = {
        categoryWise: {
            chartType: 'doughnut',
            labels: ['Food & Dining', 'Shopping', 'Travel', 'Fuel', 'Utilities'],
            datasets: [{
                label: 'Spending by Category',
                data: [3500, 5500, 2000, 800, 1200],
                backgroundColor: ['#0052CC', '#FFAB00', '#36B37E', '#FF5630', '#6554C0']
            }]
        },
        monthlyTrend: {
            chartType: 'line',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Total Spend',
                data: [12000, 15000, 11000, 18000, 16500, 22000],
                borderColor: '#0052CC',
                fill: false
            }]
        },
        cardDistribution: {
            chartType: 'pie',
            labels: ['Platinum Card', 'Gold Card', 'Travel Card'],
            datasets: [{
                label: 'Spending by Card',
                data: [12500, 8500, 4000],
                backgroundColor: ['#0052CC', '#FFAB00', '#36B37E']
            }]
        },
        categoryBreakdown: {
            chartType: 'bar',
            labels: ['Food & Dining', 'Shopping', 'Travel', 'Fuel', 'Utilities', 'Healthcare', 'Entertainment'],
            datasets: [{
                label: 'Category Breakdown',
                data: [3500, 5500, 2000, 800, 1200, 750, 1100],
                backgroundColor: '#0052CC'
            }]
        }
    };

    function getAnalytics(params) {
        // In a real mock, you would adjust data based on params (e.g., date range)
        var randomizedData = JSON.parse(JSON.stringify(baseData));
        randomizedData.categoryWise.datasets[0].data = randomizedData.categoryWise.datasets[0].data.map(d => d * (0.8 + Math.random() * 0.4));
        randomizedData.monthlyTrend.datasets[0].data = randomizedData.monthlyTrend.datasets[0].data.map(d => d * (0.8 + Math.random() * 0.4));
        return randomizedData;
    }

    return {
        getAnalytics: getAnalytics
    };
})();