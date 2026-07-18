(function () {
  "use strict";

  const APP_CONSTANTS = {
    routes: {
      dashboardMonthlySummary: "/dashboard/monthly-summary"
    },
    httpStatus: {
      ok: 200,
      badRequest: 400,
      unauthorized: 401,
      forbidden: 403,
      notFound: 404,
      internalServerError: 500
    },
    errorCodes: {
      invalidMonthFormat: "INVALID_MONTH_FORMAT",
      unsupportedProductType: "UNSUPPORTED_PRODUCT_TYPE",
      authorizationFailed: "AUTHORIZATION_FAILED",
      summaryNotFound: "SUMMARY_NOT_FOUND",
      backendError: "BACKEND_ERROR"
    }
  };

  angular
    .module("app")
    .constant("APP_CONSTANTS", APP_CONSTANTS);
})();
