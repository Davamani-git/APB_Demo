'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.services')
    .service('ComplianceApiService', ComplianceApiService);

  ComplianceApiService.$inject = ['$http', 'ENV_CONFIG', 'ErrorHandlerService', 'SecurityContextService'];

  function ComplianceApiService($http, ENV_CONFIG, ErrorHandlerService, SecurityContextService) {
    this.validateInsights = function (insights) {
      var userContext = {
        jurisdiction: SecurityContextService.getJurisdiction(),
        consentFlags: SecurityContextService.getConsentContext()
      };
      var payload = {
        insights: (insights || []).map(function (insight) {
          return {
            id: insight.id,
            category: insight.category,
            jurisdiction: userContext.jurisdiction,
            consentFlags: userContext.consentFlags
          };
        })
      };
      if (!payload.insights.length) {
        return Promise.resolve([]);
      }
      return $http.post(ENV_CONFIG.API_BASE_URL + '/insights/compliance/validate', payload)
        .then(function (response) {
          var allowedIds = (response.data && response.data.allowedInsightIds) || [];
          return insights.filter(function (insight) {
            return allowedIds.indexOf(insight.id) !== -1;
          });
        })
        .catch(function (error) {
          throw ErrorHandlerService.handle(error, 'validateInsights');
        });
    };
  }
})();
