(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('auditService', ['$http', '$rootScope', function($http, $rootScope) {
      var self = this;
      self.logAccess = function(userId, resource, success) {
        var logEntry = {
          userId: userId,
          action: 'access',
          resource: resource,
          timestamp: new Date(),
          success: success !== false
        };
        return $http.post('/api/audit/log', logEntry)
          .catch(function(error) {
            console.error('Audit log failed', error);
          });
      };
      self.logAction = function(userId, action, resource, details) {
        var logEntry = {
          userId: userId,
          action: action,
          resource: resource,
          details: details,
          timestamp: new Date(),
          success: true
        };
        return $http.post('/api/audit/log', logEntry)
          .catch(function(error) {
            console.error('Audit log failed', error);
          });
      };
      self.getAuditLogs = function(filters) {
        return $http.get('/api/audit/logs', {params: filters});
      };
    }]);
})();