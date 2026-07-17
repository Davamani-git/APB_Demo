'use strict';

(function () {
  function ContextRecommendationsListController(RecommendationApiService,
                                                RecommendationModelService,
                                                RecommendationPreferenceService,
                                                SecurityContextService,
                                                AuditEventService,
                                                $log) {
    'ngInject';
    var vm = this;

    vm.recommendations = [];
    vm.loading = false;
    vm.error = null;
    vm.filters = {
      contextType: 'DASHBOARD',
      contextId: null
    };

    vm.init = function () {
      if (!SecurityContextService.isAuthenticated()) {
        return;
      }
      RecommendationPreferenceService.loadPreferences()
        .then(function () {
          if (!RecommendationPreferenceService.isRecommendationsEnabled()) {
            return;
          }
          vm.refresh();
        });
    };

    vm.refresh = function () {
      vm.loading = true;
      vm.error = null;
      var params = {
        contextType: vm.filters.contextType,
        contextId: vm.filters.contextId,
        limit: 20,
        offset: 0
      };
      RecommendationApiService.getRecommendations(params)
        .then(function (data) {
          RecommendationModelService.setRecommendations(data.recommendations || []);
          vm.recommendations = RecommendationModelService.getRecommendations();
          AuditEventService.logEvent('RECOMMENDATIONS_VIEW_FULL', { count: vm.recommendations.length });
        })
        .catch(function (err) {
          vm.error = 'Unable to load recommendations.';
          $log.error('Error loading recommendations', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.applyFilter = function (filters) {
      angular.extend(vm.filters, filters);
      vm.refresh();
    };

    vm.onConfirm = function (rec) {
      AuditEventService.logEvent('RECOMMENDATION_CONFIRMED_UI', { recommendationId: rec.id });
    };

    vm.onDismiss = function (rec) {
      AuditEventService.logEvent('RECOMMENDATION_DISMISSED_UI', { recommendationId: rec.id });
    };

    vm.onViewDetails = function (rec) {
      AuditEventService.logEvent('RECOMMENDATION_DETAIL_NAV', { recommendationId: rec.id });
    };

    vm.init();
  }

  angular
    .module('davBanking.contextRecommendations')
    .controller('ContextRecommendationsListController', ContextRecommendationsListController);
})();
