(function () {
  'use strict';

  angular
    .module('rbacModule', [])
    .config(rbacModuleConfig);

  rbacModuleConfig.$inject = ['$stateProvider'];

  function rbacModuleConfig($stateProvider) {
    $stateProvider.state('sellerDashboard', {
      url: '/seller/dashboard',
      templateUrl: 'src/app/modules/rbac/views/seller-dashboard.html',
      controller: 'SellerDashboardController',
      controllerAs: 'vm'
    });
  }
})();
