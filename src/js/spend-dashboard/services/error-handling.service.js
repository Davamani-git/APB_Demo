(function () {
  'use strict';

  ErrorHandlingService.$inject = ['LoggingService'];

  function ErrorHandlingService(LoggingService) {
    var self = this;

    self.classifyHttpError = function (response) {
      var status = response && response.status;
      var type;
      var messageKey;
      var recoverable = false;

      if (status === 400) {
        type = 'BAD_REQUEST';
        messageKey = 'error.badRequest';
        recoverable = false;
      } else if (status === 401) {
        type = 'UNAUTHORIZED';
        messageKey = 'error.unauthorized';
        recoverable = false;
      } else if (status === 403) {
        type = 'FORBIDDEN';
        messageKey = 'error.forbidden';
        recoverable = false;
      } else if (status === 404) {
        type = 'NOT_FOUND';
        messageKey = 'error.noDataForMonth';
        recoverable = true;
      } else if (status >= 500) {
        type = 'SERVER_ERROR';
        messageKey = 'error.serverError';
        recoverable = true;
      } else {
        type = 'UNKNOWN';
        messageKey = 'error.generic';
        recoverable = true;
      }

      var errorModel = {
        type: type,
        messageKey: messageKey,
        recoverable: recoverable,
        status: status
      };

      LoggingService.error('HTTP error classified', errorModel);

      return errorModel;
    };

    self.toUserMessage = function (errorModel) {
      if (!errorModel) {
        return 'An unexpected error occurred while retrieving your monthly summary.';
      }

      switch (errorModel.messageKey) {
        case 'error.badRequest':
          return 'We could not process the request for your monthly summary. Please refresh the page or try again later.';
        case 'error.unauthorized':
          return 'Your session has expired or you are not authenticated. Please log in again to view your monthly summary.';
        case 'error.forbidden':
          return 'You are not authorized to view the spending summary for this account.';
        case 'error.noDataForMonth':
          return 'There is no spending activity for the selected month. No summary data is available.';
        case 'error.serverError':
          return 'We are currently unable to retrieve your spending summary. Please try again later.';
        case 'error.generic':
        default:
          return 'We encountered an issue while retrieving your spending summary. Please try again.';
      }
    };
  }

  angular.module('davms.spendDashboard')
    .service('ErrorHandlingService', ErrorHandlingService);
})();
