(function () {
    "use strict";

    window.ErrorMockData = {
        serviceUnavailable: {
            code: "SERVICE_UNAVAILABLE",
            message: "We are unable to display your spending summary right now. Please try again later.",
            retryable: true
        },
        invalidMonth: {
            code: "INVALID_MONTH",
            message: "Please select a valid month.",
            retryable: false
        }
    };
}());
