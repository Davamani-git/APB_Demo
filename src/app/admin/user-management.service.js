(function() {
  'use strict';
  angular.module('shoppingPlatform').service('UserManagementService', ['$http', 'API_CONFIG', 'RBACService', function($http, API_CONFIG, RBACService) {
    this.getUsers = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/admin/users', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data || [];
      });
    };
    this.getUserDetails = function(userId) {
      return $http.get(API_CONFIG.baseUrl + '/api/admin/users/' + userId, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.updateUserRole = function(userId, role) {
      return $http.put(API_CONFIG.baseUrl + '/api/admin/users/' + userId + '/role', { role: role }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.updateUserStatus = function(userId, status) {
      return $http.put(API_CONFIG.baseUrl + '/api/admin/users/' + userId + '/status', { status: status }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.suspendUser = function(userId) {
      return this.updateUserStatus(userId, 'suspended');
    };
    this.deleteUser = function(userId) {
      return $http.delete(API_CONFIG.baseUrl + '/api/admin/users/' + userId, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();