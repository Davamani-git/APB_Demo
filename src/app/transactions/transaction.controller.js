(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionController', ['$scope', '$filter', 'TransactionService', 'CategoryService', function($scope, $filter, TransactionService, CategoryService) {
      var vm = this;
      vm.transactions = [];
      vm.categories = [];
      vm.filters = {
        startDate: null,
        endDate: null,
        category: null,
        minAmount: null,
        maxAmount: null,
        search: ''
      };
      vm.loading = false;
      vm.error = null;
      vm.applyFilters = applyFilters;
      vm.correctCategory = correctCategory;
      vm.exportTransactions = exportTransactions;
      vm.clearFilters = clearFilters;
      init();
      function init() {
        loadCategories();
        loadTransactions();
      }
      function loadCategories() {
        CategoryService.getCategories()
          .then(function(categories) {
            vm.categories = categories;
          });
      }
      function loadTransactions() {
        vm.loading = true;
        var filters = buildFilterParams();
        TransactionService.getTransactions(filters)
          .then(function(transactions) {
            vm.transactions = transactions;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions';
            vm.loading = false;
          });
      }
      function buildFilterParams() {
        var params = {};
        if (vm.filters.startDate) params.startDate = vm.filters.startDate;
        if (vm.filters.endDate) params.endDate = vm.filters.endDate;
        if (vm.filters.category) params.category = vm.filters.category;
        if (vm.filters.minAmount) params.minAmount = vm.filters.minAmount;
        if (vm.filters.maxAmount) params.maxAmount = vm.filters.maxAmount;
        if (vm.filters.search) params.search = vm.filters.search;
        return params;
      }
      function applyFilters() {
        loadTransactions();
      }
      function clearFilters() {
        vm.filters = {
          startDate: null,
          endDate: null,
          category: null,
          minAmount: null,
          maxAmount: null,
          search: ''
        };
        loadTransactions();
      }
      function correctCategory(transactionId, categoryId) {
        CategoryService.correctCategory(transactionId, categoryId)
          .then(function() {
            loadTransactions();
          })
          .catch(function(error) {
            vm.error = 'Failed to correct category';
          });
      }
      function exportTransactions() {
        TransactionService.exportTransactions('csv')
          .catch(function(error) {
            vm.error = 'Failed to export transactions';
          });
      }
    }]);
})();