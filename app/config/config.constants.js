(function () {
  'use strict';

  angular.module('apbDemo')
    .constant('APP_ROUTES', {
      MONTHLY_SUMMARY_ROUTE: '/monthly-summary'
    })
    .constant('API_ENDPOINTS', {
      SPEND_SUMMARY: '/spend/summary',
      SPEND_KPIS: '/spend/kpis',
      SPEND_BREAKDOWN: '/spend/breakdown',
      MONTH_CONTEXT: '/spend/month-context'
    });
})();
