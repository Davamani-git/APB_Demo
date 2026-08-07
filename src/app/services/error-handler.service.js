angular.module('apbDemo.services')
.factory('ErrorHandlerService', ['LoggingService', function(LoggingService) {
    function handleHttpError(response) {
        let errorModel = { code: 'UNKNOWN', message: 'An unexpected error occurred.' };
        if (response.status >= 500) {
            errorModel = { code: 'SERVER_ERROR', message: 'A server error occurred. Please try again later.' };
        } else if (response.status === 400) {
            errorModel = { code: 'BAD_REQUEST', message: 'Invalid request. Please check your inputs.' };
        } else if (response.status === 401 || response.status === 403) {
            errorModel = { code: 'AUTH_ERROR', message: 'You are not authorized to perform this action.' };
        }
        LoggingService.error(errorModel.message, { status: response.status, data: response.data });
        return errorModel;
    }

    return {
        handleHttpError: handleHttpError
    };
}]);