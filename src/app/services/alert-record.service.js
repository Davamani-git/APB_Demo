(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .service('alertRecordService', ['$http', 'API_ENDPOINTS', function($http, API_ENDPOINTS) {
      const self = this;
      
      self.getAlerts = function(filters) {
        return $http.get(API_ENDPOINTS.fraudAlerts, {
          params: filters || {}
        }).then(function(response) {
          return response.data;
        });
      };
      
      self.getAlertById = function(alertId) {
        return $http.get(API_ENDPOINTS.fraudAlerts + '/' + alertId)
          .then(function(response) {
            return response.data;
          });
      };
      
      self.createAlert = function(alertData) {
        const alert = {
          alertId: self.generateAlertId(),
          transactionId: alertData.transactionId,
          cardId: alertData.cardId,
          riskScore: alertData.riskScore,
          riskLevel: alertData.riskLevel,
          treatment: alertData.treatment,
          status: 'open',
          createdAt: new Date(),
          updatedAt: new Date(),
          reviewedBy: null,
          notes: ''
        };
        return $http.post(API_ENDPOINTS.fraudAlerts, alert)
          .then(function(response) {
            return response.data;
          });
      };
      
      self.updateAlert = function(alertId, updates) {
        updates.updatedAt = new Date();
        return $http.put(API_ENDPOINTS.fraudAlerts + '/' + alertId, updates)
          .then(function(response) {
            return response.data;
          });
      };
      
      self.deleteAlert = function(alertId) {
        return $http.delete(API_ENDPOINTS.fraudAlerts + '/' + alertId)
          .then(function(response) {
            return response.data;
          });
      };
      
      self.generateAlertId = function() {
        return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      };
    }]);
})();