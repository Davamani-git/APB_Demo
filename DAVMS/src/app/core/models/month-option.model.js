(function () {
  "use strict";

  MonthOption.$inject = [];

  function MonthOption(value, label, isCurrent) {
    this.value = value || "";
    this.label = label || "";
    this.isCurrent = !!isCurrent;
  }

  MonthOption.prototype.isValidFormat = function () {
    return /^\d{4}-\d{2}$/.test(this.value);
  };

  angular
    .module("app")
    .factory("MonthOption", function () {
      return MonthOption;
    });
})();
