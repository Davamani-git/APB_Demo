(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $httpProvider.interceptors.push('httpInterceptorService');
      $routeProvider
        .when('/login', {
          templateUrl: 'src/app/auth/login.view.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        })
        .when('/products', {
          templateUrl: 'src/app/product/product-list.view.html',
          controller: 'ProductListController',
          controllerAs: 'vm'
        })
        .when('/search', {
          templateUrl: 'src/app/search/search.view.html',
          controller: 'SearchController',
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
        .when('/seller/products', {
          templateUrl: 'src/app/product-management/product-management.view.html',
          controller: 'ProductManagementController',
          controllerAs: 'vm'
        })
        .when('/seller/inventory', {
          templateUrl: 'src/app/inventory/inventory.view.html',
          controller: 'InventoryController',
          controllerAs: 'vm'
        })
        .when('/seller/analytics', {
          templateUrl: 'src/app/analytics/analytics.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .when('/admin/dashboard', {
          templateUrl: 'src/app/admin-dashboard/admin-dashboard.view.html',
          controller: 'AdminDashboardController',
          controllerAs: 'vm'
        })
        .when('/admin/fraud', {
          templateUrl: 'src/app/fraud/fraud.view.html',
          controller: 'FraudController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/products'
        });
    }])
    .constant('apiConfig', {
      baseUrl: '/api',
      timeout: 30000
    });
})();