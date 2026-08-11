(function() {
  'use strict';
  angular.module('energyDashboard.dashboard')
    .controller('DashboardController', ['$scope', '$timeout', 'EnergyDataService', 'AnalyticsService', 'PricingService', function($scope, $timeout, EnergyDataService, AnalyticsService, PricingService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.selectedTimeframe = 'daily';
      vm.realTimeData = null;
      vm.historicalData = null;
      vm.trends = null;
      vm.pricing = null;
      vm.deviceMetrics = [];
      vm.init = function() {
        vm.loading = true;
        vm.fetchRealTimeData();
        vm.fetchPricing();
        vm.fetchHistoricalData(vm.selectedTimeframe);
      };
      vm.fetchRealTimeData = function() {
        EnergyDataService.fetchRealTimeData()
          .then(function(data) {
            vm.realTimeData = data;
            vm.deviceMetrics = AnalyticsService.aggregateDeviceMetrics(data.devices);
            $scope.$apply();
          })
          .catch(function(error) {
            vm.realTimeData = EnergyDataService.getMockRealTimeData();
            vm.deviceMetrics = AnalyticsService.aggregateDeviceMetrics(vm.realTimeData.devices);
            $scope.$apply();
          });
      };
      vm.fetchPricing = function() {
        PricingService.getCurrentPricing()
          .then(function(data) {
            vm.pricing = data;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load pricing data';
            $scope.$apply();
          });
      };
      vm.fetchHistoricalData = function(period) {
        EnergyDataService.fetchHistoricalData(period)
          .then(function(data) {
            vm.historicalData = data;
            vm.trends = AnalyticsService.calculateTrends(data, period);
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.historicalData = EnergyDataService.getMockHistoricalData(period);
            vm.trends = AnalyticsService.calculateTrends(vm.historicalData, period);
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.onTimeframeChange = function(timeframe) {
        vm.selectedTimeframe = timeframe;
        vm.fetchHistoricalData(timeframe);
      };
      vm.refreshData = function() {
        vm.init();
      };
      vm.init();
      const autoRefresh = $timeout(function refresh() {
        vm.fetchRealTimeData();
        $timeout(refresh, 30000);
      }, 30000);
      $scope.$on('$destroy', function() {
        $timeout.cancel(autoRefresh);
      });
    }]);
})();