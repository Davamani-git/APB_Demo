(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .directive('inventoryAlert', ['InventoryService', function(InventoryService) {
      return {
        restrict: 'E',
        scope: {
          item: '='
        },
        templateUrl: 'src/app/modules/seller/directives/inventory-alert.template.html',
        link: function(scope, element, attrs) {
          scope.isLowStock = function() {
            return scope.item && scope.item.quantity <= scope.item.lowStockThreshold;
          };
          scope.getAlertClass = function() {
            if (scope.isLowStock()) {
              return 'alert-danger';
            }
            return 'alert-success';
          };
        }
      };
    }]);
})();