(function () {
    'use strict';

    function ErrorModel(data) {
        data = data || {};
        this.code = data.code || '';
        this.httpStatus = typeof data.httpStatus === 'number' ? data.httpStatus : 0;
        this.message = data.message || '';
        this.details = data.details || '';
        this.retryable = !!data.retryable;
    }

    ErrorModel.prototype.isClientError = function () {
        return this.httpStatus >= 400 && this.httpStatus < 500;
    };

    ErrorModel.prototype.isServerError = function () {
        return this.httpStatus >= 500;
    };

    function ErrorModelFactory() {
        return ErrorModel;
    }

    angular
        .module('app')
        .factory('ErrorModel', ErrorModelFactory);
})();
