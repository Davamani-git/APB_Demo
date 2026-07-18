angular.module('davms.summary').service('AuthContextService', AuthContextService);

AuthContextService.$inject = ['ConfigService'];
function AuthContextService(ConfigService) {
  let token = null;

  this.initializeSession = function() {
    token = window.__DAVMS_TOKEN__ || null;
  };

  this.getToken = function() {
    return token;
  };

  this.isAuthenticated = function() {
    return !!token;
  };
}