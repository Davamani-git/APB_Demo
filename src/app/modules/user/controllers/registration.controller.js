(function () {
  'use strict';

  angular
    .module('userModule')
    .controller('RegistrationController', RegistrationController);

  RegistrationController.$inject = ['$state', 'UserService', 'NotificationService'];

  function RegistrationController($state, UserService, NotificationService) {
    var vm = this;

    vm.user = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'buyer'
    };

    vm.errorMessage = '';
    vm.successMessage = '';
    vm.isSubmitting = false;

    vm.submit = submit;

    function submit(form) {
      if (form.$invalid || vm.isSubmitting) {
        return;
      }

      vm.isSubmitting = true;
      vm.errorMessage = '';
      vm.successMessage = '';

      var payload = angular.copy(vm.user);

      UserService.register(payload)
        .then(function (createdUser) {
          return NotificationService
            .sendEmailConfirmation(createdUser.email, createdUser.id)
            .then(function () {
              vm.successMessage = 'Registration successful. A confirmation email has been sent.';
              vm.isSubmitting = false;
              $state.go('login');
            });
        })
        .catch(function (error) {
          vm.isSubmitting = false;
          vm.errorMessage = (error && error.data && error.data.message) || 'Registration failed. Please try again.';
        });
    }
  }
})();
