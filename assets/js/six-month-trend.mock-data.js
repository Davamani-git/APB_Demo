(function(window) {
  'use strict';

  // Mock datasets for six-month trends depending on reference month
  window.SixMonthTrendMockData = {
    '2026-07': {
      range: '6m',
      points: [
        { month: '2026-02', totalSpend: 32000, transactionCount: 70 },
        { month: '2026-03', totalSpend: 35500, transactionCount: 75 },
        { month: '2026-04', totalSpend: 41000, transactionCount: 88 },
        { month: '2026-05', totalSpend: 0, transactionCount: 0 },
        { month: '2026-06', totalSpend: 38210, transactionCount: 80 },
        { month: '2026-07', totalSpend: 45872, transactionCount: 92 }
      ]
    },
    '2026-06': {
      range: '6m',
      points: [
        { month: '2026-01', totalSpend: 28000, transactionCount: 60 },
        { month: '2026-02', totalSpend: 30000, transactionCount: 65 },
        { month: '2026-03', totalSpend: 34000, transactionCount: 72 },
        { month: '2026-04', totalSpend: 36000, transactionCount: 78 },
        { month: '2026-05', totalSpend: 0, transactionCount: 0 },
        { month: '2026-06', totalSpend: 38210, transactionCount: 80 }
      ]
    },
    'no-data': {
      range: '6m',
      points: []
    }
  };
})(window);
