(function() {
  'use strict';
  angular.module('creditCardApp').controller('AnalyticsController', ['AnalyticsService', 'CardService', '$timeout', function(AnalyticsService, CardService, $timeout) {
    var vm = this;
    vm.categoryData = {};
    vm.monthlyTrend = {};
    vm.cardWiseData = {};
    vm.cards = [];
    vm.selectedCardId = null;
    vm.loading = true;
    vm.init = function() {
      CardService.getAllCards().then(function(cards) {
        vm.cards = cards;
        return AnalyticsService.getCategoryWiseSpending(null);
      }).then(function(categoryData) {
        vm.categoryData = categoryData;
        return AnalyticsService.getMonthlySpendTrend();
      }).then(function(trendData) {
        vm.monthlyTrend = trendData;
        return AnalyticsService.getCardWiseSpending();
      }).then(function(cardWiseData) {
        vm.cardWiseData = cardWiseData;
        vm.loading = false;
        $timeout(function() {
          vm.renderCharts();
        }, 100);
      });
    };
    vm.filterByCard = function() {
      vm.loading = true;
      AnalyticsService.getCategoryWiseSpending(vm.selectedCardId).then(function(categoryData) {
        vm.categoryData = categoryData;
        vm.loading = false;
        $timeout(function() {
          vm.renderCategoryChart();
        }, 100);
      });
    };
    vm.renderCharts = function() {
      vm.renderCategoryChart();
      vm.renderMonthlyTrendChart();
      vm.renderCardWiseChart();
    };
    vm.renderCategoryChart = function() {
      var ctx = document.getElementById('categoryChart');
      if (!ctx) return;
      if (vm.categoryChart) vm.categoryChart.destroy();
      var labels = Object.keys(vm.categoryData);
      var data = labels.map(function(cat) { return vm.categoryData[cat]; });
      vm.categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Spending by Category',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {beginAtZero: true}
          }
        }
      });
    };
    vm.renderMonthlyTrendChart = function() {
      var ctx = document.getElementById('monthlyTrendChart');
      if (!ctx) return;
      if (vm.monthlyChart) vm.monthlyChart.destroy();
      vm.monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: vm.monthlyTrend.labels,
          datasets: [{
            label: 'Monthly Spend',
            data: vm.monthlyTrend.data,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {beginAtZero: true}
          }
        }
      });
    };
    vm.renderCardWiseChart = function() {
      var ctx = document.getElementById('cardWiseChart');
      if (!ctx) return;
      if (vm.cardWiseChart) vm.cardWiseChart.destroy();
      var cardIds = Object.keys(vm.cardWiseData);
      var cardLabels = cardIds.map(function(id) {
        var card = vm.cards.find(function(c) { return c.id == id; });
        return card ? card.name : 'Card ' + id;
      });
      var data = cardIds.map(function(id) { return vm.cardWiseData[id]; });
      vm.cardWiseChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: cardLabels,
          datasets: [{
            data: data,
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)']
          }]
        },
        options: {
          responsive: true
        }
      });
    };
    vm.init();
  }]);
})();