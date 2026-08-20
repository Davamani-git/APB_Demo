(function () {
  'use strict';

  angular
    .module('rbacModule')
    .controller('SellerDashboardController', SellerDashboardController);

  SellerDashboardController.$inject = ['RbacService'];

  function SellerDashboardController(RbacService) {
    var vm = this;

    vm.roles = [];
    vm.canAccessInventory = false;

    activate();

    function activate() {
      RbacService.getCurrentUserRoles().then(function (data) {
        vm.roles = data.roles || [];
        vm.canAccessInventory = RbacService.hasRole(vm.roles, 'seller');
      });
    }
  }
})();
