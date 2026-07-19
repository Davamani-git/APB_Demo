(function () {
  'use strict';

  HttpClientFactory.$inject = ['$http', 'configService'];

  function HttpClientFactory($http, configService) {
    function get(url, options) {
      return configService.getConfig().then(function (cfg) {
        var httpOptions = {
          method: 'GET',
          url: url,
          timeout: (options && options.timeout) || cfg.apiTimeoutMs,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        return $http(httpOptions);
      });
    }

    function post(url, data, options) {
      return configService.getConfig().then(function (cfg) {
        var httpOptions = {
          method: 'POST',
          url: url,
          data: data,
          timeout: (options && options.timeout) || cfg.apiTimeoutMs,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        return $http(httpOptions);
      });
    }

    return {
      get: get,
      post: post
    };
  }

  angular.module('app')
    .factory('httpClientFactory', HttpClientFactory);
})();
