(function () {
  'use strict';

  angular.module('apbDemo')
    .service('ErrorHandlingService', ErrorHandlingService);

  ErrorHandlingService.$inject = [];

  function ErrorHandlingService() {
    var service = this;

    service.handleError = handleError;
    service.createClientValidationError = createClientValidationError;

    function handleError(httpError, context) {
      var code = (httpError && httpError.status) ? httpError.status : 'UNKNOWN';
      var message;

      switch (code) {
        case 400:
          message = 'The request was not valid. Please review your selection.';
          break;
        case 401:
        case 403:
          message = 'You are not authorized to view this information.';
          break;
        case 404:
          message = 'No data is available for the selected month.';
          break;
        case 429:
          message = 'Too many requests. Please try again in a few moments.';
          break;
        case 500:
          message = 'We are currently unable to retrieve your data. Please try again later.';
          break;
        default:
          message = 'An unexpected error occurred while loading your dashboard.';
      }

      var errorModel = {
        code: code,
        message: message,
        details: context || '',
        correlationId: generateCorrelationId()
      };

      return errorModel;
    }

    function createClientValidationError(message) {
      return {
        code: 'CLIENT_VALIDATION',
        message: message,
        details: '',
        correlationId: generateCorrelationId()
      };
    }

    function generateCorrelationId() {
      return 'CID-' + Math.random().toString(36).substr(2, 9);
    }
  }
})();
