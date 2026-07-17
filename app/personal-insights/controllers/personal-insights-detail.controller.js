'use strict';

(function () {
  function PersonalInsightDetailController($routeParams,
                                           InsightApiService,
                                           InsightModelService,
                                           AuditEventService,
                                           SecurityContextService,
                                           $location,
                                           $log) {
    'ngInject';
    var vm = this;

    vm.insight = null;
    vm.loading = false;
    vm.error = null;

    vm.init = function () {
      if (!SecurityContextService.isAuthenticated()) {
        $location.path('/login');
        return;
      }
      var insightId = $routeParams.insightId;
      if (!insightId) {
        $location.path('/personal-insights');
        return;
      }
      vm.loading = true;
      var cached = InsightModelService.getInsightById(insightId);
      if (cached) {
        vm.insight = cached;
        vm._markRead();
        vm.loading = false;
        AuditEventService.logEvent('INSIGHT_DETAIL_VIEW', { insightId: insightId });
      } else {
        InsightApiService.getInsightDetail(insightId)
          .then(function (data) {
            var model = new InsightModelService.constructor.prototype.constructor;
            // Fallback: use service normalization
            InsightModelService.setInsights([data]);
            vm.insight = InsightModelService.getInsightById(insightId);
            vm._markRead();
            AuditEventService.logEvent('INSIGHT_DETAIL_VIEW', { insightId: insightId });
          })
          .catch(function (err) {
            vm.error = 'Unable to load insight details.';
            $log.error('Error loading insight detail', err);
            AuditEventService.logError('INSIGHT_DETAIL_LOAD_FAILED', err);
          })
          .finally(function () {
            vm.loading = false;
          });
      }
    };

    vm._markRead = function () {
      if (vm.insight && !vm.insight.isRead) {
        vm.insight.isRead = true;
        InsightModelService.updateInsight(vm.insight);
      }
    };

    vm.markHelpful = function () {
      if (!vm.insight) { return; }
      InsightApiService.sendInsightFeedback(vm.insight.id, { helpful: true })
        .then(function () {
          AuditEventService.logEvent('INSIGHT_FEEDBACK', { insightId: vm.insight.id, helpful: true });
        });
    };

    vm.markNotHelpful = function () {
      if (!vm.insight) { return; }
      InsightApiService.sendInsightFeedback(vm.insight.id, { helpful: false })
        .then(function () {
          AuditEventService.logEvent('INSIGHT_FEEDBACK', { insightId: vm.insight.id, helpful: false });
        });
    };

    vm.showRelatedTransactions = function () {
      if (!vm.insight || !vm.insight.relatedAccounts || !vm.insight.relatedAccounts.length) {
        return;
      }
      // Navigation stub: would integrate with transactions module
      $log.info('Navigate to transactions for', vm.insight.relatedAccounts);
    };

    vm.backToDashboard = function () {
      $location.path('/personal-insights');
    };

    vm.init();
  }

  angular
    .module('davBanking.personalInsights')
    .controller('PersonalInsightDetailController', PersonalInsightDetailController);
})();
