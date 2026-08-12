angular.module('apbApp').factory('errorInterceptor', ['$q', '$injector', function($q, $injector) {
  return {
    responseError: function(rejection) {
      var notification = $injector.get('notificationService');
      if (rejection.status === 401 || rejection.status === 403) {
        var auth = $injector.get('authenticationService');
        auth.logout();
        notification.error('Session expired or access denied. Please log in.');
      } else {
        notification.error('Request failed: ' + (rejection.status || 'network error'));
      }
      if (window.console) { console.error('API error', rejection); }
      return $q.reject(rejection);
    }
  };
}]);
