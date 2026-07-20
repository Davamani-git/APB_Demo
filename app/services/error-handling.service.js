(function () {
  'use strict';

  angular.module('apbDemo')
    .service('ErrorHandlingService', ErrorHandlingService);

  ErrorHandlingService.$inject = [];

  function ErrorHandlingService() {
    this.handleError = function (httpError, context) {
      var errorModel = {
        code: null,
        message: 'An unexpected error occurred.',
        details: '',
        correlationId: generateCorrelationId()
      };

      if (httpError) {
        if (httpError.status) {
          errorModel.code = httpError.status;
        }
        if (httpError.data && httpError.data.message) {
          errorModel.message = httpError.data.message;
        } else if (httpError.message && typeof httpError.message === 'string') {
          errorModel.message = httpError.message;
        }
        if (context) {
          errorModel.details = context;
        }
      }

      return errorModel;
    };

    this.createClientValidationError = function (message) {
      return {
        code: 'VALIDATION_ERROR',
        message: message || 'Validation error.',
        details: '',
        correlationId: generateCorrelationId()
      };
    };

    function generateCorrelationId() {
      return 'CID-' + Math.random().toString(36).substr(2, 9);
    }
  }
})();
