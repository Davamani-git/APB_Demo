angular.module('apbApp').service('dataAccessService', ['authorizationService', '$http', '$q', 'configService', 'auditLogService', function(authorizationService, $http, $q, configService, auditLogService) {
  var base = configService.get('apiBaseUrl');
  this.getCompanyData = function(companyId) {
    return authorizationService.checkAccess(companyId).then(function() {
      auditLogService.log('data_access', { companyId: companyId });
      return $http.get(base + '/companies/' + companyId).then(function(res){ return res.data; });
    }, function() {
      auditLogService.log('access_denied', { companyId: companyId });
      return $q.reject('access_denied');
    });
  };
  this.filterAssigned = function(companyIds) {
    return (companyIds || []).filter(function(id){ return authorizationService.hasAccess(id); });
  };
}]);
