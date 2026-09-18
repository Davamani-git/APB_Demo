(function() {
  'use strict';
  angular.module('fraudDetection.alerts')
    .service('AlertCreationService', ['$http', '$q', 'AuditService', 'AnalyticsEventFactory', 'API_CONFIG', function($http, $q, AuditService, AnalyticsEventFactory, API_CONFIG) {
      this.createAlert = function(transaction, riskAssessment) {
        const alert = {
          alert_id: 'ALERT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          transaction_id: transaction.transaction_id,
          customer_id: transaction.account_id,
          severity: this.mapRiskBandToSeverity(riskAssessment.risk_band),
          status: 'created',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          resolved_at: null
        };
        
        return $http.post(API_CONFIG.alertsUrl, alert)
          .then(function(response) {
            AuditService.logAlertCreation(alert);
            const analyticsEvent = AnalyticsEventFactory.createFraudAlertEvent(alert);
            AuditService.log({
              type: 'analytics_event',
              data: analyticsEvent
            });
            return response.data;
          })
          .catch(function(error) {
            return $q.reject({
              error: 'Alert creation failed',
              details: error
            });
          });
      };
      
      this.mapRiskBandToSeverity = function(riskBand) {
        const mapping = {
          'low': 'low',
          'medium': 'medium',
          'high': 'high'
        };
        return mapping[riskBand] || 'medium';
      };
      
      this.getAlerts = function(filters) {
        let url = API_CONFIG.alertsUrl;
        const params = [];
        if (filters) {
          if (filters.severity) params.push('severity=' + filters.severity);
          if (filters.status) params.push('status=' + filters.status);
          if (filters.search) params.push('search=' + filters.search);
        }
        if (params.length > 0) {
          url += '?' + params.join('&');
        }
        return $http.get(url)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
      
      this.resolveAlert = function(alertId) {
        return $http.patch(API_CONFIG.alertsUrl + '/' + alertId, { status: 'resolved', resolved_at: new Date().toISOString() })
          .then(function(response) {
            AuditService.logStateTransition(alertId, 'created', 'resolved');
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
    }]);
})();