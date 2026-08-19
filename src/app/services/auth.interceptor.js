angular.module('fraudAlertApp')
  .factory('AuthInterceptor', ['$q', '$injector', function($q, $injector) {
    return {
      request: function(config) {
        var AuthService = $injector.get('AuthService');
        var token = AuthService.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          var AuthService = $injector.get('AuthService');
          AuthService.logout();
        }
        return $q.reject(rejection);
      }
    };
  }])
  .service('AuthService', [function() {
    this.getToken = function() {
      return sessionStorage.getItem('authToken') || 'mock-token-12345';
    };
    this.logout = function() {
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    };
  }]);