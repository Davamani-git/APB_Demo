(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('AuthController', ['authService', '$scope', '$location', function(authService, $scope, $location) {
      var vm = this;
      vm.credentials = {};
      vm.isLoginMode = true;
      vm.login = function() {
        if (!vm.credentials.email || !vm.credentials.password) {
          toastr.error('Email and password are required');
          return;
        }
        authService.login(vm.credentials).then(function(user) {
          toastr.success('Login successful');
          $location.path('/products');
        }, function(error) {
          toastr.error('Login failed');
        });
      };
      vm.register = function() {
        if (!vm.credentials.email || !vm.credentials.password || !vm.credentials.name) {
          toastr.error('All fields are required');
          return;
        }
        authService.register(vm.credentials).then(function(response) {
          toastr.success('Registration successful. Please check your email for confirmation.');
          vm.isLoginMode = true;
        }, function(error) {
          toastr.error('Registration failed');
        });
      };
      vm.toggleMode = function() {
        vm.isLoginMode = !vm.isLoginMode;
        vm.credentials = {};
      };
    }]);
})();