(function () {
  'use strict';

  angular
    .module('execSummary.services')
    .service('AccessControlService', ['ENV_CONFIG', function (ENV_CONFIG) {
      var currentRole = ENV_CONFIG.defaultRole || 'VIEWER';

      this.getCurrentRole = function () {
        return currentRole;
      };

      this.isViewer = function () {
        return currentRole === 'VIEWER';
      };

      this.isEditor = function () {
        return currentRole === 'EDITOR';
      };

      this.canEditScope = function () {
        return this.isEditor();
      };
    }]);
})();