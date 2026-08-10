(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .controller('AuthController', ['$scope', '$location', 'SellerService', 'NotificationService', function($scope, $location, SellerService, NotificationService) {
      var vm = this;
      vm.credentials = {};
      vm.sellerData = {};
      vm.login = function() {
        if (!vm.credentials.email || !vm.credentials.password) {
          NotificationService.showNotification('Please enter email and password', 'error');
          return;
        }
        SellerService.login(vm.credentials)
          .then(function(response) {
            NotificationService.showNotification('Login successful', 'success');
            $location.path('/dashboard');
          })
          .catch(function(error) {
            NotificationService.showNotification('Login failed: ' + (error.data?.message || 'Invalid credentials'), 'error');
          });
      };
      vm.register = function() {
        if (!vm.sellerData.email || !vm.sellerData.password || !vm.sellerData.businessName) {
          NotificationService.showNotification('Please fill all required fields', 'error');
          return;
        }
        SellerService.register(vm.sellerData)
          .then(function(response) {
            NotificationService.showNotification('Registration successful. Please login.', 'success');
            $location.path('/login');
          })
          .catch(function(error) {
            NotificationService.showNotification('Registration failed: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.logout = function() {
        SellerService.logout().then(function() {
          NotificationService.showNotification('Logged out successfully', 'success');
          $location.path('/login');
        });
      };
    }]);
})();