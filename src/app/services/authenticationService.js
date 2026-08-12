angular.module('apbApp').service('authenticationService', ['$localStorage', '$rootScope', 'ssoAuthService', function($localStorage, $rootScope, ssoAuthService) {
  var self = this;
  self.storeToken = function(jwt) {
    $localStorage.jwt = jwt;
    self.claims = self.decode(jwt);
    $localStorage.claims = self.claims;
    $rootScope.$broadcast('auth:changed');
    return self.claims;
  };
  self.decode = function(jwt) {
    try {
      var payload = jwt.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch (e) { return {}; }
  };
  self.getToken = function() { return $localStorage.jwt || null; };
  self.getClaims = function() { return $localStorage.claims || self.claims || {}; };
  self.isAuthenticated = function() {
    var t = self.getToken();
    if (!t) { return false; }
    var c = self.getClaims();
    if (c && c.exp && (c.exp * 1000) < Date.now()) { self.logout(); return false; }
    return true;
  };
  self.login = function() { return ssoAuthService.handleCallback().then(function(jwt) { return self.storeToken(jwt); }); };
  self.logout = function() { delete $localStorage.jwt; delete $localStorage.claims; self.claims = null; $rootScope.$broadcast('auth:changed'); };
}]);
