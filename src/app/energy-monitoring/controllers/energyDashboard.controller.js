(function() {
  'use strict';
  angular.module('energyMonitoringApp').controller('EnergyDashboardController', ['$scope', 'EnergyDataService', 'AlertService', 'UtilityPricingFactory', EnergyDashboardController]);
  function EnergyDashboardController($scope, EnergyDataService, AlertService, UtilityPricingFactory) {
    const vm = this;
    vm.loading = true;
    vm.energyData = null;
    vm.utilityRate = null;
    vm.estimatedCost = 0;
    vm.alerts = [];
    vm.chartData = null;
    vm.selectedPeriod = 'daily';
    vm.init = function() {
      vm.loadRealTimeData();
      vm.loadUtilityRate();
      vm.loadHistoricalData(vm.selectedPeriod);
      vm.loadAlerts();
      AlertService.startAlertPolling(function(alerts) {
        $scope.$apply(function() {
          vm.alerts = alerts;
        });
      }, 30000);
    };
    vm.loadRealTimeData = function() {
      EnergyDataService.fetchRealTimeData().then(function(data) {
        vm.energyData = data;
        if (vm.utilityRate) {
          vm.estimatedCost = UtilityPricingFactory.calculateCost(data.totalUsage, vm.utilityRate.pricePerKwh);
        }
        vm.loading = false;
      }).catch(function() {
        vm.loading = false;
      });
    };
    vm.loadUtilityRate = function() {
      UtilityPricingFactory.getCurrentRate().then(function(rate) {
        vm.utilityRate = rate;
        if (vm.energyData) {
          vm.estimatedCost = UtilityPricingFactory.calculateCost(vm.energyData.totalUsage, rate.pricePerKwh);
        }
      });
    };
    vm.loadHistoricalData = function(period) {
      vm.selectedPeriod = period;
      EnergyDataService.fetchHistoricalData(period).then(function(data) {
        vm.chartData = data;
      });
    };
    vm.loadAlerts = function() {
      AlertService.checkAlerts().then(function(alerts) {
        vm.alerts = alerts;
      });
    };
    vm.refreshData = function() {
      vm.loading = true;
      vm.loadRealTimeData();
      vm.loadHistoricalData(vm.selectedPeriod);
      vm.loadAlerts();
    };
    $scope.$on('$destroy', function() {
      AlertService.stopAlertPolling();
    });
    vm.init();
  }
})();