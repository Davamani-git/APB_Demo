(function () {
  'use strict';

  angular
    .module('ccd.layout')
    .controller('ShellController', [
      '$rootScope',
      'loggingService',
      function ($rootScope, loggingService) {
        var vm = this;
        vm.isLoading = false;
        vm.globalError = null;

        vm.onRetry = function () {
          $rootScope.$broadcast('globalRetry');
        };

        $rootScope.$on('loading:start', function () {
          vm.isLoading = true;
        });

        $rootScope.$on('loading:end', function () {
          vm.isLoading = false;
        });

        $rootScope.$on('globalError', function (event, errorModel) {
          vm.globalError = errorModel;
          loggingService.error('Global error', {}, errorModel);
        });

        $rootScope.$on('clearGlobalError', function () {
          vm.globalError = null;
        });
      }
    ]);
})();
