'use strict';

(function () {
  function RecommendationHistoryController(RecommendationFeedbackService, $log) {
    'ngInject';
    var vm = this;

    vm.events = [];
    vm.loading = false;
    vm.error = null;

    vm.init = function () {
      vm.loading = true;
      RecommendationFeedbackService.getHistory({ page: 0, size: 50 })
        .then(function (data) {
          vm.events = data.events || [];
        })
        .catch(function (err) {
          vm.error = 'Unable to load recommendation history.';
          $log.error('Error loading recommendation history', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.init();
  }

  angular
    .module('davBanking.recommendationControl')
    .controller('RecommendationHistoryController', RecommendationHistoryController);
})();
