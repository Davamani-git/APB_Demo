(function() {
  'use strict';
  angular.module('creditCardApp').controller('AnalyticsController', ['AnalyticsService', '$timeout', function(AnalyticsService, $timeout) {
    var vm = this;
    vm.loading = true;
    vm.monthlyChart = null;
    vm.categoryChart = null;
    vm.init = function() {
      AnalyticsService.getMonthlyTrends().then(function(data) {
        $timeout(function() {
          vm.renderMonthlyChart(data);
        }, 100);
      });
      AnalyticsService.getCategorySpending().then(function(data) {
        $timeout(function() {
          vm.renderCategoryChart(data);
          vm.loading = false;
        }, 100);
      });
    };
    vm.renderMonthlyChart = function(data) {
      var ctx = document.getElementById('monthlyChart');
      if (ctx && data) {
        vm.monthlyChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [{
              label: 'Monthly Spend',
              data: data.data,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {display: true},
              title: {display: true, text: 'Monthly Spend Trends'}
            }
          }
        });
      }
    };
    vm.renderCategoryChart = function(data) {
      var ctx = document.getElementById('categoryChart');
      if (ctx && data) {
        vm.categoryChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.labels,
            datasets: [{
              label: 'Category Spending',
              data: data.data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)',
                'rgba(255, 99, 255, 0.6)'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {display: false},
              title: {display: true, text: 'Category-wise Spending'}
            }
          }
        });
      }
    };
    vm.init();
  }]);
})();