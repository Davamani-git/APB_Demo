'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.services')
    .service('AuditLogApiService', AuditLogApiService);

  AuditLogApiService.$inject = ['$http', 'ENV_CONFIG', 'ErrorHandlerService'];

  function AuditLogApiService($http, ENV_CONFIG, ErrorHandlerService) {
    this.logEvent = function (eventType, payload) {
      var body = angular.extend({}, payload || {}, {
        eventType: eventType,
        eventTime: new Date().toISOString()
      });
      return $http.post(ENV_CONFIG.API_BASE_URL + '/audit/events', body)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          throw ErrorHandlerService.handle(error, 'logEvent');
        });
    };
  }
})();
