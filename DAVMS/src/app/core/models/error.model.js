(function () {
  "use strict";

  ErrorModel.$inject = [];

  function ErrorModel() {
    this.code = "";
    this.message = "";
    this.httpStatus = 0;
    this.details = {};
    this.retryable = false;
  }

  ErrorModel.prototype.fromResponse = function (response) {
    if (response && response.data) {
      this.code = response.data.code || "";
      this.message = response.data.message || "";
      this.httpStatus = response.status || 0;
      this.details = response.data.details || {};
      this.retryable = !!response.data.retryable;
    }
    return this;
  };

  ErrorModel.prototype.clone = function () {
    const clone = new ErrorModel();
    clone.code = this.code;
    clone.message = this.message;
    clone.httpStatus = this.httpStatus;
    clone.details = angular.copy(this.details);
    clone.retryable = this.retryable;
    return clone;
  };

  angular
    .module("app")
    .factory("ErrorModel", function () {
      return ErrorModel;
    });
})();
