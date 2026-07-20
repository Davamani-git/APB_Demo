(function () {
    "use strict";

    angular.module("app")
        .factory("ErrorModel", ErrorModelFactory);

    ErrorModelFactory.$inject = [];

    function ErrorModelFactory() {
        function ErrorModel(dto) {
            dto = dto || {};
            this.code = dto.code || "UNKNOWN";
            this.message = dto.message || "An unexpected error occurred.";
            this.correlationId = dto.correlationId || "";
            this.details = dto.details || "";
        }

        ErrorModel.prototype.isValid = function () {
            return !!this.code && !!this.message;
        };

        return ErrorModel;
    }
})();
