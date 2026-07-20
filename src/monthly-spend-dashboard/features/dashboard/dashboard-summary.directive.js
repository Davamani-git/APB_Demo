(function () {
  "use strict";

  dashboardSummary.$inject = [];

  function dashboardSummary() {
    return {
      restrict: "E",
      scope: {
        summary: "<"
      },
      bindToController: true,
      controller: DashboardSummaryController,
      controllerAs: "vm",
      templateUrl: "features/dashboard/templates/dashboard-summary.html",
      transclude: false,
      replace: false
    };
  }

  DashboardSummaryController.$inject = [];

  function DashboardSummaryController() {
    var vm = this;

    vm.getFormattedTotal = function () {
      if (!vm.summary) {
        return "";
      }
      return vm.summary.currency + " " + vm.summary.totalSpend.toFixed(2);
    };
  }

  angular
    .module("app")
    .directive("dashboardSummary", dashboardSummary);
}());
