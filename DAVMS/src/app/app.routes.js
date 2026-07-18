(function () {
  "use strict";

  routes.$inject = ["$routeProvider", "$locationProvider"];

  function routes($routeProvider, $locationProvider) {
    // Optional: use hash-bang mode without HTML5 pushState for compatibility
    $locationProvider.hashPrefix("");

    // Default route is the monthly spending summary dashboard
    $routeProvider.otherwise({
      redirectTo: "/dashboard/monthly-summary"
    });
  }

  angular
    .module("app")
    .config(routes);
})();
