'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.ui')
    .controller('InsightsDashboardController', InsightsDashboardController);

  InsightsDashboardController.$inject = ['InsightsApiService', 'ComplianceApiService', 'AuditLogApiService', 'UserPreferencesModel', 'ErrorHandlerService', '$scope', '$rootScope'];

  function InsightsDashboardController(InsightsApiService, ComplianceApiService, AuditLogApiService, UserPreferencesModel, ErrorHandlerService, $scope, $rootScope) {
    var vm = this;

    vm.insights = [];
    vm.filter = {};
    vm.state = 'loading';
    vm.errorMessage = '';

    vm.init = init;
    vm.refresh = refresh;
    vm.applyFilter = applyFilter;
    vm.onInsightAction = onInsightAction;

    $scope.$on('insights:refresh', function () {
      vm.refresh();
    });

    init();

    function init() {
      vm.state = 'loading';
      loadInsights(vm.filter);
    }

    function refresh() {
      vm.state = 'loading';
      loadInsights(vm.filter, { forceRefresh: true });
    }

    function applyFilter(filter) {
      vm.filter = angular.copy(filter || {});
      loadInsights(vm.filter);
    }

    function loadInsights(filter, options) {
      options = options || {};
      var params = angular.extend({}, filter || {});
      var promise = options.forceRefresh ? InsightsApiService.refreshInsights() : InsightsApiService.getCurrentInsights(params);

      promise
        .then(function (insights) {
          return ComplianceApiService.validateInsights(insights);
        })
        .then(function (filteredInsights) {
          vm.insights = filteredInsights || [];
          vm.state = vm.insights.length ? 'loaded' : 'empty';
          vm.errorMessage = '';
        })
        .catch(function (error) {
          var clientError = error && error.message ? error : ErrorHandlerService.handle(error, 'loadInsights');
          vm.state = 'error';
          vm.errorMessage = clientError.message;
        });
    }

    function onInsightAction(insight, action) {
      if (!insight || !action) {
        return;
      }

      AuditLogApiService.logEvent(action === 'DISMISS' ? 'INSIGHT_DISMISS' : 'INSIGHT_VIEW', {
        insightId: insight.id,
        category: insight.category,
        modelVersion: insight.modelVersion,
        channel: 'WEB',
        lineageId: insight.lineageId
      });

      InsightsApiService.acknowledgeInsight(insight.id, action);

      if (action === 'DISMISS') {
        insight.state = 'DISMISSED';
        vm.insights = vm.insights.filter(function (i) { return i.state !== 'DISMISSED'; });
      }

      if (action === 'REFRESH') {
        $rootScope.$emit('insights:refresh');
      }
    }
  }
})();
