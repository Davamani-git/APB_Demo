(function () {
  'use strict';

  HttpInterceptor.$inject = ['$q', '$injector', 'LoggingService', 'ErrorModel'];

  angular
    .module('app')
    .factory('HttpInterceptor', HttpInterceptor);

  function HttpInterceptor($q, $injector, LoggingService, ErrorModel) {
    var service = {
      request: onRequest,
      response: onResponse,
      responseError: onResponseError
    };

    return service;

    function onRequest(config) {
      var correlationId = config.headers['X-Correlation-ID'] || generateCorrelationId();
      config.headers['X-Correlation-ID'] = correlationId;
      LoggingService.debug('HTTP request', {
        method: config.method,
        url: config.url,
        correlationId: correlationId
      });
      return config;
    }

    function onResponse(response) {
      var correlationId = (response.config && response.config.headers && response.config.headers['X-Correlation-ID']) || '';
      LoggingService.debug('HTTP response', {
        status: response.status,
        url: response.config && response.config.url,
        correlationId: correlationId
      });
      return response;
    }

    function onResponseError(rejection) {
      var status = rejection.status || 0;
      var correlationId = (rejection.config && rejection.config.headers && rejection.config.headers['X-Correlation-ID']) || '';
      var type = mapErrorType(status);
      var retryable = status === 500 || status === 503 || status === 0;

      var message = 'An unexpected error occurred.';
      if (rejection.data && rejection.data.message) {
        message = rejection.data.message;
      }

      var errorModel = new ErrorModel({
        code: (rejection.data && rejection.data.code) || 'UNKNOWN_ERROR',
        message: message,
        httpStatus: status,
        type: type,
        retryable: retryable,
        correlationId: correlationId
      });

      LoggingService.error('HTTP error', {
        error: errorModel
      });

      return $q.reject(errorModel);
    }

    function mapErrorType(status) {
      switch (status) {
        case 400:
          return 'validation';
        case 401:
        case 403:
          return 'authorization';
        case 404:
          return 'not_found';
        case 500:
          return 'server';
        case 0:
        case 503:
          return 'network';
        default:
          return 'unknown';
      }
    }

    function generateCorrelationId() {
      return 'cid-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
    }
  }
})();
