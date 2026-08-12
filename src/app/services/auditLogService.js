angular.module('apbApp').service('auditLogService', ['$http', 'configService', function($http, configService) {
  var base = configService.get('apiBaseUrl') + '/audit/logs';
  this.log = function(eventType, details) {
    return $http.post(base, { eventType: eventType, timestamp: new Date(), details: details || {} });
  };
}]);
