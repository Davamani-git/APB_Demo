'use strict';

angular.module('authModule', [
  'shared.services.auth',
  'rbacModule'
])
  .controller('LoginController', ["$scope", "$state", "AuthService", "RbacService",
    function($scope, $state, AuthService, RbacService) {
      $scope.credentials = {
        email: '',
        password: ''
      };

      $scope.isLoggingIn = false;
      $scope.errorMessage = '';

      $scope.login = function(form) {
        if (!form.$valid || $scope.isLoggingIn) {
          return;
        }

        $scope.isLoggingIn = true;
        $scope.errorMessage = '';

        AuthService.login($scope.credentials)
          .then(function() {
            return RbacService.loadPermissions();
          })
          .then(function(permissions) {
            if (permissions.roles && permissions.roles.indexOf('seller') !== -1) {
              $state.go('seller.dashboard');
            } else if (permissions.roles && permissions.roles.indexOf('admin') !== -1) {
              $state.go('admin.dashboard');
            } else {
              $state.go('buyer.dashboard');
            }
          })
          .catch(function(error) {
            $scope.errorMessage = (error && error.data && error.data.message) || 'Login failed. Please check your credentials.';
          })
          .finally(function() {
            $scope.isLoggingIn = false;
          });
      };
    }
  ]);
