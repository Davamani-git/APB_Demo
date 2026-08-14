angular.module('creditCardDashboardModule', ['ngRoute']);

angular.module('creditCardDashboardModule').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/dashboard', {
      templateUrl: 'src/app/modules/creditCardDashboard/views/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/dashboard'
    });
  $locationProvider.hashPrefix('');
}]);