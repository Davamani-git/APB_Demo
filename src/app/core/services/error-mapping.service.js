(function () {
  'use strict';

  ErrorMappingService.$inject = ['ErrorModel'];

  function ErrorMappingService(ErrorModel) {
    var service = {
      mapHttpError: mapHttpError
    };
    return service;

    function mapHttpError(rejection) {
      var status = rejection && rejection.status;
      var code = 'ERR_UNKNOWN';
      var message = 'An unexpected error occurred.';
      var retryable = false;

      if (status === 400) {
        code = 'ERR_BAD_REQUEST';
        message = 'The request was invalid. Please check your month selection and try again.';
      } else if (status === 401) {
        code = 'ERR_UNAUTHORIZED';
        message = 'Your session has expired. Please sign in again.';
      } else if (status === 403) {
        code = 'ERR_FORBIDDEN';
        message = 'You are not authorized to view this credit card summary.';
      } else if (status === 404) {
        code = 'ERR_NOT_FOUND';
        message = 'No summary is available for the selected month.';
      } else if (status >= 500) {
        code = 'ERR_SERVER_ERROR';
        message = 'We are unable to retrieve your summary at the moment. Please try again later.';
        retryable = true;
      }

      return new ErrorModel(code, status || null, message, null, retryable);
    }
  }

  angular.module('davmsApp')
    .service('ErrorMappingService', ErrorMappingService);
})();
