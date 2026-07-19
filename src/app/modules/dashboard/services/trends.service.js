(function() {
  'use strict';

  TrendsService.$inject = ['$http', '$q', 'ENV_CONFIG', 'SixMonthTrendModel', 'ErrorModel', 'LoggingService'];

  function TrendsService($http, $q, ENV_CONFIG, SixMonthTrendModel, ErrorModel, LoggingService) {
    this.$http = $http;
    this.$q = $q;
    this.ENV_CONFIG = ENV_CONFIG;
    this.SixMonthTrendModel = SixMonthTrendModel;
    this.ErrorModel = ErrorModel;
    this.LoggingService = LoggingService;
  }

  TrendsService.prototype.getSixMonthTrends = function() {
    var self = this;
    var deferred = self.$q.defer();

    if (self.ENV_CONFIG.useMockData) {
      if (self.ENV_CONFIG.featureFlags && self.ENV_CONFIG.featureFlags.simulateTrendsError) {
        var mockError = new self.ErrorModel().fromResponse({
          code: '500',
          message: 'Unable to retrieve spending trends (mock error).'
        });
        self.LoggingService.error('Mock trends error', { code: mockError.code });
        deferred.reject(mockError);
      } else {
        deferred.resolve();
      }
      return deferred.promise.then(function() {
        return self.$q(function(resolve, reject) {
          self.LoggingService.info('Using mock trends service');
        }).then(function() {
          return deferred.promise;
        });
      });
    }

    var url = self.ENV_CONFIG.apiBaseUrl + '/spending-trends?range=6m';

    self.$http({
      method: 'GET',
      url: url,
      timeout: self.ENV_CONFIG.apiTimeoutMs,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      try {
        validateTrendsResponse(response.data);
        var model = new self.SixMonthTrendModel().fromResponse(response.data);
        deferred.resolve(model);
      } catch (e) {
        var errModel = new self.ErrorModel().fromResponse({
          code: '500',
          message: 'Received invalid spending trend data.'
        });
        self.LoggingService.error('Trends response validation failed', { error: e && e.message });
        deferred.reject(errModel);
      }
    }).catch(function(error) {
      var data = (error && error.data) || {};
      var status = error && error.status ? String(error.status) : '';
      var defaultMessage;
      if (status === '404') {
        defaultMessage = 'No spending trend data available for the selected period.';
      } else if (status === '401' || status === '403') {
        defaultMessage = 'Your session has expired or you are not authorized to view this information.';
      } else {
        defaultMessage = 'Unable to retrieve spending trends at the moment.';
      }
      var errModel = new self.ErrorModel().fromResponse({
        code: status || data.code,
        message: data.message || defaultMessage,
        correlationId: data.correlationId
      });
      self.LoggingService.error('Trends API call failed', { code: errModel.code, correlationId: errModel.correlationId });
      deferred.reject(errModel);
    });

    return deferred.promise;
  };

  function validateTrendsResponse(data) {
    if (!data) {
      throw new Error('Trends response is empty');
    }
    if (!Array.isArray(data.points)) {
      throw new Error('Trends response points must be an array');
    }
    if (data.points.length > 6) {
      throw new Error('Trends response contains more than 6 points');
    }
    data.points.forEach(function(point) {
      if (typeof point.month !== 'string' || !/^\d{4}-\d{2}$/.test(point.month)) {
        throw new Error('Invalid month in trends response');
      }
      if (typeof point.totalSpend !== 'number' || point.totalSpend < 0) {
        throw new Error('Invalid totalSpend in trends response');
      }
      if (typeof point.transactionCount !== 'number' || point.transactionCount < 0) {
        throw new Error('Invalid transactionCount in trends response');
      }
    });
  }

  angular.module('app')
    .service('TrendsService', TrendsService);
})();
