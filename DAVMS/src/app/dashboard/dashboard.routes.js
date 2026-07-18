(function () {
  "use strict";

  dashboardRoutes.$inject = ["$routeProvider", "APP_CONSTANTS"];

  function dashboardRoutes($routeProvider, APP_CONSTANTS) {
    $routeProvider.when(APP_CONSTANTS.routes.dashboardMonthlySummary, {
      templateUrl: "app/dashboard/dashboard.template.html",
      controller: "DashboardController",
      controllerAs: "vm"
    });
  }

  angular
    .module("app.dashboard")
    .config(dashboardRoutes);
})();
