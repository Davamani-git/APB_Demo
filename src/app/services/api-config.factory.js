(function() {
  'use strict';
  angular.module('providerEnrollmentApp').factory('ApiConfigFactory', ['$window', ApiConfigFactory]);
  function ApiConfigFactory($window) {
    var config = {
      baseUrl: '/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return {
      getBaseUrl: function() { return config.baseUrl; },
      getTimeout: function() { return config.timeout; },
      getHeaders: function() { return config.headers; },
      getEndpoint: function(path) { return config.baseUrl + path; }
    };
  }
})();