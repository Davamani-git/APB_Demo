(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .service('ApiGatewayService', ApiGatewayService);

  ApiGatewayService.$inject = ['$http', '$q', 'EnvConfig', 'AuthService', 'ErrorHandlerService'];

  function ApiGatewayService($http, $q, EnvConfig, AuthService, ErrorHandlerService) {
    this.get = function (baseKey, path, config) {
      return request('GET', baseKey, path, null, config);
    };

    this.post = function (baseKey, path, data, config) {
      return request('POST', baseKey, path, data, config);
    };

    this.put = function (baseKey, path, data, config) {
      return request('PUT', baseKey, path, data, config);
    };

    this.delete = function (baseKey, path, config) {
      return request('DELETE', baseKey, path, null, config);
    };

    function request(method, baseKey, path, data, config) {
      const baseUrl = resolveBaseUrl(baseKey);
      const url = baseUrl + path;
      const httpConfig = angular.extend({}, config || {}, {
        method: method,
        url: url,
        data: data
      });

      const token = AuthService.getToken();
      httpConfig.headers = httpConfig.headers || {};
      if (token) {
        httpConfig.headers.Authorization = 'Bearer ' + token;
      }

      return $http(httpConfig)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          const standardError = ErrorHandlerService.handleHttpError(error);
          return $q.reject(standardError);
        });
    }

    function resolveBaseUrl(baseKey) {
      switch (baseKey) {
        case 'INSIGHTS':
          return EnvConfig.INSIGHTS_API_BASE_URL;
        case 'REMINDERS':
          return EnvConfig.REMINDERS_API_BASE_URL;
        case 'LOGGING':
          return EnvConfig.LOGGING_API_BASE_URL;
        default:
          return '';
      }
    }
  }
})();
