(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'src/app/modules/seller/views/login.view.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        })
        .when('/register', {
          templateUrl: 'src/app/modules/seller/views/register.view.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        })
        .when('/dashboard', {
          templateUrl: 'src/app/modules/seller/views/dashboard.view.html',
          controller: 'ProductController',
          controllerAs: 'vm'
        })
        .when('/products', {
          templateUrl: 'src/app/modules/seller/views/products.view.html',
          controller: 'ProductController',
          controllerAs: 'vm'
        })
        .when('/inventory', {
          templateUrl: 'src/app/modules/seller/views/inventory.view.html',
          controller: 'InventoryController',
          controllerAs: 'vm'
        })
        .when('/orders', {
          templateUrl: 'src/app/modules/seller/views/orders.view.html',
          controller: 'OrderController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/modules/seller/views/analytics.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/login'
        });
      $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .factory('AuthInterceptor', ['$q', '$location', function($q, $location) {
      return {
        request: function(config) {
          var token = sessionStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401) {
            sessionStorage.removeItem('authToken');
            $location.path('/login');
          }
          return $q.reject(response);
        }
      };
    }])
    .run(['$rootScope', '$location', function($rootScope, $location) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        var token = sessionStorage.getItem('authToken');
        var publicPages = ['/login', '/register'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !token) {
          $location.path('/login');
        }
      });
    }]);
})();