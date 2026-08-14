angular.module('creditCardDashboardModule').factory('AuthFactory', ['$http', '$window', function($http, $window) {
  var factory = {};
  
  factory.getToken = function() {
    return $window.localStorage.getItem('authToken') || 'demo-token-12345';
  };
  
  factory.setToken = function(token) {
    $window.localStorage.setItem('authToken', token);
  };
  
  factory.clearToken = function() {
    $window.localStorage.removeItem('authToken');
  };
  
  factory.isAuthenticated = function() {
    return !!factory.getToken();
  };
  
  return factory;
}]);

angular.module('creditCardDashboardModule').config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(['AuthFactory', '$q', '$window', function(AuthFactory, $q, $window) {
    return {
      request: function(config) {
        if (AuthFactory.isAuthenticated()) {
          config.headers.Authorization = 'Bearer ' + AuthFactory.getToken();
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          AuthFactory.clearToken();
          $window.location.href = '#/login';
        }
        return $q.reject(rejection);
      }
    };
  }]);
}]);