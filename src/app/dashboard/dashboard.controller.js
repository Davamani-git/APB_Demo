(function () {
  'use strict';

  angular
    .module('creditCardDashboard')
    .controller('DashboardController', ['$filter', DashboardController]);

  function DashboardController($filter) {
    var vm = this;

    vm.currencySymbol = '$';

    vm.cards = [
      {
        id: 1,
        name: 'Primary Rewards Card',
        bank: 'Bank One',
        creditLimit: 15000,
        outstanding: 4200,
        available: 10800,
        monthlySpend: 3200,
        billingCycle: '1st - 30th',
        monthlyTrends: [
          { month: 'Jan', amount: 2800 },
          { month: 'Feb', amount: 3000 },
          { month: 'Mar', amount: 3200 }
        ]
      },
      {
        id: 2,
        name: 'Travel Platinum Card',
        bank: 'Bank Two',
        creditLimit: 20000,
        outstanding: 7500,
        available: 12500,
        monthlySpend: 5100,
        billingCycle: '5th - 4th',
        monthlyTrends: [
          { month: 'Jan', amount: 4500 },
          { month: 'Feb', amount: 4800 },
          { month: 'Mar', amount: 5100 }
        ]
      }
    ];

    vm.transactions = [
      { id: 1, cardId: 1, date: new Date(2024, 2, 3), description: 'Grocery Store', category: 'Food & Dining', amount: 120.5 },
      { id: 2, cardId: 1, date: new Date(2024, 2, 5), description: 'Online Shopping', category: 'Shopping', amount: 260.0 },
      { id: 3, cardId: 1, date: new Date(2024, 2, 7), description: 'Fuel Station', category: 'Fuel', amount: 70.25 },
      { id: 4, cardId: 2, date: new Date(2024, 2, 10), description: 'Flight Tickets', category: 'Travel', amount: 840.0 },
      { id: 5, cardId: 2, date: new Date(2024, 2, 12), description: 'Hotel Booking', category: 'Travel', amount: 560.0 },
      { id: 6, cardId: 2, date: new Date(2024, 2, 14), description: 'Movie Theater', category: 'Entertainment', amount: 45.0 }
    ];

    vm.categorySpend = [];
    vm.summary = {
      monthlySpend: 0,
      totalCreditLimit: 0,
      availableCredit: 0,
      outstandingAmount: 0
    };

    vm.selectedCard = null;
    vm.filteredTransactions = [];

    vm.selectCard = selectCard;

    initialize();

    function initialize() {
      if (vm.cards.length > 0) {
        vm.selectedCard = vm.cards[0];
      }
      calculateSummary();
      refreshForSelectedCard();
    }

    function calculateSummary() {
      var totalMonthSpend = 0;
      var totalCredit = 0;
      var totalOutstanding = 0;
      var totalAvailable = 0;

      angular.forEach(vm.cards, function (card) {
        totalMonthSpend += card.monthlySpend;
        totalCredit += card.creditLimit;
        totalOutstanding += card.outstanding;
        totalAvailable += card.available;
      });

      vm.summary.monthlySpend = totalMonthSpend;
      vm.summary.totalCreditLimit = totalCredit;
      vm.summary.outstandingAmount = totalOutstanding;
      vm.summary.availableCredit = totalAvailable;
    }

    function selectCard(card) {
      vm.selectedCard = card;
      refreshForSelectedCard();
    }

    function refreshForSelectedCard() {
      if (!vm.selectedCard) {
        vm.filteredTransactions = [];
        vm.categorySpend = [];
        return;
      }

      var cardId = vm.selectedCard.id;
      vm.filteredTransactions = $filter('filter')(vm.transactions, { cardId: cardId });

      calculateCategorySpend();
    }

    function calculateCategorySpend() {
      var categoryTotals = {
        'Food & Dining': 0,
        'Fuel': 0,
        'Shopping': 0,
        'Travel': 0,
        'Entertainment': 0,
        'Utilities': 0,
        'Healthcare': 0,
        'Education': 0,
        'Miscellaneous': 0
      };

      var total = 0;

      angular.forEach(vm.filteredTransactions, function (txn) {
        var cat = txn.category;
        if (!categoryTotals.hasOwnProperty(cat)) {
          cat = 'Miscellaneous';
        }
        categoryTotals[cat] = categoryTotals[cat] + txn.amount;
        total += txn.amount;
      });

      var result = [];
      angular.forEach(categoryTotals, function (value, key) {
        if (value > 0) {
          var share = total > 0 ? Math.round((value / total) * 100) : 0;
          result.push({
            name: key,
            amount: value,
            share: share
          });
        }
      });

      vm.categorySpend = result;
    }
  }
})();
