angular.module('davms.summary').service('ErrorHandlingService', ErrorHandlingService);

ErrorHandlingService.$inject = ['LoggingService', '$window'];
function ErrorHandlingService(LoggingService, $window) {
  this.handleHttpError = function(response) {
    const status = response.status;
    let userMessage = 'An unexpected error occurred.';

    if (status === 400) {
      userMessage = 'Your request appears invalid. Please check your month selection.';
    } else if (status === 401) {
      userMessage = 'Your session has expired. Please sign in again.';
    } else if (status === 403) {
      userMessage = 'You are not authorized to view this account summary.';
    } else if (status === 404) {
      userMessage = 'No summary could be found for the selected month.';
    } else if (status >= 500) {
      userMessage = 'A server error occurred. Please try again later.';
    }

    const errorDescriptor = {
      code: status,
      userMessage: userMessage,
      severity: status >= 500 ? 'high' : 'normal'
    };

    LoggingService.error('HTTP_ERROR', { response: response, errorDescriptor: errorDescriptor });
    return errorDescriptor;
  };

  this.handleClientException = function(ex, context) {
    const errorDescriptor = {
      code: 'CLIENT_EXCEPTION',
      userMessage: 'Something went wrong while showing your summary.',
      severity: 'high'
    };

    LoggingService.error('CLIENT_EXCEPTION', { exception: ex, context: context });
    return errorDescriptor;
  };
}