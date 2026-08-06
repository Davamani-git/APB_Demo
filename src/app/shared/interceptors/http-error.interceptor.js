(function() {
  'use strict';
  angular.module('app.shared')
    .factory('HttpErrorInterceptor', ['$q', 'NotificationService', function($q, NotificationService) {
      return {
        responseError: function(rejection) {
          var message = 'An error occurred';
          if (rejection.status === 401) {
            message = 'Unauthorized access. Please log in.';
          } else if (rejection.status === 403) {
            message = 'Access forbidden.';
          } else if (rejection.status === 404) {
            message = 'Resource not found.';
          } else if (rejection.status === 500) {
            message = 'Server error. Please try again later.';
          } else if (rejection.status === -1) {
            message = 'Network error. Please check your connection.';
          }
          NotificationService.error(message);
          return $q.reject(rejection);
        }
      };
    }]);
})();