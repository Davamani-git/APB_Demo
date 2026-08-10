(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', 'NotificationService', function($scope, $filter, AnalyticsService, NotificationService) {
      var vm = this;
      vm.metrics = {};
      vm.topProducts = [];
      vm.salesData = [];
      vm.period = 'monthly';
      vm.sellerId = sessionStorage.getItem('sellerId');
      vm.init = function() {
        vm.loadDashboardMetrics();
        vm.loadTopProducts();
        vm.loadSalesData();
      };
      vm.loadDashboardMetrics = function() {
        if (!vm.sellerId) {
          NotificationService.showNotification('Seller ID not found', 'error');
          return;
        }
        AnalyticsService.getDashboardMetrics(vm.sellerId)
          .then(function(metrics) {
            vm.metrics = metrics;
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to load metrics: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.loadTopProducts = function() {
        AnalyticsService.getTopProducts(vm.sellerId, 10)
          .then(function(products) {
            vm.topProducts = products;
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to load top products: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.loadSalesData = function() {
        AnalyticsService.getSalesData(vm.sellerId, vm.period)
          .then(function(data) {
            vm.salesData = data;
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to load sales data: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.changePeriod = function(period) {
        vm.period = period;
        vm.loadSalesData();
      };
      vm.init();
    }]);
})();