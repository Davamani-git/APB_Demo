angular.module('fraudDetectionApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/alerts', {
      templateUrl: 'src/app/fraud-detection/views/alerts.view.html',
      controller: 'AlertController',
      controllerAs: 'vm'
    })
    .when('/dashboard', {
      templateUrl: 'src/app/fraud-detection/views/analytics-dashboard.view.html',
      controller: 'AnalyticsDashboardController',
      controllerAs: 'vm'
    })
    .when('/admin', {
      templateUrl: 'src/app/fraud-detection/views/threshold-admin.view.html',
      controller: 'ThresholdAdminController',
      controllerAs: 'vm'
    })
    .when('/monitor', {
      templateUrl: 'src/app/fraud-detection/views/transaction-monitor.view.html'
    })
    .otherwise({
      redirectTo: '/alerts'
    });
}]);