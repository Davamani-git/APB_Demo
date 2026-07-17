'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.ui')
    .controller('InsightDetailController', InsightDetailController);

  InsightDetailController.$inject = ['$stateParams', 'InsightsApiService', 'AuditLogApiService', 'ErrorHandlerService'];

  function InsightDetailController($stateParams, InsightsApiService, AuditLogApiService, ErrorHandlerService) {
    var vm = this;

    vm.insight = null;
    vm.state = 'loading';
    vm.errorMessage = '';

    vm.init = init;

    init();

    function init() {
      var insightId = $stateParams.insightId;
      if (!insightId) {
        vm.state = 'error';
        vm.errorMessage = 'Insight not found.';
        return;
      }

      vm.state = 'loading';
      InsightsApiService.getInsightById(insightId)
        .then(function (insight) {
          vm.insight = insight;
          vm.state = 'loaded';
          vm.errorMessage = '';
          AuditLogApiService.logEvent('INSIGHT_VIEW', {
            insightId: insight.id,
            category: insight.category,
            modelVersion: insight.modelVersion,
            channel: 'WEB',
            lineageId: insight.lineageId
          });
        })
        .catch(function (error) {
          var clientError = error && error.message ? error : ErrorHandlerService.handle(error, 'InsightDetailController');
          vm.state = 'error';
          vm.errorMessage = clientError.message;
        });
    }
  }
})();
