(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .controller('InsightsDashboardController', InsightsDashboardController);

  InsightsDashboardController.$inject = ['$location', 'InsightsService', 'RbacService', 'LoggingService', 'InsightsQueryModel'];

  function InsightsDashboardController($location, InsightsService, RbacService, LoggingService, InsightsQueryModel) {
    const vm = this;

    vm.insights = [];
    vm.filters = new InsightsQueryModel();
    vm.isLoading = false;
    vm.error = null;

    vm.loadInsights = loadInsights;
    vm.applyFilters = applyFilters;
    vm.clearFilters = clearFilters;
    vm.onInsightSelected = onInsightSelected;

    activate();

    function activate() {
      if (!RbacService.canViewInsights()) {
        vm.error = { message: 'You are not allowed to view insights.' };
        return;
      }
      loadInsights();
    }

    function loadInsights() {
      if (!vm.filters.isValidRange()) {
        vm.error = { message: 'Please select a valid date range.' };
        return;
      }
      vm.isLoading = true;
      vm.error = null;
      InsightsService.getInsights(vm.filters)
        .then(function (insights) {
          vm.insights = insights;
        })
        .catch(function (err) {
          vm.error = err;
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function applyFilters() {
      loadInsights();
    }

    function clearFilters() {
      vm.filters = new InsightsQueryModel();
      loadInsights();
    }

    function onInsightSelected(insight) {
      if (!insight || !insight.id) {
        return;
      }
      LoggingService.info('Insight selected', { insightId: insight.id });
      $location.path('/insights/' + encodeURIComponent(insight.id));
    }
  }
})();
