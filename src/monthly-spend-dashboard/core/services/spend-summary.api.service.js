(function () {
  "use strict";

  SpendSummaryApiService.$inject = ["$http", "$q", "EnvConfigService", "LoggingService", "SpendSummaryModel", "KpiSummaryModel", "SpendBreakdownModel", "ErrorModel"];

  function SpendSummaryApiService($http, $q, EnvConfigService, LoggingService, SpendSummaryModel, KpiSummaryModel, SpendBreakdownModel, ErrorModel) {
    this.getMonthlySummary = function (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        var invalidError = new ErrorModel({
          code: "400",
          message: "Invalid month format. Expected YYYY-MM.",
          details: { month: month },
          retryable: false
        });
        return $q.reject(invalidError);
      }

      var url = EnvConfigService.getApiBaseUrl();
      var timeout = EnvConfigService.getApiTimeoutMs();

      var config = {
        params: { month: month },
        timeout: timeout
      };

      LoggingService.info("Calling Monthly Spend Summary API", { url: url, month: month });

      return $http.get(url, config)
        .then(function (response) {
          var data = response.data || {};

          var summary = new SpendSummaryModel(data.summary);
          var kpis = new KpiSummaryModel(data.kpis);
          var breakdown = new SpendBreakdownModel(data.breakdown);

          return {
            summary: summary,
            kpis: kpis,
            breakdown: breakdown
          };
        })
        .catch(function (error) {
          var status = error.status || 500;
          var message;
          var retryable = false;

          if (status === 400) {
            message = "Invalid request for monthly summary.";
          } else if (status === 401) {
            message = "You are not authorized. Please sign in again.";
          } else if (status === 403) {
            message = "You are not allowed to view this summary.";
          } else if (status === 404) {
            message = "Monthly summary not found for the requested month.";
          } else if (status === 503) {
            message = "Monthly summary is temporarily unavailable.";
            retryable = true;
          } else {
            message = "An unexpected error occurred while retrieving the monthly summary.";
          }

          var errorModel = new ErrorModel({
            code: String(status),
            message: message,
            details: { httpError: error },
            retryable: retryable
          });

          LoggingService.error("Monthly Spend Summary API call failed", { error: errorModel });

          return $q.reject(errorModel);
        });
    };
  }

  angular
    .module("app")
    .service("SpendSummaryApiService", SpendSummaryApiService);
}());
