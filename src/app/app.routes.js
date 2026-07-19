(function () {
  "use strict";

  appRoutes.$inject = ["$routeProvider"];

  function appRoutes($routeProvider) {
    $routeProvider
      .when("/spending-dashboard", {
        templateUrl: "src/spending-dashboard/components/dashboard/spending-dashboard.template.html",
        controller: "SpendingDashboardController",
        controllerAs: "vm"
      })
      .otherwise({
        redirectTo: "/spending-dashboard"
      });
  }

  angular.module("app")
    .config(appRoutes);
})();
