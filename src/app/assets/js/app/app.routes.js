(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .config(['$routeProvider', function($routeProvider){
      $routeProvider.when('/dashboard', {
        templateUrl: 'src/app/assets/js/app/dashboard/templates/dashboard-overview.view.html',
        controller: 'DashboardOverviewController',
        controllerAs: 'vm'
      });
    }]);
})();
