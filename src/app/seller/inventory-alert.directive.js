(function() {
  'use strict';
  angular.module('shoppingPlatform').directive('inventoryAlert', ['InventoryService', function(InventoryService) {
    return {
      restrict: 'E',
      scope: {
        productId: '=',
        currentStock: '=',
        threshold: '='
      },
      template: '<span ng-if="showAlert" class="alert-badge" style="margin-left: 5px;">!</span>',
      link: function(scope, element, attrs) {
        scope.$watch('currentStock', function(newVal) {
          scope.showAlert = newVal <= scope.threshold;
        });
      }
    };
  }]);
})();