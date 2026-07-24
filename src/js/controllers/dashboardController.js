(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$timeout', '$filter', 'DataService'];

  function DashboardController($timeout, $filter, DataService) {
    var vm = this;

    vm.loading = true;
    vm.isDarkMode = false;
    vm.creditCards = [];
    vm.transactions = [];
    vm.availableCategories = [];
    vm.selectedTransaction = null;
    vm.modalInstance = null;

    vm.filters = {
      searchText: '',
      cardId: '',
      category: '',
      sortField: '-date'
    };

    vm.metrics = {
      totalCreditLimit: 0,
      totalAvailableCredit: 0,
      totalOutstanding: 0,
      monthlyForecast: 0
    };

    vm.charts = {
      monthlySpend: {},
      categorySpend: {},
      topMerchants: {}
    };

    vm.toggleDarkMode = toggleDarkMode;
    vm.getUtilizationPercent = getUtilizationPercent;
    vm.transactionFilter = transactionFilter;
    vm.resetFilters = resetFilters;
    vm.exportTransactionsToCsv = exportTransactionsToCsv;
    vm.openTransactionModal = openTransactionModal;

    activate();

    function activate() {
      $timeout(function () {
        vm.creditCards = DataService.getCreditCards();
        vm.transactions = DataService.getTransactions();
        vm.availableCategories = DataService.getCategories();
        calculateMetrics();
        buildCharts();
        initializeModal();
        vm.loading = false;
      }, 800);
    }

    function initializeModal() {
      var modalElement = document.getElementById('transactionModal');
      if (modalElement && window.bootstrap) {
        vm.modalInstance = new bootstrap.Modal(modalElement);
      }
    }

    function calculateMetrics() {
      vm.metrics.totalCreditLimit = vm.creditCards.reduce(function (sum, card) {
        return sum + card.creditLimit;
      }, 0);

      vm.metrics.totalAvailableCredit = vm.creditCards.reduce(function (sum, card) {
        return sum + card.availableCredit;
      }, 0);

      vm.metrics.totalOutstanding = vm.creditCards.reduce(function (sum, card) {
        return sum + card.outstanding;
      }, 0);

      vm.metrics.monthlyForecast = DataService.getMonthlyForecast(vm.transactions);
    }

    function buildCharts() {
      var monthlyData = DataService.getMonthlySpendSeries(vm.transactions);
      vm.charts.monthlySpend = {
        labels: monthlyData.labels,
        series: ['Spend (€)'],
        data: [monthlyData.values],
        colors: [{
          backgroundColor: 'rgba(13,110,253,0.12)',
          borderColor: '#0d6efd',
          pointBackgroundColor: '#0d6efd'
        }],
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: function (value) { return '€' + value; }
              },
              gridLines: {
                color: 'rgba(160,174,192,0.15)'
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              }
            }]
          }
        }
      };

      var categoryData = DataService.getTopCategories(vm.transactions, 5);
      vm.charts.categorySpend = {
        labels: categoryData.labels,
        data: categoryData.values,
        colors: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1'],
        options: {
          cutoutPercentage: 60,
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var label = data.labels[tooltipItem.index] || '';
                var value = data.datasets[0].data[tooltipItem.index] || 0;
                return label + ': €' + value.toFixed(2);
              }
            }
          }
        }
      };

      var merchantData = DataService.getTopMerchants(vm.transactions, 7);
      vm.charts.topMerchants = {
        labels: merchantData.labels,
        series: ['Spend (€)'],
        data: [merchantData.values],
        colors: [{
          backgroundColor: '#20c997',
          borderColor: '#20c997'
        }],
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: function (value) { return '€' + value; }
              },
              gridLines: {
                color: 'rgba(160,174,192,0.15)'
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              }
            }]
          }
        }
      };
    }

    function toggleDarkMode() {
      vm.isDarkMode = !vm.isDarkMode;
    }

    function getUtilizationPercent(card) {
      if (!card || !card.creditLimit) {
        return 0;
      }
      return Math.round((card.outstanding / card.creditLimit) * 100);
    }

    function transactionFilter(tx) {
      var matchesSearch = true;
      var matchesCard = true;
      var matchesCategory = true;
      var search = (vm.filters.searchText || '').toLowerCase();

      if (search) {
        matchesSearch = (tx.merchant && tx.merchant.toLowerCase().indexOf(search) !== -1) ||
          (tx.category && tx.category.toLowerCase().indexOf(search) !== -1) ||
          (tx.description && tx.description.toLowerCase().indexOf(search) !== -1);
      }

      if (vm.filters.cardId !== '') {
        matchesCard = String(tx.cardId) === String(vm.filters.cardId);
      }

      if (vm.filters.category !== '') {
        matchesCategory = tx.category === vm.filters.category;
      }

      return matchesSearch && matchesCard && matchesCategory;
    }

    function resetFilters() {
      vm.filters = {
        searchText: '',
        cardId: '',
        category: '',
        sortField: '-date'
      };
    }

    function exportTransactionsToCsv() {
      var filteredTransactions = $filter('filter')(vm.transactions, vm.transactionFilter);
      filteredTransactions = $filter('orderBy')(filteredTransactions, vm.filters.sortField);

      var headers = ['ID', 'Date', 'Merchant', 'Description', 'Category', 'Card', 'Amount', 'Status', 'Reference'];
      var rows = filteredTransactions.map(function (tx) {
        return [
          tx.id,
          $filter('date')(tx.date, 'yyyy-MM-dd'),
          tx.merchant,
          tx.description,
          tx.category,
          tx.cardName,
          tx.amount.toFixed(2),
          tx.status,
          tx.reference
        ];
      });

      var csv = [headers].concat(rows).map(function (row) {
        return row.map(function (value) {
          var normalized = String(value).replace(/"/g, '""');
          return '"' + normalized + '"';
        }).join(',');
      }).join('\n');

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'transactions_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function openTransactionModal(tx) {
      vm.selectedTransaction = angular.copy(tx);
      if (vm.modalInstance) {
        vm.modalInstance.show();
      }
    }
  }
})();
