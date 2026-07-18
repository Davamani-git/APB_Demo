angular.module('davms.summary').config(routesConfig);

routesConfig.$inject = ['$routeProvider'];
function routesConfig($routeProvider) {
  $routeProvider
    .when('/summary', {
      templateUrl: 'features/summary/views/summary-dashboard.view.html',
      controller: 'SummaryDashboardController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/summary'
    });
}