(function() {
  'use strict';
  angular.module('creditDashboardApp').factory('ApiConfigFactory', ['$window', function($window) {
    var baseUrl = '/api';
    var version = 'v1';
    return {
      getBaseUrl: function() {
        return baseUrl;
      },
      getVersion: function() {
        return version;
      },
      getHeaders: function() {
        return {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + ($window.sessionStorage.getItem('authToken') || '')
        };
      },
      getCardsEndpoint: function() {
        return baseUrl + '/cards';
      },
      getKpiEndpoint: function() {
        return baseUrl + '/cards/kpi';
      },
      getTransactionsEndpoint: function() {
        return baseUrl + '/transactions';
      }
    };
  }]);
  angular.module('creditDashboardApp').factory('ApiConfigFactory').$inject = ['$window'];
})();