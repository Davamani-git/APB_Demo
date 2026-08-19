(function() {
  'use strict';
  angular.module('foodDeliveryApp', ['ngRoute', 'ngAnimate', 'orderTracking', 'deliveryTracking'])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
      $routeProvider
        .when('/track/:orderId', {
          templateUrl: 'src/app/modules/order-tracking/views/order-tracking.html',
          controller: 'OrderTrackingController',
          controllerAs: 'vm'
        })
        .when('/delivery/:orderId', {
          templateUrl: 'src/app/modules/delivery-tracking/views/delivery-tracking.html',
          controller: 'DeliveryTrackingController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/track/ORDER123'
        });
    }]);
})();