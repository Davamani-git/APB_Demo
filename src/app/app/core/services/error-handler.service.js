(function () {
  'use strict';

  angular
    .module('ccd.core')
    .factory('errorHandlerService', [
      'loggingService',
      function (loggingService) {
        function ErrorModel(data) {
          this.code = data && data.code ? data.code : 'CCD-UNKNOWN';
          this.message = data && data.message ? data.message : 'An unexpected error occurred.';
          this.details = data && data.details ? data.details : null;
          this.correlationId = data && data.correlationId ? data.correlationId : null;
          this.httpStatus = data && data.httpStatus ? data.httpStatus : null;
        }

        function handleHttpError(rejection) {
          var status = rejection && rejection.status;
          var body = rejection && rejection.data ? rejection.data : {};
          var code = body.code || 'CCD-HTTP-' + (status || '0');
          var correlationId = body.correlationId || null;
          var message;

          if (status === 400) {
            message = 'Invalid input; please adjust your selection.';
          } else if (status === 401) {
            message = 'Your session has expired or you are not authorized. Please sign in again.';
          } else if (status === 403) {
            message = 'You are not authorized to view this dashboard.';
          } else if (status === 429) {
            message = 'Too many requests; please try again shortly.';
          } else if (status >= 500 && status < 600) {
            message = 'We are currently unable to load the dashboard. Please try again later.';
          } else {
            message = 'An unexpected error occurred while loading the dashboard.';
          }

          var errorModel = new ErrorModel({
            code: code,
            message: message,
            details: null,
            correlationId: correlationId,
            httpStatus: status
          });

          loggingService.error('HTTP error handled', { status: status }, errorModel);
          return errorModel;
        }

        function handleClientError(error) {
          var errorModel = new ErrorModel({
            code: 'CCD-CLI-000',
            message: 'An unexpected client error occurred.',
            details: null,
            httpStatus: null
          });
          loggingService.error('Client error', {}, error);
          return errorModel;
        }

        function getUserMessage(errorModel) {
          return errorModel && errorModel.message ? errorModel.message : '';
        }

        return {
          handleHttpError: handleHttpError,
          handleClientError: handleClientError,
          getUserMessage: getUserMessage
        };
      }
    ]);
})();
