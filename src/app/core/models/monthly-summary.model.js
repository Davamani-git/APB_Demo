(function () {
  'use strict';

  angular.module('app.core')
    .factory('MonthlySummary', ['CategoryBreakdown', 'validationUtils',
      function (CategoryBreakdown, validationUtils) {
        function MonthlySummary(props) {
          angular.extend(this, props);
        }

        MonthlySummary.fromDto = function (dto) {
          var month = dto.month;
          if (!validationUtils.isValidMonth(month)) {
            throw new Error('Invalid month in DTO');
          }

          var categories = (dto.categoryBreakdown || []).map(CategoryBreakdown.fromDto);

          return new MonthlySummary({
            month: month,
            currency: dto.currency,
            totalSpend: dto.totalSpend || 0,
            transactionCount: dto.transactionCount || 0,
            averageTransactionAmount: dto.averageTransactionAmount || 0,
            categoryBreakdown: categories,
            dataStatus: dto.dataStatus || 'UNAVAILABLE',
            partialDataReason: dto.partialDataReason || null,
            consentStatus: dto.consentStatus || 'UNKNOWN',
            generatedAt: dto.generatedAt ? new Date(dto.generatedAt) : null,
            source: dto.source || 'ISD'
          });
        };

        return MonthlySummary;
      }
    ]);
}());
