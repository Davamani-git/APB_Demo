(function () {
  'use strict';

  angular.module('app.core')
    .constant('apiConfig', {
      monthlySummary: {
        path: '/insights/monthly-summary',
        timeoutMs: 8000
      }
    });
}());
