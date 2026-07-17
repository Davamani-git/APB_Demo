'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.core')
    .factory('InsightMapper', InsightMapper);

  InsightMapper.$inject = ['InsightModel', 'TransactionModel'];

  function InsightMapper(InsightModel, TransactionModel) {
    function mapFromApi(apiResponse) {
      if (!apiResponse || !Array.isArray(apiResponse.insights)) {
        return [];
      }
      return apiResponse.insights.map(function (raw) {
        var mapped = {
          id: raw.id,
          title: raw.title,
          category: raw.category,
          severity: raw.severity,
          summary: raw.summary,
          createdAt: raw.createdAt,
          validUntil: raw.validUntil,
          actionLabel: raw.actionLabel,
          actions: raw.actions,
          lineageId: raw.lineageId,
          modelVersion: raw.modelVersion,
          explanation: raw.explanation
        };

        if (raw.details && Array.isArray(raw.details.sampleTransactions)) {
          mapped.details = angular.copy(raw.details);
          mapped.details.sampleTransactions = raw.details.sampleTransactions.map(function (txn) {
            return TransactionModel.create({
              date: txn.date,
              description: txn.description,
              amount: txn.amount,
              currency: txn.currency,
              category: txn.category
            });
          });
        } else if (raw.details) {
          mapped.details = angular.copy(raw.details);
          delete mapped.details.sampleTransactions;
        }

        return InsightModel.create(mapped);
      });
    }

    return {
      mapFromApi: mapFromApi
    };
  }
})();
