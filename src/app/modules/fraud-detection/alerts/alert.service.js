(function() {
  'use strict';
  angular.module('fraudDetection.alerts')
    .factory('AlertService', ['$resource', 'API_ENDPOINTS', function($resource, API_ENDPOINTS) {
      var Alert = $resource(API_ENDPOINTS.ALERTS + '/:alertId', { alertId: '@alertId' }, {
        query: { method: 'GET', isArray: true },
        get: { method: 'GET' },
        update: { method: 'PUT' },
        delete: { method: 'DELETE' }
      });
      return {
        getAlerts: function(params) {
          return Alert.query(params).$promise;
        },
        getAlertById: function(alertId) {
          return Alert.get({ alertId: alertId }).$promise;
        },
        createAlert: function(alertData) {
          var alert = new Alert(alertData);
          return alert.$save();
        },
        updateAlert: function(alertId, updates) {
          return Alert.update({ alertId: alertId }, updates).$promise;
        },
        deleteAlert: function(alertId) {
          return Alert.delete({ alertId: alertId }).$promise;
        }
      };
    }]);
})();