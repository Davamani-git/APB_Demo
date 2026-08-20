(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .factory('httpInterceptor', ['$q', '$injector', httpInterceptor]);

  function httpInterceptor($q, $injector) {
    let retryCount = {};
    return {
      request: function(config) {
        const token = sessionStorage.getItem('authToken') || 'demo-token-12345';
        config.headers = config.headers || {};
        config.headers['Authorization'] = 'Bearer ' + token;
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      requestError: function(rejection) {
        return $q.reject(rejection);
      },
      response: function(response) {
        if (retryCount[response.config.url]) {
          delete retryCount[response.config.url];
        }
        return response;
      },
      responseError: function(rejection) {
        const config = rejection.config;
        if (!config || !config.url) {
          return $q.reject(rejection);
        }
        if (rejection.status === 401 || rejection.status === 403) {
          console.error('Authentication failed:', rejection.status);
          return $q.reject(rejection);
        }
        if (rejection.status >= 500 || rejection.status === 0) {
          retryCount[config.url] = retryCount[config.url] || 0;
          if (retryCount[config.url] < 3) {
            retryCount[config.url]++;
            const delay = Math.pow(2, retryCount[config.url]) * 1000;
            return new Promise(function(resolve) {
              setTimeout(function() {
                const $http = $injector.get('$http');
                resolve($http(config));
              }, delay);
            });
          }
        }
        return $q.reject(rejection);
      }
    };
  }
})();