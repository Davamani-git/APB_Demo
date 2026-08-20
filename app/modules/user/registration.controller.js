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

  $scope.submitRegistration = function submitRegistration(form) {
    if (!form.$valid || $scope.isSubmitting) {
      return;
    }

    $scope.isSubmitting = true;
    $scope.errorMessage = '';
    $scope.successMessage = '';

    UserService
      .register($scope.user)
      .then(function onRegistered(response) {
        $scope.isSubmitting = false;

        NotificationService
          .sendEmailConfirmation(response.data.userId)
          .then(function onNotificationSent() {
            $scope.successMessage = 'Registration successful. A confirmation email has been sent.';
          })
          .catch(function onNotificationError() {
            $scope.errorMessage = 'Registration succeeded but we could not send a confirmation email. Please contact support.';
          });
      })
      .catch(function onRegisterError(error) {
        $scope.isSubmitting = false;
        $scope.errorMessage = (error && error.data && error.data.message) || 'Registration failed. Please try again.';
      });
  };
}
