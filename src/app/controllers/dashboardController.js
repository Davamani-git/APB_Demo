(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .controller('DashboardController', ['aggregationFactory', 'recommendationFactory', '$scope', function(aggregationFactory, recommendationFactory, $scope) {
      var vm = this;
      vm.aggregatedData = [];
      vm.recommendations = [];
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        aggregationFactory.getAggregatedData().then(function(data) {
          vm.aggregatedData = data;
          vm.recommendations = recommendationFactory.getTopRecommendations(data, 5);
          vm.loading = false;
          $scope.$apply();
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
          $scope.$apply();
        });
      };
      vm.refresh = function() {
        vm.loading = true;
        aggregationFactory.getAggregatedData(true).then(function(data) {
          vm.aggregatedData = data;
          vm.recommendations = recommendationFactory.getTopRecommendations(data, 5);
          vm.loading = false;
          $scope.$apply();
        }).catch(function(error) {
          vm.error = 'Failed to refresh dashboard data';
          vm.loading = false;
          $scope.$apply();
        });
      };
      vm.init();
    }]);
})();