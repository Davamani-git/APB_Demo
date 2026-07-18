(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .constant('APP_CONFIG', {
      appName: 'DAVMS Monthly Spending Summary Dashboard',
      defaultRoute: '/monthly-summary'
    });
})();
