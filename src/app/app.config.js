(function() {
  'use strict';
  angular.module('app.shopping')
    .constant('API_BASE_URL', '/api')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
      $routeProvider
        .when('/', {
          templateUrl: 'src/app/products/product.view.html',
          controller: 'ProductController',
          controllerAs: 'vm'
        })
        .when('/products', {
          templateUrl: 'src/app/products/product.view.html',
          controller: 'ProductController',
          controllerAs: 'vm'
        })
        .when('/cart', {
          templateUrl: 'src/app/cart/cart.view.html',
          controller: 'CartController',
          controllerAs: 'vm'
        })
        .when('/checkout', {
          templateUrl: 'src/app/checkout/checkout.view.html',
          controller: 'CheckoutController',
          controllerAs: 'vm'
        })
        .when('/orders', {
          templateUrl: 'src/app/orders/order.view.html',
          controller: 'OrderController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);
})();