(function () {
  'use strict';

  window.BreakdownMockData = {
    '2026-07': {
      month: '2026-07',
      categories: [
        { id: 'groceries', label: 'Groceries', amount: 12000, percentage: 26.17 },
        { id: 'travel', label: 'Travel', amount: 15000, percentage: 32.71 },
        { id: 'dining', label: 'Dining', amount: 9000, percentage: 19.63 },
        { id: 'online', label: 'Online Shopping', amount: 9872, percentage: 21.50 }
      ]
    },
    '2026-06': {
      month: '2026-06',
      categories: [
        { id: 'groceries', label: 'Groceries', amount: 10000, percentage: 25.71 },
        { id: 'travel', label: 'Travel', amount: 8000, percentage: 20.56 },
        { id: 'dining', label: 'Dining', amount: 7000, percentage: 17.99 },
        { id: 'online', label: 'Online Shopping', amount: 13912, percentage: 35.74 }
      ]
    },
    '2026-05': {
      month: '2026-05',
      categories: []
    },
    'default': {
      month: '2026-07',
      categories: [
        { id: 'groceries', label: 'Groceries', amount: 12000, percentage: 26.17 },
        { id: 'travel', label: 'Travel', amount: 15000, percentage: 32.71 },
        { id: 'dining', label: 'Dining', amount: 9000, percentage: 19.63 },
        { id: 'online', label: 'Online Shopping', amount: 9872, percentage: 21.50 }
      ]
    }
  };
})();
