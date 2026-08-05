(function () {
  'use strict';

  angular
    .module('timerApp')
    .config(appConfig);

  appConfig.$inject = ['$logProvider'];

  function appConfig($logProvider) {
    if ($logProvider && $logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
  }
})();
