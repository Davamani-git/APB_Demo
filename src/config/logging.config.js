(function () {
  'use strict';

  angular
    .module('apb.core')
    .constant('LOGGING_CONFIG', {
      remoteLoggingEnabled: false,
      remoteLoggingUrl: '',
      logLevel: 'INFO'
    });
})();
