angular.module('fraudDetectionModule').factory('authInterceptor', ['$q', 'authService', function($q, authService) {
  return {
    request: function(config) {
      if (authService.isAuthenticated()) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + authService.getToken();
      }
      return config;
    },
    responseError: function(rejection) {
      if (rejection.status === 401) {
        authService.clearToken();
        window.location.href = '/login';
      }
      return $q.reject(rejection);
    }
  };
}]);