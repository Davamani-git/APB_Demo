(function () {
    "use strict";

    function ErrorModel(data) {
        data = data || {};
        this.code = data.code || "";
        this.message = data.message || "";
        this.technicalMessage = data.technicalMessage || "";
        this.retryable = !!data.retryable;
    }

    angular.module("app")
        .factory("ErrorModel", function () {
            return ErrorModel;
        });
})();
