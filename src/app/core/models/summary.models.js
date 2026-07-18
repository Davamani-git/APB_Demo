(function() {
  'use strict';

  class MonthlySummaryModel {
    constructor({
      accountId = '',
      month = '',
      totalSpend = 0,
      transactionCount = 0,
      averageTransactionValue = 0,
      currencyCode = 'USD',
      breakdownItems = [],
      dataFreshness = '',
      source = ''
    } = {}) {
      this.accountId = accountId;
      this.month = month;
      this.totalSpend = totalSpend;
      this.transactionCount = transactionCount;
      this.averageTransactionValue = averageTransactionValue;
      this.currencyCode = currencyCode;
      this.breakdownItems = breakdownItems;
      this.dataFreshness = dataFreshness;
      this.source = source;
    }
  }

  class BreakdownItemModel {
    constructor({
      categoryCode = '',
      categoryLabel = '',
      amount = 0,
      percentage = 0
    } = {}) {
      this.categoryCode = categoryCode;
      this.categoryLabel = categoryLabel;
      this.amount = amount;
      this.percentage = percentage;
    }
  }

  class MonthContextModel {
    constructor({ month = '', fromDate = '', toDate = '', definitionType = '' } = {}) {
      this.month = month;
      this.fromDate = fromDate;
      this.toDate = toDate;
      this.definitionType = definitionType;
    }
  }

  angular.module('davmsMonthlySummary')
    .factory('MonthlySummaryModel', function() {
      return MonthlySummaryModel;
    })
    .factory('BreakdownItemModel', function() {
      return BreakdownItemModel;
    })
    .factory('MonthContextModel', function() {
      return MonthContextModel;
    });
})();
