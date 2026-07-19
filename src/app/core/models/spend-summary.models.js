(function () {
  'use strict';

  angular.module('app')
    .constant('SpendSummaryModelDefaults', SpendSummaryModelDefaults())
    .factory('SpendSummaryModelFactory', SpendSummaryModelFactory)
    .factory('ErrorModelFactory', ErrorModelFactory);

  SpendSummaryModelFactory.$inject = [];
  ErrorModelFactory.$inject = [];

  function SpendSummaryModelDefaults() {
    return {
      month: '',
      customerId: '',
      cardSummaries: [],
      consolidatedTotals: {
        totalAmount: 0,
        transactionCount: 0,
        averageTransactionAmount: 0
      },
      breakdown: [],
      metadata: {
        currencyCode: 'USD',
        lastUpdatedUtc: null
      }
    };
  }

  function SpendSummaryModelFactory() {
    class CardSummary {
      constructor() {
        this.cardId = '';
        this.cardDisplayName = '';
        this.totalAmount = 0;
        this.transactionCount = 0;
        this.averageTransactionAmount = 0;
        this.breakdown = [];
      }
    }

    class BreakdownItem {
      constructor() {
        this.segmentCode = '';
        this.segmentLabel = '';
        this.amount = 0;
        this.transactionCount = 0;
        this.percentageOfTotal = 0;
      }
    }

    class SpendSummaryModel {
      constructor() {
        const defaults = SpendSummaryModelDefaults;
        this.month = defaults.month;
        this.customerId = defaults.customerId;
        this.cardSummaries = [];
        this.consolidatedTotals = Object.assign({}, defaults.consolidatedTotals);
        this.breakdown = [];
        this.metadata = Object.assign({}, defaults.metadata);
      }

      validate() {
        const errors = [];
        if (!this.month || !/^\d{4}-\d{2}$/.test(this.month)) {
          errors.push('Invalid month format. Expected YYYY-MM.');
        }
        if (!this.customerId) {
          errors.push('Customer ID is required.');
        }
        return errors;
      }
    }

    class ErrorModel {
      constructor() {
        this.code = '';
        this.message = '';
        this.httpStatus = 0;
        this.correlationId = '';
        this.details = null;
      }
    }

    return {
      createSpendSummary: function () {
        return new SpendSummaryModel();
      },
      createCardSummary: function () {
        return new CardSummary();
      },
      createBreakdownItem: function () {
        return new BreakdownItem();
      },
      createErrorModel: function () {
        return new ErrorModel();
      }
    };
  }

  function ErrorModelFactory() {
    class ErrorModel {
      constructor() {
        this.code = '';
        this.message = '';
        this.httpStatus = 0;
        this.correlationId = '';
        this.details = null;
      }
    }

    return {
      create: function () {
        return new ErrorModel();
      }
    };
  }
})();
