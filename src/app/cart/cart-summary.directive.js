(function() {
  'use strict';
  angular.module('onlineShoppingApp').directive('cartSummary', ['CartService', '$rootScope', cartSummary]);
  function cartSummary(CartService, $rootScope) {
    return {
      restrict: 'E',
      template: '<span class="cart-badge">{{count}}</span>',
      link: function(scope) {
        scope.count = CartService.getCartCount();
        $rootScope.$on('cart:updated', function() {
          scope.count = CartService.getCartCount();
        });
      }
    };
  }
})();