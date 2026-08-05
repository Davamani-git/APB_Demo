(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .factory('Transaction', TransactionFactory);

  function TransactionFactory() {
    function Transaction(opts) {
      opts = opts || {};
      this.transactionId = opts.transactionId || null;
      this.cardId = opts.cardId || null;
      this.amount = Number(opts.amount || 0.0);
      this.currency = opts.currency || 'USD';
      this.date = opts.date || null;
      this.category = opts.category || '';
    }

    return Transaction;
  }
})();
