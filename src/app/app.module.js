angular.module('fraudAlertApp', ['ngRoute', 'ui.bootstrap', 'fraudAlert.ingestion', 'fraudAlert.dashboard'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/fraud-alert/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
    $httpProvider.interceptors.push('AuthInterceptor');
  }])
  .constant('API_CONFIG', {
    baseUrl: '/api',
    fraudRiskUrl: '/api/fraud-risk/evaluate',
    alertsUrl: '/api/alerts',
    auditUrl: '/api/audit/log',
    configUrl: '/api/config/thresholds'
  });