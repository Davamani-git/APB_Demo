angular.module('apbApp').service('dashboardConfigService', ['$http', 'configService', function($http, configService) {
  var base = configService.get('apiBaseUrl') + '/dashboard/config';
  this.saveLayout = function(userId, layout) {
    return $http.post(base, { userId: userId, layout: layout }).then(function(res){ return res.data; });
  };
  this.loadLayout = function(userId) {
    return $http.get(base, { params: { userId: userId } }).then(function(res){ return res.data; });
  };
}]);
