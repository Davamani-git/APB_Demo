(function () {
  'use strict';

  TransactionModelFactory.$inject = [];

  angular
    .module('app')
    .factory('TransactionModel', TransactionModelFactory);

  function TransactionModelFactory() {
    function TransactionModel(props) {
      var p = props || {};

      this.id = p.id || '';
      this.cardId = p.cardId || '';
      this.amount = typeof p.amount === 'number' ? p.amount : 0;
      this.currency = p.currency || 'USD';
      this.transactionDate = p.transactionDate || '';
      this.category = p.category || '';
      this.isRefund = !!p.isRefund;
      this.isReversal = !!p.isReversal;
      this.isAdjustment = !!p.isAdjustment;
    }

    return TransactionModel;
  }
})();
