(function () {
    'use strict';

    angular
        .module('app')
        .service('ErrorHandlerService', ErrorHandlerService);

    ErrorHandlerService.$inject = ['LoggingService'];

    function ErrorHandlerService(LoggingService) {
        this.handleError = function (httpError, userMessage) {
            var defaultMessage = 'An unexpected error occurred. Please try again later.';
            var errorModel = {
                code: 'UNKNOWN_ERROR',
                message: userMessage || defaultMessage,
                details: '',
                correlationId: ''
            };

            if (httpError && httpError.data) {
                errorModel.details = angular.isObject(httpError.data) ? JSON.stringify(httpError.data) : httpError.data;
            }

            if (httpError && httpError.status) {
                switch (httpError.status) {
                    case 400: errorModel.code = 'VALIDATION_ERROR'; break;
                    case 401: case 403: errorModel.code = 'AUTH_ERROR'; break;
                    case 404: errorModel.code = 'NOT_FOUND'; break;
                    case 429: errorModel.code = 'RATE_LIMIT'; break;
                    case 500: case 503: errorModel.code = 'SERVER_ERROR'; break;
                }
            }

            LoggingService.error(errorModel.message, { error: httpError, model: errorModel });
            return errorModel;
        };
    }
})();