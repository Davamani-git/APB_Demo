(function() {
  'use strict';

  class ErrorModel {
    constructor({
      code = '',
      httpStatus = null,
      message = '',
      details = null,
      retryable = false
    } = {}) {
      this.code = code;
      this.httpStatus = httpStatus;
      this.message = message;
      this.details = details;
      this.retryable = retryable;
    }
  }

  angular.module('davmsMonthlySummary')
    .factory('ErrorModel', function() {
      return ErrorModel;
    });
})();
