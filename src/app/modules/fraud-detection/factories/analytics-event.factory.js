(function() {
  'use strict';
  angular.module('fraudDetection.ingestion')
    .factory('AnalyticsEventFactory', [function() {
      return {
        createEvent: function(eventType, eventData) {
          return {
            event_type: eventType,
            event_data: eventData,
            timestamp: new Date().toISOString(),
            session_id: this.generateSessionId()
          };
        },
        createFraudAlertEvent: function(alert) {
          return this.createEvent('fraud_alert_created', {
            alert_id: alert.alert_id,
            transaction_id: alert.transaction_id,
            severity: alert.severity,
            customer_id: alert.customer_id
          });
        },
        generateSessionId: function() {
          return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
      };
    }]);
})();