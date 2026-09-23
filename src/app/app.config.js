(function() {
  'use strict';
  angular.module('creditDashboardApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/dashboard/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/cards', {
        templateUrl: 'src/app/cards/views/cards.html',
        controller: 'CardsController',
        controllerAs: 'vm'
      })
      .when('/cards/:cardId', {
        templateUrl: 'src/app/cards/views/card-detail.html',
        controller: 'CardDetailController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/analytics/views/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
    $locationProvider.hashPrefix('');
  }]);
})();