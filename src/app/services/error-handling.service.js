(function () {
    'use strict';

    angular.module('apbDemo')
        .service('ErrorHandlingService', ErrorHandlingService);

    ErrorHandlingService.$inject = [];

    function ErrorHandlingService() {
        var service = this;

        service.handleError = handleError;
        service.createClientValidationError = createClientValidationError;

        function handleError(httpError, context) {
            var errorModel = {
                code: null,
                message: 'An unexpected error occurred while loading data.',
                details: '',
                correlationId: ''
            };

            if (httpError) {
                if (httpError.status) {
                    errorModel.code = httpError.status;
                }
                if (httpError.data && httpError.data.message) {
                    errorModel.message = httpError.data.message;
                }
                errorModel.details = context || '';
                if (httpError.headers && httpError.headers('X-Correlation-Id')) {
                    errorModel.correlationId = httpError.headers('X-Correlation-Id');
                }
            }

            return errorModel;
        }

        function createClientValidationError(message) {
            return {
                code: 'CLIENT_VALIDATION_ERROR',
                message: message || 'Validation error occurred.',
                details: '',
                correlationId: ''
            };
        }
    }
})();
