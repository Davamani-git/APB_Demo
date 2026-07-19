(function() {
  'use strict';

  ConfigService.$inject = ['$http', '$q', 'ENV_CONFIG', 'ConfigModel', 'ErrorModel', 'LoggingService'];

  function ConfigService($http, $q, ENV_CONFIG, ConfigModel, ErrorModel, LoggingService) {
    this.$http = $http;
    this.$q = $q;
    this.ENV_CONFIG = ENV_CONFIG;
    this.ConfigModel = ConfigModel;
    this.ErrorModel = ErrorModel;
    this.LoggingService = LoggingService;
  }

  ConfigService.prototype.getConfig = function() {
    var self = this;
    var deferred = self.$q.defer();

    if (self.ENV_CONFIG.useMockData) {
      self.LoggingService.info('Using mock config service');
      deferred.resolve();
      return deferred.promise.then(function() {
        return deferred.promise;
      });
    }

    var url = self.ENV_CONFIG.apiBaseUrl + '/spending-config';

    self.$http({
      method: 'GET',
      url: url,
      timeout: self.ENV_CONFIG.apiTimeoutMs,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      try {
        validateConfigResponse(response.data);
        var model = new self.ConfigModel().fromResponse(response.data);
        deferred.resolve(model);
      } catch (e) {
        var errModel = new self.ErrorModel().fromResponse({
          code: '500',
          message: 'Received invalid configuration data.'
        });
        self.LoggingService.error('Config response validation failed', { error: e && e.message });
        deferred.reject(errModel);
      }
    }).catch(function(error) {
      var data = (error && error.data) || {};
      var status = error && error.status ? String(error.status) : '';
      var defaultMessage = 'Unable to retrieve configuration at the moment.';
      var errModel = new self.ErrorModel().fromResponse({
        code: status || data.code,
        message: data.message || defaultMessage,
        correlationId: data.correlationId
      });
      self.LoggingService.error('Config API call failed', { code: errModel.code, correlationId: errModel.correlationId });
      deferred.reject(errModel);
    });

    return deferred.promise;
  };

  function validateConfigResponse(data) {
    if (!data) {
      throw new Error('Config response is empty');
    }
    if (typeof data.currencyCode !== 'string') {
      throw new Error('Invalid currencyCode in config response');
    }
  }

  angular.module('app')
    .service('ConfigService', ConfigService);
})();
