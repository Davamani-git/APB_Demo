'use strict';

(function () {
  class AuditEventService {
    constructor($http, $q, AUDIT_API_BASE_URL, $log) {
      'ngInject';
      this.$http = $http;
      this.$q = $q;
      this.$log = $log;
      this.baseUrl = AUDIT_API_BASE_URL;
    }

    logEvent(type, payload) {
      var body = angular.extend({ eventType: type, timestamp: new Date().toISOString() }, payload || {});
      return this.$http.post(this.baseUrl + '/events', body)
        .catch(err => {
          this.$log.error('Audit logEvent failed', err);
          return this.$q.resolve();
        });
    }

    logError(type, error) {
      var payload = {
        errorType: type,
        message: (error && error.message) || 'Unknown error',
        status: error && error.status
      };
      return this.logEvent('ERROR', payload);
    }
  }

  angular
    .module('davBanking.insightDelivery')
    .service('AuditEventService', AuditEventService);
})();
