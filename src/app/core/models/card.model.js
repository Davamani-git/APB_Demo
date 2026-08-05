(function () {
  'use strict';

  angular
    .module('creditCardDashboardApp')
    .factory('Card', CardFactory);

  function CardFactory() {
    function Card(opts) {
      opts = opts || {};
      this.cardId = opts.cardId || null;
      this.maskedNumber = opts.maskedNumber || '';
      this.productType = opts.productType || '';
      this.creditLimit = Number(opts.creditLimit || 0.0);
      this.availableCredit = Number(opts.availableCredit || 0.0);
      this.outstandingAmount = Number(opts.outstandingAmount || 0.0);
      this.currency = opts.currency || 'USD';
    }

    return Card;
  }
})();
