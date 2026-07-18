(function() {
  'use strict';

  ErrorHandlingService.$inject = ['LoggingService'];

  function ErrorHandlingService(LoggingService) {
    var self = this;

    self.classifyHttpError = classifyHttpError;
    self.toUserMessage = toUserMessage;

    function classifyHttpError(response) {
      var status = response && response.status ? response.status : 0;
      var errorModel = {
        type: 'Unknown',
        messageKey: 'error.generic',
        recoverable: false,
        status: status
      };

      if (status >= 400 && status < 500) {
        errorModel.recoverable = false;
      } else if (status >= 500) {
        errorModel.recoverable = true;
      }

      switch (status) {
        case 400:
          errorModel.type = 'BadRequest';
          errorModel.messageKey = 'error.badRequest';
          break;
        case 401:
          errorModel.type = 'Unauthorized';
          errorModel.messageKey = 'error.unauthorized';
          break;
        case 403:
          errorModel.type = 'Forbidden';
          errorModel.messageKey = 'error.forbidden';
          break;
        case 404:
          errorModel.type = 'NotFound';
          errorModel.messageKey = 'error.noData';
          errorModel.recoverable = true;
          break;
        case 500:
          errorModel.type = 'ServerError';
          errorModel.messageKey = 'error.server';
          break;
        default:
          errorModel.type = 'Unknown';
          errorModel.messageKey = 'error.generic';
          break;
      }

      LoggingService.error('HTTP error classified', { errorModel: errorModel });

      return errorModel;
    }

    function toUserMessage(errorModel) {
      if (!errorModel || !errorModel.messageKey) {
        return 'We are currently unable to retrieve your summary. Please try again later.';
      }
      switch (errorModel.messageKey) {
        case 'error.badRequest':
          return 'The request could not be processed. Please refresh the page or contact support.';
        case 'error.unauthorized':
          return 'Your session has expired or you are not authenticated. Please sign in again.';
        case 'error.forbidden':
          return 'You are not authorized to view this credit card account summary.';
        case 'error.noData':
          return 'No summary data is available for the selected month.';
        case 'error.server':
          return 'We are currently unable to retrieve your summary due to a server error. Please try again later.';
        case 'error.generic':
        default:
          return 'We are currently unable to retrieve your summary. Please try again later.';
      }
    }
  }

  angular.module('davms.spendDashboard')
    .service('ErrorHandlingService', ErrorHandlingService);
})();
