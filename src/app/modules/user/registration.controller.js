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
  $scope.registrationSuccess = false;
  $scope.errorMessage = '';

  $scope.register = function register(form) {
    if (!form.$valid || $scope.isSubmitting) {
      return;
    }

    $scope.isSubmitting = true;
    $scope.errorMessage = '';

    const payload = {
      email: $scope.user.email,
      password: $scope.user.password,
      firstName: $scope.user.firstName,
      lastName: $scope.user.lastName
    };

    UserService.register(payload)
      .then(function onRegisterSuccess(createdUser) {
        $scope.registrationSuccess = true;

        return NotificationService.sendEmailConfirmation(createdUser.id);
      })
      .then(function onEmailQueued() {
        $scope.emailQueued = true;
      })
      .catch(function onError(error) {
        if (error && error.data && error.data.message) {
          $scope.errorMessage = error.data.message;
        } else {
          $scope.errorMessage = 'Registration failed. Please try again.';
        }
      })
      .finally(function onFinally() {
        $scope.isSubmitting = false;
      });
  };
}
