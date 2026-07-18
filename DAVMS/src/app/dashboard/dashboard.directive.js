(function () {
  "use strict";

  dashboardDirective.$inject = [];

  function dashboardDirective() {
    return {
      restrict: "E",
      scope: {},
      bindToController: true,
      controller: "DashboardController",
      controllerAs: "vm",
      templateUrl: "app/dashboard/dashboard.template.html",
      transclude: false,
      replace: false
    };
  }

  angular
    .module("app.dashboard")
    .directive("davmsDashboard", dashboardDirective);
})();
