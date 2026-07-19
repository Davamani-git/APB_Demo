(function () {
    'use strict';

    function ErrorModel(data) {
        this.code = data.code;
        this.message = data.message;
        this.technicalMessage = data.technicalMessage || null;
        this.retryable = !!data.retryable;
    }

    angular.module('app')
        .factory('ErrorModel', ErrorModelFactory);

    ErrorModelFactory.$inject = [];

    function ErrorModelFactory() {
        return function (data) {
            return new ErrorModel(data || {});
        };
    }
})();
