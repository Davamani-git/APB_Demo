(function () {
    "use strict";

    angular.module("app")
        .factory("HttpErrorFactory", HttpErrorFactory);

    HttpErrorFactory.$inject = ["ErrorModel"];

    function HttpErrorFactory(ErrorModel) {
        return {
            fromHttpResponse: function (response) {
                var status = response && response.status ? response.status : 0;
                var data = response && response.data ? response.data : {};
                var code = data.code || status || "UNKNOWN";
                var message = data.message || getDefaultMessage(status);
                var correlationId = data.correlationId || "";
                var details = data.details || "";
                return new ErrorModel({
                    code: code,
                    message: message,
                    correlationId: correlationId,
                    details: details
                });
            }
        };

        function getDefaultMessage(status) {
            if (status === 400) {
                return "The request was invalid.";
            }
            if (status === 401) {
                return "You are not authorized to perform this action.";
            }
            if (status === 403) {
                return "You do not have permission to view this information.";
            }
            if (status === 404) {
                return "No data was found for the selected parameters.";
            }
            if (status === 429) {
                return "Too many requests. Please try again later.";
            }
            if (status === 500) {
                return "An unexpected server error occurred.";
            }
            if (status === 503) {
                return "The service is temporarily unavailable.";
            }
            return "An unexpected error occurred.";
        }
    }
})();
