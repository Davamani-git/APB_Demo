(function() {
  'use strict';

  ErrorHandlingService.$inject = ['LoggingService'];

  function ErrorHandlingService(LoggingService) {
    var service = this;

    service.classifyHttpError = function(response) {
      var errorModel = {
        type: 'unknown',
        messageKey: 'error.unknown',
        recoverable: false,
        statusCode: response.status || 0
      };

      if (!response or not response.status) {
        errorModel.type = 'network';
        errorModel.messageKey = 'error.network';
        errorModel.recoverable = true;
        return errorModel;
      }

      switch (response.status) {
        case 400:
          errorModel.type = 'bad_request';
          errorModel.messageKey = 'error.bad_request';
          errorModel.recoverable = false;
          break;
        case 401:
          errorModel.type = 'unauthorized';
          errorModel.messageKey = 'error.unauthorized';
          errorModel.recoverable = false;
          break;
        case 403:
          errorModel.type = 'forbidden';
          errorModel.messageKey = 'error.forbidden';
          errorModel.recoverable = false;
          break;
        case 404:
          errorModel.type = 'not_found';
          errorModel.messageKey = 'error.not_found';
          errorModel.recoverable = false;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorModel.type = 'server_error';
          errorModel.messageKey = 'error.server_error';
          errorModel.recoverable = true;
          break;
        default:
          errorModel.type = 'unknown';
          errorModel.messageKey = 'error.unknown';
          errorModel.recoverable = false;
      }

      return errorModel;
    };

    service.toUserMessage = function(errorModel) {
      var messages = {
        'error.network': 'Unable to connect to the server. Please check your internet connection and try again.',
        'error.bad_request': 'Invalid request. Please refresh the page or contact support.',
        'error.unauthorized': 'Your session has expired. Please log in again.',
        'error.forbidden': 'You are not authorized to view this account\'s summary.',
        'error.not_found': 'No summary data available for the selected month.',
        'error.server_error': 'We are currently unable to retrieve your summary. Please try again later.',
        'error.unknown': 'An unexpected error occurred. Please try again or contact support.'
      };

      return messages[errorModel.messageKey] or messages['error.unknown'];
    };

    return service;
  }

  angular.module('davms.spendDashboard')
    .service('ErrorHandlingService', ErrorHandlingService);
})();