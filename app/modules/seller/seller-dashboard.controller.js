'use strict';

angular
  .module('rbacModule')
  .controller('SellerDashboardController', SellerDashboardController);

SellerDashboardController.$inject = ['$scope', 'RbacService'];

function SellerDashboardController($scope, RbacService) {
  $scope.features = {
    dashboardVisible: false,
    inventoryVisible: false,
    adminFeaturesVisible: false
  };

  RbacService
    .loadRolesForCurrentUser()
    .then(function onRolesLoaded() {
      $scope.features.dashboardVisible = RbacService.hasRole('seller');
      $scope.features.inventoryVisible = RbacService.canAccess('inventory:manage');
      $scope.features.adminFeaturesVisible = RbacService.hasRole('admin');
    })
    .catch(function onError() {
      $scope.features.dashboardVisible = false;
      $scope.features.inventoryVisible = false;
      $scope.features.adminFeaturesVisible = false;
    });
}
