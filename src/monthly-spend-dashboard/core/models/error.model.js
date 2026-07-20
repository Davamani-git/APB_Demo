(function () {
  "use strict";

  class ErrorModel {
    constructor(data) {
      const src = data || {};
      this.code = typeof src.code === "string" ? src.code : "";
      this.message = typeof src.message === "string" ? src.message : "";
      this.details = typeof src.details === "object" && src.details !== null ? src.details : {};
      this.correlationId = typeof src.correlationId === "string" ? src.correlationId : "";
      this.retryable = typeof src.retryable === "boolean" ? src.retryable : false;
    }
  }

  angular
    .module("app")
    .value("ErrorModel", ErrorModel);
}());
