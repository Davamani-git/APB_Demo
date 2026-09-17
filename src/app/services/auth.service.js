angular.module('fraudDetectionModule').service('authService', ['$window', function($window) {
  this.getToken = function() {
    return $window.localStorage.getItem('authToken') || 'demo-token-12345';
  };
  this.setToken = function(token) {
    $window.localStorage.setItem('authToken', token);
  };
  this.clearToken = function() {
    $window.localStorage.removeItem('authToken');
  };
  this.isAuthenticated = function() {
    return !!this.getToken();
  };
}]);