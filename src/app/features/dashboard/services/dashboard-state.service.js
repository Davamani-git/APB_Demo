(function () {
  'use strict';

  angular.module('app.dashboard')
    .service('dashboardStateService', [function () {
      var selectedMonth = null;
      var summary = null;
      var loading = false;
      var error = null;

      this.getSelectedMonth = function () {
        return selectedMonth;
      };

      this.setSelectedMonth = function (month) {
        selectedMonth = month;
      };

      this.getSummary = function () {
        return summary;
      };

      this.setSummary = function (value) {
        summary = value;
      };

      this.isLoading = function () {
        return loading;
      };

      this.setLoading = function (value) {
        loading = !!value;
      };

      this.getError = function () {
        return error;
      };

      this.setError = function (value) {
        error = value;
      };
    }]);
}());
