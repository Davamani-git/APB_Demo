(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('ApiEndpointService', ApiEndpointService);

  ApiEndpointService.$inject = ['ENV_CONFIG'];

  function ApiEndpointService(ENV_CONFIG) {
    this.getMonthlySummaryUrl = function(accountId, month) {
      return ENV_CONFIG.apiBaseUrl + '/summary?accountId=' + encodeURIComponent(accountId) + '&month=' + encodeURIComponent(month);
    };

    this.getAvailableMonthsUrl = function(accountId) {
      return ENV_CONFIG.apiBaseUrl + '/summary/months?accountId=' + encodeURIComponent(accountId);
    };
  }
})();
