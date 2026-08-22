(function () {
  'use strict';

  angular
    .module('apb.auth')
    .controller('RegistrationController', RegistrationController);

  RegistrationController.$inject = ['$scope', 'RegistrationService'];

  function RegistrationController($scope, RegistrationService) {
    $scope.user = {
      email: '',
      password: '',
      confirmPassword: ''
    };

    $scope.isSubmitting = false;
    $scope.errorMessage = null;
    $scope.successMessage = null;

    $scope.submit = function submit() {
      $scope.errorMessage = null;
      $scope.successMessage = null;

      if (!$scope.user.email || !$scope.user.password || !$scope.user.confirmPassword) {
        $scope.errorMessage = 'All fields are required.';
        return;
      }

      if ($scope.user.password !== $scope.user.confirmPassword) {
        $scope.errorMessage = 'Passwords do not match.';
        return;
      }

      $scope.isSubmitting = true;

      RegistrationService
        .register($scope.user)
        .then(function () {
          $scope.successMessage = 'Registration successful. A confirmation email has been sent.';
        })
        .catch(function (err) {
          $scope.errorMessage = (err && err.message) || 'Registration failed. Please try again.';
        })
        .finally(function () {
          $scope.isSubmitting = false;
        });
    };
  }
})();
