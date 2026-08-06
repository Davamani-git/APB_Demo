(function() {
  'use strict';
  angular.module('shoppingPlatform').run(['$rootScope', 'AuthService', 'CartFactory', 'NotificationFactory', function($rootScope, AuthService, CartFactory, NotificationFactory) {
    $rootScope.isAuthenticated = false;
    $rootScope.userRole = null;
    $rootScope.cartCount = 0;
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.isAuthenticated = AuthService.isAuthenticated();
      $rootScope.userRole = AuthService.getUserRole();
    });
    $rootScope.$on('cart:updated', function(event, count) {
      $rootScope.cartCount = count;
    });
    $rootScope.logout = function() {
      AuthService.logout();
      window.location.href = '#!/login';
    };
    CartFactory.init();
  }]);
})();