'use strict';

(function () {
  function PersonalInsightsDashboardController(InsightApiService,
                                               InsightModelService,
                                               InsightPreferenceService,
                                               SecurityContextService,
                                               AuditEventService,
                                               $location,
                                               $log) {
    'ngInject';
    var vm = this;

    vm.insights = [];
    vm.filters = {
      timeRange: 'LAST_30_DAYS',
      category: null
    };
    vm.loading = false;
    vm.error = null;
    vm.preferencesLoaded = false;

    vm.init = function () {
      if (!SecurityContextService.isAuthenticated()) {
        $location.path('/login');
        return;
      }
      vm.loading = true;
      InsightPreferenceService.loadPreferences()
        .then(function () {
          vm.preferencesLoaded = true;
          if (!InsightPreferenceService.isInsightsEnabled()) {
            vm.loading = false;
            return;
          }
          return vm.refreshInsights();
        })
        .catch(function (err) {
          vm.error = 'Unable to load insights at this time.';
          AuditEventService.logError('INSIGHTS_LOAD_FAILED', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.refreshInsights = function () {
      vm.loading = true;
      vm.error = null;
      var params = {
        timeRange: vm.filters.timeRange,
        category: vm.filters.category,
        limit: 20,
        offset: 0
      };
      return InsightApiService.getInsights(params)
        .then(function (data) {
          InsightModelService.setInsights(data.insights || []);
          vm.insights = InsightModelService.getInsights();
          AuditEventService.logEvent('INSIGHTS_VIEW', { count: vm.insights.length });
        })
        .catch(function (err) {
          vm.error = 'Insights are temporarily unavailable. Please try again later.';
          $log.error('Error loading insights', err);
          AuditEventService.logError('INSIGHTS_LOAD_FAILED', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.applyFilter = function (filterCriteria) {
      vm.filters.timeRange = filterCriteria.timeRange || vm.filters.timeRange;
      vm.filters.category = filterCriteria.category || vm.filters.category;
      vm.refreshInsights();
    };

    vm.openInsight = function (insight) {
      if (!insight || !insight.id) { return; }
      $location.path('/personal-insights/' + encodeURIComponent(insight.id));
    };

    vm.dismissInsight = function (insight) {
      if (!insight || !insight.id) { return; }
      InsightApiService.dismissInsight(insight.id)
        .then(function () {
          insight.isDismissed = true;
          InsightModelService.updateInsight(insight);
          AuditEventService.logEvent('INSIGHT_DISMISSED', { insightId: insight.id });
        })
        .catch(function (err) {
          $log.error('Failed to dismiss insight', err);
          AuditEventService.logError('INSIGHT_DISMISS_FAILED', err);
        });
    };

    vm.navigateToBudgets = function () {
      $location.path('/budgets');
    };

    vm.init();
  }

  angular
    .module('davBanking.personalInsights')
    .controller('PersonalInsightsDashboardController', PersonalInsightsDashboardController);
})();
