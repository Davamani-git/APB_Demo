(function () {
    "use strict";

    window.ErrorMockData = {
        SERVICE_UNAVAILABLE: {
            code: "SERVICE_UNAVAILABLE",
            message: "We are unable to display your spending summary right now. Please try again later.",
            retryable: true
        },
        INVALID_MONTH: {
            code: "INVALID_MONTH",
            message: "The selected month is not valid.",
            retryable: false
        }
    };
})();
