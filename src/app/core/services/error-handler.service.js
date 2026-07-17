(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .service('ErrorHandlerService', ErrorHandlerService);

  function ErrorHandlerService() {
    this.handleHttpError = function (httpError) {
      const status = httpError.status;
      let message = 'An unexpected error occurred.';
      let severity = 'ERROR';
      let retryable = false;

      if (status === 0) {
        message = 'Network error. Please check your connection and try again.';
        retryable = true;
      } else if (status === 400) {
        message = 'The request was invalid. Please review your input and try again.';
      } else if (status === 401) {
        message = 'Your session has expired. Please sign in again.';
      } else if (status === 403) {
        message = 'You are not authorized to perform this action.';
      } else if (status >= 500) {
        message = 'The service is temporarily unavailable. Please try again later.';
        retryable = true;
      }

      return {
        code: status,
        message: message,
        severity: severity,
        retryable: retryable
      };
    };

    this.handleClientError = function (error) {
      return {
        code: 'CLIENT_ERROR',
        message: error && error.message ? error.message : 'An unexpected error occurred.',
        severity: 'ERROR',
        retryable: false
      };
    };
  }
})();
