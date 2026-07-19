(function(window) {
  'use strict';

  // Mock datasets keyed by month (YYYY-MM)
  window.MonthlySummaryMockData = {
    '2026-07': {
      month: '2026-07',
      totalSpend: 45872,
      transactionCount: 92,
      averageSpend: 498,
      currency: 'INR',
      kpiMetrics: {
        highestCategory: 'Dining',
        lowestCategory: 'Fuel'
      },
      chartData: {
        labels: ['Dining', 'Groceries', 'Fuel', 'Travel'],
        datasets: [{
          label: 'Spend by Category',
          data: [20500, 18000, 7372, 0],
          backgroundColor: ['#0052CC', '#2684FF', '#36B37E', '#FFAB00']
        }]
      },
      chartOptions: {
        responsive: true,
        legend: { position: 'bottom' },
        tooltips: { enabled: true }
      }
    },
    '2026-06': {
      month: '2026-06',
      totalSpend: 38210,
      transactionCount: 80,
      averageSpend: 478,
      currency: 'INR',
      kpiMetrics: {
        highestCategory: 'Groceries',
        lowestCategory: 'Entertainment'
      },
      chartData: {
        labels: ['Groceries', 'Dining', 'Fuel', 'Entertainment'],
        datasets: [{
          label: 'Spend by Category',
          data: [19000, 12000, 7210, 0],
          backgroundColor: ['#0052CC', '#2684FF', '#36B37E', '#FFAB00']
        }]
      },
      chartOptions: {
        responsive: true,
        legend: { position: 'bottom' },
        tooltips: { enabled: true }
      }
    },
    '2026-05': {
      month: '2026-05',
      totalSpend: 0,
      transactionCount: 0,
      averageSpend: 0,
      currency: 'INR',
      kpiMetrics: {},
      chartData: {
        labels: [],
        datasets: [{
          label: 'Spend by Category',
          data: [],
          backgroundColor: []
        }]
      },
      chartOptions: {
        responsive: true,
        legend: { position: 'bottom' },
        tooltips: { enabled: true }
      }
    }
  };
})(window);
