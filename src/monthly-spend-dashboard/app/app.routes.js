(function () {
  "use strict";

  configureRoutes.$inject = ["$routeProvider", "$locationProvider"];

  angular
    .module("app")
    .config(configureRoutes);

  function configureRoutes($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
      .when("/dashboard", {
        templateUrl: "features/dashboard/templates/dashboard.view.html",
        controller: "DashboardController",
        controllerAs: "vm"
      })
      .when("/dashboard/:month", {
        templateUrl: "features/dashboard/templates/dashboard.view.html",
        controller: "DashboardController",
        controllerAs: "vm"
      })
      .otherwise({
        redirectTo: "/dashboard"
      });
  }
}());
