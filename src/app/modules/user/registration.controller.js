'use strict';

angular.module('userModule')
  .controller('RegistrationController', ["$scope", "UserService", "NotificationService",
    function($scope, UserService, NotificationService) {
      $scope.user = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'buyer'
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
            return NotificationService.sendEmailConfirmation(createdUser.id)
              .then(function() {
                $scope.successMessage = 'Registration successful. A confirmation email has been sent.';
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
  ]);
