(function() {
  'use strict';
  angular.module('onlineShoppingApp').config(['$routeProvider', '$httpProvider', '$locationProvider', config]).run(['$rootScope', 'AuthService', run]);
  function config($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $routeProvider
      .when('/', {
        templateUrl: 'src/app/catalog/product-list.view.html',
        controller: 'ProductListController',
        controllerAs: 'vm'
      })
      .when('/product/:productId', {
        templateUrl: 'src/app/catalog/product-detail.view.html',
        controller: 'ProductDetailController',
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
        templateUrl: 'src/app/orders/order-history.view.html',
        controller: 'OrderHistoryController',
        controllerAs: 'vm'
      })
      .when('/orders/:orderId', {
        templateUrl: 'src/app/orders/order-detail.view.html',
        controller: 'OrderDetailController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/' });
  }
  function run($rootScope, AuthService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (!AuthService.isAuthenticated() && next.$$route && next.$$route.originalPath !== '/') {
        AuthService.autoLogin();
      }
    });
  }
})();