(function() {
  'use strict';
  angular.module('providerEnrollmentApp').service('PayerRuleService', ['$http', '$q', 'ApiConfigFactory', PayerRuleService]);
  function PayerRuleService($http, $q, ApiConfigFactory) {
    this.getAllRuleSets = function() {
      return $http.get(ApiConfigFactory.getEndpoint('/payer-rules')).then(function(response) {
        return response.data;
      });
    };
    this.getRuleSet = function(ruleSetId) {
      return $http.get(ApiConfigFactory.getEndpoint('/payer-rules/' + ruleSetId)).then(function(response) {
        return response.data;
      });
    };
    this.createRuleSet = function(ruleSet) {
      return $http.post(ApiConfigFactory.getEndpoint('/payer-rules'), ruleSet).then(function(response) {
        return response.data;
      });
    };
    this.updateRuleSet = function(ruleSetId, ruleSet) {
      return $http.put(ApiConfigFactory.getEndpoint('/payer-rules/' + ruleSetId), ruleSet).then(function(response) {
        return response.data;
      });
    };
    this.deactivateRuleSet = function(ruleSetId) {
      return $http.post(ApiConfigFactory.getEndpoint('/payer-rules/' + ruleSetId + '/deactivate'), {}).then(function(response) {
        return response.data;
      });
    };
  }
  PayerRuleService.$inject = ['$http', '$q', 'ApiConfigFactory'];
})();