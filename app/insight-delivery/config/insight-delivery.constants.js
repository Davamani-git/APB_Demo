'use strict';

(function () {
  angular
    .module('davBanking.insightDelivery')
    .constant('INSIGHT_DELIVERY_API_BASE_URL', 'https://api.davbanking.com/insight-delivery/v1')
    .constant('AUDIT_API_BASE_URL', 'https://api.davbanking.com/audit/v1')
    .constant('INSIGHT_DELIVERY_FEATURES', {
      enforcePolicies: true,
      requireConsent: true
    });
})();
