(function() {
  'use strict';

  SummaryService.$inject = ['$http', '$q', 'ENV_CONFIG', 'MonthlySummaryModel', 'ErrorModel', 'LoggingService'];

  function SummaryService($http, $q, ENV_CONFIG, MonthlySummaryModel, ErrorModel, LoggingService) {
    this.$http = $http;
    this.$q = $q;
    this.ENV_CONFIG = ENV_CONFIG;
    this.MonthlySummaryModel = MonthlySummaryModel;
    this.ErrorModel = ErrorModel;
    this.LoggingService = LoggingService;
  }

  SummaryService.prototype.getMonthlySummary = function(month) {
    var self = this;
    var deferred = self.$q.defer();

    if (self.ENV_CONFIG.useMockData) {
      if (self.ENV_CONFIG.featureFlags && self.ENV_CONFIG.featureFlags.simulateSummaryError) {
        var mockError = new self.ErrorModel().fromResponse({
          code: '500',
          message: 'Unable to retrieve spending summary (mock error).'
        });
        self.LoggingService.error('Mock summary error', { code: mockError.code });
        deferred.reject(mockError);
      } else {
        deferred.resolve();
      }
      return deferred.promise.then(function() {
        return self.$q(function(resolve, reject) {
          self.LoggingService.info('Using mock summary service', { month: month });
        }).then(function() {
          return self.$q.resolve();
        }).then(function() {
          return deferred.promise;
        });
      });
    }

    if (!validateMonth(month)) {
      var validationError = new self.ErrorModel().fromResponse({
        code: '400',
        message: 'Invalid month format. Please use YYYY-MM.'
      });
      self.LoggingService.warn('Client-side validation failed for month', { month: month });
      deferred.reject(validationError);
      return deferred.promise;
    }

    var url = self.ENV_CONFIG.apiBaseUrl + '/spending-summary?month=' + encodeURIComponent(month);

    self.$http({
      method: 'GET',
      url: url,
      timeout: self.ENV_CONFIG.apiTimeoutMs,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      try {
        validateSummaryResponse(response.data);
        var model = new self.MonthlySummaryModel().fromResponse(response.data);
        deferred.resolve(model);
      } catch (e) {
        var errModel = new self.ErrorModel().fromResponse({
          code: '500',
          message: 'Received invalid spending summary data.'
        });
        self.LoggingService.error('Summary response validation failed', { error: e && e.message });
        deferred.reject(errModel);
      }
    }).catch(function(error) {
      var data = (error && error.data) || {};
      var status = error && error.status ? String(error.status) : '';
      var defaultMessage;
      if (status === '404') {
        defaultMessage = 'No spending data available for the selected month.';
      } else if (status === '401' || status === '403') {
        defaultMessage = 'Your session has expired or you are not authorized to view this information.';
      } else {
        defaultMessage = 'Unable to retrieve spending summary at the moment.';
      }
      var errModel = new self.ErrorModel().fromResponse({
        code: status || data.code,
        message: data.message || defaultMessage,
        correlationId: data.correlationId
      });
      self.LoggingService.error('Summary API call failed', { code: errModel.code, correlationId: errModel.correlationId });
      deferred.reject(errModel);
    });

    return deferred.promise;
  };

  function validateMonth(month) {
    return typeof month === 'string' && /^\d{4}-\d{2}$/.test(month);
  }

  function validateSummaryResponse(data) {
    if (!data) {
      throw new Error('Summary response is empty');
    }
    if (typeof data.month !== 'string' || !/^\d{4}-\d{2}$/.test(data.month)) {
      throw new Error('Invalid month in summary response');
    }
    if (typeof data.totalSpend !== 'number' || data.totalSpend < 0) {
      throw new Error('Invalid totalSpend in summary response');
    }
    if (typeof data.transactionCount !== 'number' || data.transactionCount < 0) {
      throw new Error('Invalid transactionCount in summary response');
    }
  }

  angular.module('app')
    .service('SummaryService', SummaryService);
})();
