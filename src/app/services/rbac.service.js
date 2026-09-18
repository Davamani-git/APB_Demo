(function() {
  'use strict';
  angular.module('dashboardModule').service('rbacService', ['authService', '$http', function(authService, $http) {
    var self = this;
    var currentUser = null;
    self.loadUserPermissions = function() {
      return $http.get('/api/user/permissions').then(function(response) {
        currentUser = response.data;
        return currentUser;
      }).catch(function(error) {
        throw error;
      });
    };
    self.hasPermission = function(permission) {
      if (!currentUser || !currentUser.permissions) return false;
      return currentUser.permissions.indexOf(permission) !== -1;
    };
    self.canAccessCompany = function(companyId) {
      if (!currentUser || !currentUser.assignedCompanies) return false;
      return currentUser.assignedCompanies.indexOf(companyId) !== -1;
    };
    self.getCurrentUser = function() {
      return currentUser;
    };
    self.isRole = function(role) {
      if (!currentUser) return false;
      return currentUser.role === role;
    };
  }]);
})();