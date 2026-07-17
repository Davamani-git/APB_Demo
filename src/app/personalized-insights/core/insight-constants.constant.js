'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.core')
    .constant('INSIGHT_CONSTANTS', {
      CATEGORIES: {
        SPENDING_TREND: 'SPENDING_TREND',
        BUDGET_ALERT: 'BUDGET_ALERT',
        FINANCIAL_WELLNESS: 'FINANCIAL_WELLNESS'
      },
      SEVERITY: {
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH'
      },
      DEFAULT_LIMITS: {
        MAX_INSIGHTS: 50
      },
      MESSAGES: {
        NO_INSIGHTS: 'No insights are available at this time.',
        LOAD_ERROR: 'Insights are temporarily unavailable. Please try again later.'
      }
    });
})();
