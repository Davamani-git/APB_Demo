'use strict';

angular.module('userModule')
  .controller('RegistrationController', ['$scope', 'UserService', 'NotificationService',
    function($scope, UserService, NotificationService) {
      $scope.registration = {
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      };
      $scope.isSubmitting = false;
      $scope.errorMessage = null;
      $scope.successMessage = null;

      function resetMessages() {
        $scope.errorMessage = null;
        $scope.successMessage = null;
      }

      $scope.register = function(form) {
        if (!form.$valid) {
          return;
        }
        resetMessages();
        $scope.isSubmitting = true;

        var payload = {
          email: $scope.registration.email,
          password: $scope.registration.password,
          firstName: $scope.registration.firstName,
          lastName: $scope.registration.lastName
        };

        UserService.register(payload)
          .then(function(user) {
            return NotificationService.sendEmailConfirmation(user.id)
              .then(function() {
                $scope.successMessage = 'Registration successful. A confirmation email has been sent.';
              });
          })
          .catch(function(err) {
            $scope.errorMessage = (err && err.message) || 'Registration failed. Please try again.';
          })
          .finally(function() {
            $scope.isSubmitting = false;
          });
      };
    }
  ]);
