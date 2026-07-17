(function () {
  'use strict';

  angular.module('app.core')
    .service('consentService', [function () {
      this.isConsentGranted = function (summary) {
        if (!summary) {
          return false;
        }
        return summary.consentStatus === 'GRANTED';
      };

      this.getConsentMessage = function (summary) {
        if (!summary) {
          return '';
        }
        if (summary.consentStatus === 'REVOKED') {
          return 'Insights cannot be displayed because consent has been revoked.';
        }
        if (summary.consentStatus === 'UNKNOWN') {
          return 'Insights cannot be displayed until consent status is confirmed.';
        }
        return '';
      };
    }]);
}());
