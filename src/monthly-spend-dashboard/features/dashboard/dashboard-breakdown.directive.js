(function () {
  "use strict";

  dashboardBreakdown.$inject = [];

  function dashboardBreakdown() {
    return {
      restrict: "E",
      scope: {
        breakdown: "<"
      },
      bindToController: true,
      controller: DashboardBreakdownController,
      controllerAs: "vm",
      templateUrl: "features/dashboard/templates/dashboard-breakdown.html",
      transclude: false,
      replace: false
    };
  }

  DashboardBreakdownController.$inject = [];

  function DashboardBreakdownController() {
    var vm = this;

    vm.hasBreakdown = function () {
      return vm.breakdown && Array.isArray(vm.breakdown.items) && vm.breakdown.items.length > 0;
    };
  }

  angular
    .module("app")
    .directive("dashboardBreakdown", dashboardBreakdown);
}());
