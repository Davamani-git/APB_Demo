(function() {
  'use strict';
  angular.module('creditCardDashboard')
    .factory('httpInterceptor', ['$q', '$injector', function($q, $injector) {
      return {
        request: function(config) {
          var token = localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401 || rejection.status === 403) {
            var $location = $injector.get('$location');
            $location.path('/login');
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();