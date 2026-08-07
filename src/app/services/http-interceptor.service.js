(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .factory('httpInterceptorService', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            $window.localStorage.removeItem('authToken');
            $window.localStorage.removeItem('user');
            $window.location.href = '#!/login';
          }
          if (rejection.status >= 400) {
            var errorMsg = rejection.data && rejection.data.message ? rejection.data.message : 'An error occurred';
            if (typeof toastr !== 'undefined') {
              toastr.error(errorMsg);
            }
            console.error('HTTP Error:', rejection);
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();