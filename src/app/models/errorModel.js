(function () {
  'use strict';

  ErrorModel.$inject = [];

  function ErrorModel() {
    function create(raw) {
      return {
        code: raw && raw.code ? String(raw.code) : 'ERR_UNKNOWN',
        httpStatus: raw && raw.httpStatus ? Number(raw.httpStatus) : null,
        message: raw && raw.message ? String(raw.message) : 'An unexpected error occurred.',
        technicalMessage: raw && raw.technicalMessage ? String(raw.technicalMessage) : null,
        correlationId: raw && raw.correlationId ? String(raw.correlationId) : null,
        retryable: !!(raw && raw.retryable)
      };
    }

    return {
      create: create
    };
  }

  angular.module('app')
    .factory('ErrorModel', ErrorModel);
})();
