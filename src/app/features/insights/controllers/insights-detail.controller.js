(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .controller('InsightsDetailController', InsightsDetailController);

  InsightsDetailController.$inject = ['$routeParams', '$window', 'InsightsService', 'LoggingService'];

  function InsightsDetailController($routeParams, $window, InsightsService, LoggingService) {
    const vm = this;
    vm.insight = null;
    vm.isLoading = false;
    vm.error = null;

    vm.loadInsight = loadInsight;
    vm.navigateBack = navigateBack;

    activate();

    function activate() {
      loadInsight();
    }

    function loadInsight() {
      const id = $routeParams.id;
      if (!id) {
        vm.error = { message: 'Insight not found.' };
        return;
      }
      vm.isLoading = true;
      vm.error = null;
      InsightsService.getInsightById(id)
        .then(function (insight) {
          vm.insight = insight;
          LoggingService.info('Insight detail viewed', { insightId: insight.id });
        })
        .catch(function (err) {
          vm.error = err;
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function navigateBack() {
      $window.history.back();
    }
  }
})();
