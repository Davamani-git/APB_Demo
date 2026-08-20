(function () {
  'use strict';

  angular
    .module('userModule', [])
    .config(userModuleConfig);

  userModuleConfig.$inject = ['$stateProvider'];

  function userModuleConfig($stateProvider) {
    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'src/app/modules/user/views/register.html',
      controller: 'RegistrationController',
      controllerAs: 'vm'
    });
  }
})();
