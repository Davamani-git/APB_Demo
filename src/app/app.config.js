angular.module('apbApp').config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  $httpProvider.interceptors.push('errorInterceptor');
  $routeProvider
    .when('/login', { templateUrl: 'src/app/security/login.html', controller: 'loginController', controllerAs: 'vm' })
    .when('/dashboard', { templateUrl: 'src/app/ai-integration/dashboard.html', controller: 'dashboardController', controllerAs: 'vm', resolve: { auth: ['routeGuard', function(g){ return g.requireAuth(); }] } })
    .when('/analytics', { templateUrl: 'src/app/analytics/analytics-dashboard.html', controller: 'analyticsDashboardController', controllerAs: 'vm', resolve: { auth: ['routeGuard', function(g){ return g.requireAuth(); }] } })
    .when('/reports', { templateUrl: 'src/app/analytics/reports.html', controller: 'reportController', controllerAs: 'vm', resolve: { auth: ['routeGuard', function(g){ return g.requireAuth(); }] } })
    .when('/users', { templateUrl: 'src/app/security/user-management.html', controller: 'userManagementController', controllerAs: 'vm', resolve: { auth: ['routeGuard', function(g){ return g.requireAdmin(); }] } })
    .otherwise({ redirectTo: '/dashboard' });
}]).run(['$rootScope', '$location', 'authenticationService', 'authorizationService', function($rootScope, $location, authenticationService, authorizationService) {
  $rootScope.authenticated = authenticationService.isAuthenticated();
  $rootScope.isAdmin = authorizationService.getRole() === 'EnterpriseAdmin';
  $rootScope.logout = function() { authenticationService.logout(); $rootScope.authenticated = false; $location.path('/login'); };
  $rootScope.$on('$routeChangeError', function() { $location.path('/login'); });
  $rootScope.$on('auth:changed', function() { $rootScope.authenticated = authenticationService.isAuthenticated(); $rootScope.isAdmin = authorizationService.getRole() === 'EnterpriseAdmin'; });
}]);
