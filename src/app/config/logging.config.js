(function () {
  'use strict';

  angular
    .module('execSummary.config')
    .constant('LOGGING_CONFIG', {
      enableConsole: true,
      maxAuditEvents: 1000
    });
})();