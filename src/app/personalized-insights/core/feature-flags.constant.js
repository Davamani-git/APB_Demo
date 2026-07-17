'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.core')
    .constant('FEATURE_FLAGS', {
      ENABLE_BUDGET_ALERTS: true,
      ENABLE_FAIRNESS_MONITORING: true,
      ENABLE_MODEL_DRIFT_ALERTS: true
    });
})();
