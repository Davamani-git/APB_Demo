'use strict';

(function () {
  class InsightDeliveryPolicyService {
    constructor($log) {
      'ngInject';
      this.$log = $log;
    }

    _policy(insight) {
      return (insight && insight.policy) || {};
    }

    isInsightViewable(insight) {
      if (!insight) { return false; }
      var policy = this._policy(insight);
      if (policy.decision === 'BLOCK') { return false; }
      if (angular.isDefined(insight.isViewable)) { return !!insight.isViewable; }
      return true;
    }

    getMaskingLevel(insight) {
      var policy = this._policy(insight);
      return policy.maskingLevel || 'NONE';
    }

    maskAccountId(maskedAccountId, maskingLevel) {
      if (!maskedAccountId) { return ''; }
      switch (maskingLevel) {
        case 'FULL':
          return '****';
        case 'PARTIAL':
          return maskedAccountId.replace(/.(?=.{4})/g, '*');
        default:
          return maskedAccountId;
      }
    }

    shouldShowBlockedBanner(insight) {
      var policy = this._policy(insight);
      return policy.decision === 'BLOCK';
    }
  }

  angular
    .module('davBanking.insightDelivery')
    .service('InsightDeliveryPolicyService', InsightDeliveryPolicyService);
})();
