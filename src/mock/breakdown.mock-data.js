(function () {
  'use strict';

  window.BreakdownMockData = {
    '2026-07': {
      month: '2026-07',
      categories: [
        { id: 'groceries', label: 'Groceries', amount: 12500, percentage: 27.3 },
        { id: 'fuel', label: 'Fuel', amount: 5800, percentage: 12.6 },
        { id: 'online', label: 'Online Shopping', amount: 16200, percentage: 35.3 },
        { id: 'utilities', label: 'Utilities', amount: 4200, percentage: 9.2 },
        { id: 'others', label: 'Others', amount: 8172, percentage: 17.8 }
      ]
    },
    '2026-06': {
      month: '2026-06',
      categories: [
        { id: 'groceries', label: 'Groceries', amount: 9800, percentage: 25.3 },
        { id: 'fuel', label: 'Fuel', amount: 6200, percentage: 16.0 },
        { id: 'online', label: 'Online Shopping', amount: 14000, percentage: 36.1 },
        { id: 'utilities', label: 'Utilities', amount: 3800, percentage: 9.8 },
        { id: 'others', label: 'Others', amount: 4950, percentage: 12.8 }
      ]
    },
    '2026-05': {
      month: '2026-05',
      categories: []
    },
    'default': {
      month: '',
      categories: []
    }
  };
})();
