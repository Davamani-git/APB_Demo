angular.module('apbApp').service('routeGuard', ['$q', 'authenticationService', 'authorizationService', function($q, authenticationService, authorizationService) {
  this.requireAuth = function() {
    return authenticationService.isAuthenticated() ? $q.resolve(true) : $q.reject('unauthenticated');
  };
  this.requireAdmin = function() {
    if (authenticationService.isAuthenticated() && authorizationService.getRole() === 'EnterpriseAdmin') { return $q.resolve(true); }
    return $q.reject('unauthorized');
  };
}]);
