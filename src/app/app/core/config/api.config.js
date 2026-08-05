(function () {
  'use strict';

  angular
    .module('ccd.core')
    .constant('apiConfig', {
      baseUrl: '',
      endpoints: {
        dashboardSummary: '/v1/dashboard/summary'
      }
    });
})();
