(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('rbacService', ['$http', '$q', 'authService', 'auditService', function($http, $q, authService, auditService) {
      var self = this;
      var permissionsCache = null;
      self.fetchUserPermissions = function(userId) {
        if (permissionsCache) {
          return $q.resolve(permissionsCache);
        }
        return $http.get('/api/users/' + userId + '/permissions')
          .then(function(response) {
            permissionsCache = response.data;
            return permissionsCache;
          });
      };
      self.hasRole = function(role) {
        var user = authService.getCurrentUser();
        return user && user.role === role;
      };
      self.hasPermission = function(permission) {
        var user = authService.getCurrentUser();
        if (!user || !user.permissions) return false;
        return user.permissions.indexOf(permission) !== -1;
      };
      self.checkPermission = function(permission) {
        var deferred = $q.defer();
        if (self.hasPermission(permission)) {
          deferred.resolve(true);
        } else {
          auditService.logAccess(authService.getCurrentUser().id, permission, false);
          deferred.reject('Access denied');
        }
        return deferred.promise;
      };
      self.canAccessCompany = function(companyId) {
        var user = authService.getCurrentUser();
        if (!user) return false;
        if (user.role === 'GP' || user.role === 'LP') return true;
        return user.companyAssignments && user.companyAssignments.indexOf(companyId) !== -1;
      };
      self.clearCache = function() {
        permissionsCache = null;
      };
    }]);
})();