(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('AuditService', ['$http', '$log', 'API_CONFIG', function($http, $log, API_CONFIG) {
      this.log = function(event) {
        const auditEntry = {
          event_type: event.type,
          event_data: event.data,
          timestamp: new Date().toISOString(),
          user: event.user || 'system'
        };
        return $http.post(API_CONFIG.auditUrl, auditEntry)
          .then(function(response) {
            $log.info('Audit logged:', event.type);
            return response.data;
          })
          .catch(function(error) {
            $log.error('Audit logging failed:', error);
            throw error;
          });
      };
      
      this.logDecision = function(decision) {
        return this.log({
          type: 'policy_decision',
          data: decision,
          user: 'system'
        });
      };
      
      this.logAlertCreation = function(alert) {
        return this.log({
          type: 'alert_created',
          data: alert,
          user: 'system'
        });
      };
      
      this.logStateTransition = function(entity, fromState, toState) {
        return this.log({
          type: 'state_transition',
          data: { entity: entity, from: fromState, to: toState },
          user: 'system'
        });
      };
    }]);
})();