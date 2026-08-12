angular.module('apbApp').service('authorizationService', ['authenticationService', '$q', '$http', 'configService', function(authenticationService, $q, $http, configService) {
  var self = this;
  self.getRole = function() { return (authenticationService.getClaims() || {}).role || null; };
  self.getAssignedCompanies = function() { return (authenticationService.getClaims() || {}).assignedCompanies || []; };
  self.loadUserPermissions = function() {
    return $http.get(configService.get('apiBaseUrl') + '/users/permissions').then(function(res) {
      self.permissions = res.data; return res.data;
    });
  };
  self.checkAccess = function(companyId) {
    if (self.getRole() === 'EnterpriseAdmin') { return $q.resolve(true); }
    var allowed = self.getAssignedCompanies().indexOf(companyId) !== -1;
    return allowed ? $q.resolve(true) : $q.reject('access_denied');
  };
  self.hasAccess = function(companyId) {
    return self.getRole() === 'EnterpriseAdmin' || self.getAssignedCompanies().indexOf(companyId) !== -1;
  };
}]);
