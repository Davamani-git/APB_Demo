(function () {
  'use strict';

  angular
    .module('execSummary.config')
    .constant('FEATURE_FLAGS', {
      enableServerSync: false,
      enableAuditPersistence: false,
      enableExperimentalThemes: false
    });
})();