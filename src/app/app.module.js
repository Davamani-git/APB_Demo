angular.module('fraudDetectionModule', ['ngRoute', 'ngResource'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
    $routeProvider
      .when('/analytics', {
        templateUrl: 'src/app/fraud-detection/views/analytics.html',
        controller: 'analyticsController',
        controllerAs: 'vm'
      })
      .when('/alerts', {
        templateUrl: 'src/app/fraud-detection/views/alert-management.html',
        controller: 'alertManagementController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/analytics'
      });
  }]);