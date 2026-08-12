(function() {
  'use strict';
  angular.module('spendingAnalytics').service('AnalyticsService', ['$http', '$q', function($http, $q) {
    var service = this;

    service.calculateTrends = function(historicalData) {
      var months = [];
      var spendValues = [];
      var trendLine = [];
      historicalData.forEach(function(monthData) {
        months.push(monthData.month);
        spendValues.push(monthData.totalSpend);
      });
      var avgSpend = spendValues.reduce(function(sum, val) { return sum + val; }, 0) / spendValues.length;
      for (var i = 0; i < spendValues.length; i++) {
        trendLine.push(avgSpend);
      }
      return {
        months: months,
        spendValues: spendValues,
        trendLine: trendLine
      };
    };

    service.calculateCardPerformance = function(historicalData) {
      var cardMap = {};
      historicalData.forEach(function(monthData) {
        if (monthData.cardBreakdown) {
          monthData.cardBreakdown.forEach(function(cardSpend) {
            if (!cardMap[cardSpend.cardId]) {
              cardMap[cardSpend.cardId] = {
                cardId: cardSpend.cardId,
                cardName: cardSpend.cardName || cardSpend.cardId,
                totalSpend: 0,
                monthCount: 0
              };
            }
            cardMap[cardSpend.cardId].totalSpend += cardSpend.amount;
            cardMap[cardSpend.cardId].monthCount++;
          });
        }
      });
      var cardPerformance = [];
      for (var cardId in cardMap) {
        var card = cardMap[cardId];
        card.averageMonthlySpend = card.totalSpend / card.monthCount;
        card.trendDirection = 'stable';
        card.utilizationRate = 0;
        cardPerformance.push(card);
      }
      return cardPerformance;
    };
  }]);
})();