(function () {
  'use strict';

  angular
    .module('apbDemo')
    .service('ErrorHandlingService', ErrorHandlingService);

  ErrorHandlingService.$inject = ['ModelFactory'];
  function ErrorHandlingService(ModelFactory) {
    this.handleError = handleError;
    this.createClientValidationError = createClientValidationError;

    function handleError(httpError, context) {
      var message = 'An unexpected error occurred';
      var code = '';
      var details = '';

      if (httpError && httpError.status) {
        code = httpError.status;
        if (httpError.status === 400) {
          message = 'The request was invalid. Please check your selection and try again.';
        } else if (httpError.status === 401 || httpError.status === 403) {
          message = 'You are not authorized to view this information.';
        } else if (httpError.status === 404) {
          message = 'No data is available for the selected month.';
        } else if (httpError.status === 429) {
          message = 'Too many requests. Please wait and try again later.';
        } else if (httpError.status >= 500) {
          message = 'The service is temporarily unavailable. Please try again later.';
        }
        details = (httpError.data && httpError.data.message) ? httpError.data.message : '';
      }

      return ModelFactory.createErrorModel({
        code: code,
        message: message,
        details: details,
        correlationId: (httpError && httpError.headers && httpError.headers('X-Correlation-Id')) || ''
      });
    }

    function createClientValidationError(message) {
      return ModelFactory.createErrorModel({
        code: 'CLIENT_VALIDATION',
        message: message,
        details: ''
      });
    }
  }
})();
