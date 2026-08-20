(function() {
  'use strict';
  angular.module('fraudDetection.response')
    .factory('ResponseService', ['$http', '$q', 'ProtectionService', 'AuditService', function($http, $q, ProtectionService, AuditService) {
      return {
        submitResponse: function(alertId, response) {
          var payload = {
            responseId: 'RESP-' + Date.now(),
            alertId: alertId,
            response: response,
            authenticatedAt: new Date(),
            timestamp: new Date()
          };
          return $http.post('/api/alerts/' + alertId + '/response', payload)
            .then(function(apiResponse) {
              var eventType = response === 'confirmed' ? 'fraud_alert_confirmed' : 'fraud_alert_reported';
              AuditService.logEvent(eventType, alertId, payload);
              if (response === 'reported') {
                return ProtectionService.initiateProtection(alertId, apiResponse.data.customerId)
                  .then(function(protectionResult) {
                    return {
                      responseId: payload.responseId,
                      caseId: protectionResult.caseId,
                      status: 'reported'
                    };
                  });
              }
              return {
                responseId: payload.responseId,
                status: 'confirmed'
              };
            });
        }
      };
    }]);
})();