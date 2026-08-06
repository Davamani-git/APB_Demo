(function() {
  'use strict';
  angular.module('shoppingPlatform').config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $routeProvider
      .when('/', {
        redirectTo: '/catalog'
      })
      .when('/catalog', {
        templateUrl: 'src/app/catalog/product-catalog.view.html',
        controller: 'ProductCatalogController',
        controllerAs: 'vm'
      })
      .when('/product/:id', {
        templateUrl: 'src/app/catalog/product-details.view.html',
        controller: 'ProductDetailsController',
        controllerAs: 'vm'
      })
      .when('/cart', {
        templateUrl: 'src/app/cart/shopping-cart.view.html',
        controller: 'ShoppingCartController',
        controllerAs: 'vm'
      })
      .when('/wishlist', {
        templateUrl: 'src/app/wishlist/wishlist.view.html',
        controller: 'WishlistController',
        controllerAs: 'vm'
      })
      .when('/checkout', {
        templateUrl: 'src/app/checkout/checkout.view.html',
        controller: 'CheckoutController',
        controllerAs: 'vm',
        resolve: {
          auth: ['AuthService', '$location', function(AuthService, $location) {
            if (!AuthService.isAuthenticated()) {
              $location.path('/login');
            }
          }]
        }
      })
      .when('/orders', {
        templateUrl: 'src/app/orders/order-tracking.view.html',
        controller: 'OrderTrackingController',
        controllerAs: 'vm',
        resolve: {
          auth: ['AuthService', '$location', function(AuthService, $location) {
            if (!AuthService.isAuthenticated()) {
              $location.path('/login');
            }
          }]
        }
      })
      .when('/order/:id', {
        templateUrl: 'src/app/orders/order-details.view.html',
        controller: 'OrderController',
        controllerAs: 'vm'
      })
      .when('/seller/dashboard', {
        templateUrl: 'src/app/seller/seller-dashboard.view.html',
        controller: 'SellerDashboardController',
        controllerAs: 'vm',
        resolve: {
          auth: ['RBACService', '$location', function(RBACService, $location) {
            if (!RBACService.hasRole('seller')) {
              $location.path('/login');
            }
          }]
        }
      })
      .when('/seller/products', {
        templateUrl: 'src/app/seller/product-management.view.html',
        controller: 'ProductManagementController',
        controllerAs: 'vm',
        resolve: {
          auth: ['RBACService', '$location', function(RBACService, $location) {
            if (!RBACService.hasRole('seller')) {
              $location.path('/login');
            }
          }]
        }
      })
      .when('/seller/inventory', {
        templateUrl: 'src/app/seller/inventory.view.html',
        controller: 'InventoryController',
        controllerAs: 'vm',
        resolve: {
          auth: ['RBACService', '$location', function(RBACService, $location) {
            if (!RBACService.hasRole('seller')) {
              $location.path('/login');
            }
          }]
        }
      })
      .when('/seller/orders', {
        templateUrl: 'src/app/seller/order-management.view.html',
        controller: 'OrderManagementController',
        controllerAs: 'vm',
        resolve: {
          auth: ['RBACService', '$location', function(RBACService, $location) {
            if (!RBACService.hasRole('seller')) {
              $location.path('/login');
            }
          }]
        }
      })
      .when('/admin/dashboard', {
        templateUrl: 'src/app/admin/admin-dashboard.view.html',
        controller: 'AdminDashboardController',
        controllerAs: 'vm',
        resolve: {
          auth: ['RBACService', '$location', function(RBACService, $location) {
            if (!RBACService.hasRole('admin')) {
              $location.path('/login');
            }
          }]
        }
      })
      .when('/admin/users', {
        templateUrl: 'src/app/admin/user-management.view.html',
        controller: 'UserManagementController',
        controllerAs: 'vm',
        resolve: {
          auth: ['RBACService', '$location', function(RBACService, $location) {
            if (!RBACService.hasRole('admin')) {
              $location.path('/login');
            }
          }]
        }
      })
      .when('/admin/analytics', {
        templateUrl: 'src/app/admin/analytics.view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm',
        resolve: {
          auth: ['RBACService', '$location', function(RBACService, $location) {
            if (!RBACService.hasRole('admin')) {
              $location.path('/login');
            }
          }]
        }
      })
      .otherwise({
        redirectTo: '/catalog'
      });
  }]);
  angular.module('shoppingPlatform').constant('API_CONFIG', {
    baseUrl: 'https://api.shoppingplatform.com',
    timeout: 30000
  });
  angular.module('shoppingPlatform').constant('CDN_CONFIG', {
    baseUrl: 'https://cdn.shoppingplatform.com',
    imageFormats: ['jpg', 'jpeg', 'png', 'gif'],
    maxFileSize: 5242880
  });
  angular.module('shoppingPlatform').constant('PAYMENT_CONFIG', {
    stripeKey: 'pk_test_placeholder',
    paypalClientId: 'paypal_placeholder'
  });
})();