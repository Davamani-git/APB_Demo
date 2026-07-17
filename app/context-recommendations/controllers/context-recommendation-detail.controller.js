'use strict';

(function () {
  function ContextRecommendationDetailController($routeParams,
                                                 RecommendationApiService,
                                                 RecommendationModelService,
                                                 SecurityContextService,
                                                 AuditEventService,
                                                 $location,
                                                 $log) {
    'ngInject';
    var vm = this;

    vm.recommendation = null;
    vm.loading = false;
    vm.error = null;
    vm.showExplanation = false;

    vm.init = function () {
      if (!SecurityContextService.isAuthenticated()) {
        $location.path('/login');
        return;
      }
      var id = $routeParams.id;
      if (!id) {
        $location.path('/recommendations');
        return;
      }
      vm.loading = true;
      var cached = RecommendationModelService.getRecommendationById(id);
      if (cached) {
        vm.recommendation = cached;
        AuditEventService.logEvent('RECOMMENDATION_DETAIL_VIEW', { recommendationId: id });
        vm.loading = false;
      } else {
        RecommendationApiService.getRecommendationDetail(id)
          .then(function (data) {
            RecommendationModelService.setRecommendations([data]);
            vm.recommendation = RecommendationModelService.getRecommendationById(id);
            AuditEventService.logEvent('RECOMMENDATION_DETAIL_VIEW', { recommendationId: id });
          })
          .catch(function (err) {
            vm.error = 'Unable to load recommendation details.';
            $log.error('Error loading recommendation detail', err);
          })
          .finally(function () {
            vm.loading = false;
          });
      }
    };

    vm.confirm = function () {
      if (!vm.recommendation) { return; }
      RecommendationApiService.confirmRecommendation(vm.recommendation.id, vm.recommendation.context || null)
        .then(function () {
          AuditEventService.logEvent('RECOMMENDATION_CONFIRMED', { recommendationId: vm.recommendation.id });
        });
    };

    vm.dismiss = function () {
      if (!vm.recommendation) { return; }
      RecommendationApiService.dismissRecommendation(vm.recommendation.id, 'USER_DISMISS')
        .then(function () {
          AuditEventService.logEvent('RECOMMENDATION_DISMISSED', { recommendationId: vm.recommendation.id });
        });
    };

    vm.toggleExplanation = function () {
      vm.showExplanation = !vm.showExplanation;
    };

    vm.init();
  }

  angular
    .module('davBanking.contextRecommendations')
    .controller('ContextRecommendationDetailController', ContextRecommendationDetailController);
})();
