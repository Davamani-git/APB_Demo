(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .directive('productCard', ['ProductService', function(ProductService) {
      return {
        restrict: 'E',
        scope: {
          product: '=',
          onEdit: '&',
          onDelete: '&'
        },
        templateUrl: 'src/app/modules/seller/directives/product-card.template.html',
        link: function(scope, element, attrs) {
          scope.editProduct = function() {
            scope.onEdit({ product: scope.product });
          };
          scope.deleteProduct = function() {
            scope.onDelete({ productId: scope.product.productId });
          };
        }
      };
    }]);
})();