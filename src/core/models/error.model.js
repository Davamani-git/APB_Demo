(function () {
  "use strict";

  function ErrorModelFactory() {
    class ErrorModel {
      constructor(httpError) {
        var source = httpError || {};
        this.status = source.status || 0;
        this.code = source.data && source.data.code ? source.data.code : "UNKNOWN_ERROR";
        this.message = source.data && source.data.message ? source.data.message : "An unexpected error occurred.";
        this.retryable = this.status >= 500;
      }

      getUserMessage() {
        if (this.status === 0) {
          return "Network error. Please check your connection and try again.";
        }
        if (this.status === 400) {
          return "The requested data could not be retrieved due to invalid input.";
        }
        if (this.status === 401 || this.status === 403) {
          return "You are not authorized to view this information.";
        }
        if (this.status === 404) {
          return "No spending data found for the selected month.";
        }
        if (this.status >= 500) {
          return "We are experiencing technical difficulties. Please try again later.";
        }
        return this.message;
      }
    }

    return ErrorModel;
  }

  angular.module("app")
    .factory("ErrorModel", ErrorModelFactory);
})();
