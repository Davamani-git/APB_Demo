angular.module('davms.summary').factory('HttpInterceptorFactory', HttpInterceptorFactory);

HttpInterceptorFactory.$inject = ['$q', 'LoggingService', 'ErrorHandlingService', 'AuthContextService', 'ConfigService'];
function HttpInterceptorFactory($q, LoggingService, ErrorHandlingService, AuthContextService, ConfigService) {
  const apiBase = ConfigService.getApiBaseUrl();

  return {
    request: function(config) {
      if (config.url && config.url.indexOf(apiBase) === 0) {
        const token = AuthContextService.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = 'Bearer ' + token;
        }
      }
      return config;
    },

    response: function(response) {
      return response;
    },

    responseError: function(rejection) {
      const mapped = ErrorHandlingService.handleHttpError(rejection);
      LoggingService.warn('API_RESPONSE_ERROR', { mapped: mapped });
      return $q.reject(rejection);
    }
  };
}