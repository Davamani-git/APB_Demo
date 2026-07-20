(function () {
  'use strict';

  window.MonthContextMockData = {
    months: [
      {
        month: '2026-07',
        label: 'July 2026',
        isFinal: true,
        isCurrent: false,
        billingCycleId: '2026-07-01',
        mockTotalSpend: 45872,
        mockTxnCount: 92
      },
      {
        month: '2026-06',
        label: 'June 2026',
        isFinal: true,
        isCurrent: false,
        billingCycleId: '2026-06-01',
        mockTotalSpend: 38750,
        mockTxnCount: 81
      },
      {
        month: '2026-05',
        label: 'May 2026',
        isFinal: true,
        isCurrent: false,
        billingCycleId: '2026-05-01',
        mockTotalSpend: 0,
        mockTxnCount: 0
      }
    ],
    defaultMonth: '2026-07'
  };
})();
