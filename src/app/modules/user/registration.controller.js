(function() {
  'use strict';

  angular
    .module('userModule')
    .controller('RegistrationController', RegistrationController);

  RegistrationController.$inject = ['$scope', 'UserService', 'NotificationService'];

  function RegistrationController($scope, UserService, NotificationService) {
    $scope.user = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    };

    $scope.isSubmitting = false;
    $scope.errorMessage = '';
    $scope.successMessage = '';

    $scope.register = function(form) {
      if (!form.$valid || $scope.isSubmitting) {
        return;
      }

      $scope.isSubmitting = true;
      $scope.errorMessage = '';
      $scope.successMessage = '';

      UserService.register($scope.user)
        .then(function(createdUser) {
          return NotificationService
            .sendRegistrationConfirmation(createdUser.id)
            .then(function() {
              $scope.successMessage = 'Registration successful. Please check your email for confirmation.';
            });
        })
        .catch(function(error) {
          $scope.errorMessage = (error && error.data && error.data.message) || 'Registration failed. Please try again.';
        })
        .finally(function() {
          $scope.isSubmitting = false;
        });
    };
  }
})();
