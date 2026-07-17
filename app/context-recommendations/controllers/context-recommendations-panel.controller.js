'use strict';

(function () {
  function ContextRecommendationsPanelController(RecommendationApiService,
                                                 RecommendationModelService,
                                                 RecommendationPreferenceService,
                                                 SecurityContextService,
                                                 AuditEventService,
                                                 $log) {
    'ngInject';
    var vm = this;

    vm.context = vm.context || null;
    vm.recommendations = [];
    vm.loading = false;
    vm.error = null;

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
      if (!vm.context) {
        return;
      }
      vm.loading = true;
      vm.error = null;
      var params = {
        contextType: vm.context.contextType,
        contextId: vm.context.contextId,
        limit: 3,
        offset: 0
      };
      RecommendationApiService.getRecommendations(params)
        .then(function (data) {
          RecommendationModelService.setRecommendations(data.recommendations || []);
          vm.recommendations = RecommendationModelService.getRecommendations();
          AuditEventService.logEvent('RECOMMENDATIONS_VIEW', { count: vm.recommendations.length });
        })
        .catch(function (err) {
          vm.error = 'Recommendations are temporarily unavailable.';
          $log.error('Error loading recommendations', err);
        })
        .finally(function () {
          vm.loading = false;
        });
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
    .controller('ContextRecommendationsPanelController', ContextRecommendationsPanelController);
})();
