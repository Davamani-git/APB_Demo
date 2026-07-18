(function () {
  'use strict';

  function ErrorModel(code, httpStatus, message, details, retryable) {
    this.code = code || 'ERR_UNKNOWN';
    this.httpStatus = typeof httpStatus === 'number' ? httpStatus : null;
    this.message = message || 'An unexpected error occurred.';
    this.details = details || null;
    this.retryable = !!retryable;
  }

  angular.module('davmsApp')
    .factory('ErrorModel', function () {
      return ErrorModel;
    });
})();
