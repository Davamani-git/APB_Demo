'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .factory('TransactionModel', TransactionModelFactory);

  TransactionModelFactory.$inject = [];

  function TransactionModelFactory() {
    function TransactionModel(data) {
      this.date = data.date ? new Date(data.date) : new Date();
      this.description = sanitizeText(data.description || '');
      this.amount = typeof data.amount === 'number' ? data.amount : 0;
      this.currency = data.currency || 'USD';
      this.category = data.category || null;
      if (this.amount < 0) {
        throw new Error('Transaction amount must be non-negative');
      }
    }

    function sanitizeText(text) {
      return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function create(rawTxn) {
      return new TransactionModel(rawTxn || {});
    }

    return {
      create: create
    };
  }
})();
