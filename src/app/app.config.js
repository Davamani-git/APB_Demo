(function(){'use strict';
  angular.module('apbApp').config(configApp);
  configApp.$inject = ['$routeProvider','$httpProvider'];
  function configApp($routeProvider,$httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
    $routeProvider
      .when('/dashboard',{templateUrl:'src/app/modules/analytics/controllers/dashboard.view.html',controller:'dashboardController',controllerAs:'vm'})
      .when('/data-infra',{templateUrl:'src/app/modules/data-infrastructure/controllers/dataInfra.view.html',controller:'dataInfraController',controllerAs:'vm'})
      .when('/admin/users',{templateUrl:'src/app/modules/admin/controllers/userManagement.view.html',controller:'userManagementController',controllerAs:'vm'})
      .when('/reports',{templateUrl:'src/app/modules/reporting/controllers/report.view.html',controller:'reportController',controllerAs:'vm'})
      .when('/access-denied',{template:'<div class="widget"><h2>Access Denied</h2><p>You do not have permission to view this resource.</p></div>'})
      .otherwise({redirectTo:'/dashboard'});
  }
})();
