(function() {
  'use strict';
  angular.module('fraudDetection.protection')
    .factory('ProtectionService', ['$http', '$q', function($http, $q) {
      return {
        initiateProtection: function(alertId, customerId) {
          var payload = {
            alertId: alertId,
            customerId: customerId,
            action: 'block_card',
            timestamp: new Date()
          };
          return $http.post('/api/protection/initiate', payload)
            .then(function(response) {
              return response.data;
            });
        },
        getProtectionStatus: function(caseId) {
          return $http.get('/api/protection/cases/' + caseId)
            .then(function(response) {
              return response.data;
            });
        },
        executeSecurityAction: function(caseId, action) {
          return $http.post('/api/protection/cases/' + caseId + '/actions', {
            action: action,
            timestamp: new Date()
          })
          .then(function(response) {
            return response.data;
          });
        }
      };
    }]);
})();