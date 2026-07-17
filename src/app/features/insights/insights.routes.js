(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .config(insightsRoutes);

  insightsRoutes.$inject = ['$routeProvider'];

  function insightsRoutes($routeProvider) {
    $routeProvider
      .when('/insights', {
        templateUrl: 'src/app/features/insights/views/insights-dashboard.html',
        controller: 'InsightsDashboardController',
        controllerAs: 'vm'
      })
      .when('/insights/:id', {
        templateUrl: 'src/app/features/insights/views/insights-detail.html',
        controller: 'InsightsDetailController',
        controllerAs: 'vm'
      });
  }
})();
