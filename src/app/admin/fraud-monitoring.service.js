(function() {
  'use strict';
  angular.module('shoppingPlatform').service('FraudMonitoringService', ['$http', 'API_CONFIG', 'NotificationService', function($http, API_CONFIG, NotificationService) {
    this.getFraudAlerts = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/admin/fraud/alerts', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data || [];
      });
    };
    this.investigateAccount = function(accountId) {
      return $http.post(API_CONFIG.baseUrl + '/api/admin/fraud/investigate', { accountId: accountId }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.flagAccount = function(accountId, reason) {
      return $http.post(API_CONFIG.baseUrl + '/api/admin/fraud/flag', {
        accountId: accountId,
        reason: reason
      }, { timeout: API_CONFIG.timeout }).then(function(response) {
        NotificationService.sendEmailNotification({
          type: 'fraud_flag',
          accountId: accountId,
          reason: reason
        });
        return response.data;
      });
    };
    this.takeAction = function(accountId, action) {
      return $http.post(API_CONFIG.baseUrl + '/api/admin/fraud/action', {
        accountId: accountId,
        action: action
      }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();