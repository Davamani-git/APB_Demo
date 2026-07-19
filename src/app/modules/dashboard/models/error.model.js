(function () {
    'use strict';

    ErrorModel.$inject = [];

    function ErrorModel() {
        function create(code, message, details, correlationId) {
            return {
                code: code,
                message: message,
                details: details,
                correlationId: correlationId
            };
        }

        return {
            create: create
        };
    }

    angular.module('app')
        .service('ErrorModel', ErrorModel);

})();
