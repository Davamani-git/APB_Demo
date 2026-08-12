angular.module('apbApp').service('userManagementService', ['$http', 'configService', function($http, configService) {
  var base = configService.get('apiBaseUrl') + '/users';
  this.listUsers = function() {
    return $http.get(base).then(function(res){ return res.data; });
  };
  this.createUser = function(user) {
    return $http.post(base, user).then(function(res){ return res.data; });
  };
  this.updateUser = function(userId, updates) {
    return $http.put(base + '/' + userId, updates).then(function(res){ return res.data; });
  };
  this.deleteUser = function(userId) {
    return $http.delete(base + '/' + userId).then(function(res){ return res.data; });
  };
  this.assignRole = function(userId, role) {
    return $http.post(base + '/' + userId + '/role', { role: role }).then(function(res){ return res.data; });
  };
  this.assignCompanies = function(userId, companyIds) {
    return $http.post(base + '/' + userId + '/companies', { companyIds: companyIds }).then(function(res){ return res.data; });
  };
}]);
