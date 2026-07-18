(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .factory('ErrorModel', ErrorModel);

  ErrorModel.$inject = ['APP_CONSTANTS'];

  function ErrorModel(APP_CONSTANTS) {
    function Error(data) {
      data = data || {};
      this.statusCode = data.statusCode || 0;
      this.technicalMessage = data.technicalMessage || '';
      this.userMessage = data.userMessage || 'An unexpected error occurred.';
      this.retryable = data.retryable !== undefined ? data.retryable : isRetryable(this.statusCode);
    }

    function isRetryable(statusCode) {
      return statusCode === APP_CONSTANTS.ERROR_CODES.SERVER_ERROR ||
             statusCode === APP_CONSTANTS.ERROR_CODES.BAD_REQUEST;
    }

    return Error;
  }
})();
