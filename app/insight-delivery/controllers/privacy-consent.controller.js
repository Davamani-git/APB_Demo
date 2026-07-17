'use strict';

(function () {
  function PrivacyConsentController($scope, InsightDeliveryApiService, AuditEventService) {
    'ngInject';
    var vm = this;

    vm.loading = true;
    vm.error = null;
    vm.model = null;

    vm.init = function () {
      vm.loading = true;
      InsightDeliveryApiService.getGlobalConsent()
        .then(function (data) {
          vm.model = data;
        })
        .catch(function (err) {
          vm.error = 'Unable to load consent settings.';
          AuditEventService.logError('CONSENT_LOAD_FAILED', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.accept = function () {
      var payload = {
        profilingConsent: true,
        insightDeliveryEnabled: true
      };
      InsightDeliveryApiService.updateGlobalConsent(payload)
        .then(function () {
          AuditEventService.logEvent('CONSENT_ACCEPTED', {});
          $scope.$emit('insightConsent:updated', payload);
        });
    };

    vm.decline = function () {
      var payload = {
        profilingConsent: false,
        insightDeliveryEnabled: false
      };
      InsightDeliveryApiService.updateGlobalConsent(payload)
        .then(function () {
          AuditEventService.logEvent('CONSENT_DECLINED', {});
          $scope.$emit('insightConsent:updated', payload);
        });
    };

    vm.init();
  }

  angular
    .module('davBanking.insightDelivery')
    .controller('PrivacyConsentController', PrivacyConsentController);
})();
