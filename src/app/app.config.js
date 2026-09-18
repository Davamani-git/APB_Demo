(function() {
  'use strict';
  angular.module('providerEnrollmentApp').config(['$routeProvider', '$locationProvider', configRoutes]);
  function configRoutes($routeProvider, $locationProvider) {
    $routeProvider
      .when('/applications', {
        templateUrl: 'src/app/applications/application-list.view.html',
        controller: 'ApplicationListController',
        controllerAs: 'vm'
      })
      .when('/applications/:id', {
        templateUrl: 'src/app/applications/application-detail.view.html',
        controller: 'ApplicationDetailController',
        controllerAs: 'vm'
      })
      .when('/dashboard', {
        templateUrl: 'src/app/dashboard/dashboard.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/admin/rules', {
        templateUrl: 'src/app/admin/payer-rule-admin.view.html',
        controller: 'PayerRuleAdminController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/applications'
      });
    $locationProvider.hashPrefix('!');
  }
})();