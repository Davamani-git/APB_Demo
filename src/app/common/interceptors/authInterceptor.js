angular.module('apbApp').factory('authInterceptor', ['$injector', function($injector) {
  return {
    request: function(cfg) {
      var auth = $injector.get('authenticationService');
      var token = auth.getToken();
      if (token) { cfg.headers = cfg.headers || {}; cfg.headers.Authorization = 'Bearer ' + token; }
      return cfg;
    }
  };
}]);
