(function() {
  'use strict';
  angular.module('app.creditCardDashboard')
    .service('KPICalculationService', [function() {
      this.calculateKPIs = function(cardData) {
        if (!cardData || !Array.isArray(cardData) || cardData.length === 0) {
          return {
            totalMonthlySpend: 0,
            totalCreditLimit: 0,
            totalAvailableCredit: 0,
            totalOutstandingAmount: 0,
            cards: []
          };
        }
        try {
          var totalMonthlySpend = 0;
          var totalCreditLimit = 0;
          var totalAvailableCredit = 0;
          var totalOutstandingAmount = 0;
          cardData.forEach(function(card) {
            totalMonthlySpend += card.monthlySpend || 0;
            totalCreditLimit += card.totalCreditLimit || 0;
            totalAvailableCredit += card.availableCredit || 0;
            totalOutstandingAmount += card.outstandingAmount || 0;
          });
          return {
            totalMonthlySpend: totalMonthlySpend,
            totalCreditLimit: totalCreditLimit,
            totalAvailableCredit: totalAvailableCredit,
            totalOutstandingAmount: totalOutstandingAmount,
            cards: cardData
          };
        } catch (error) {
          console.error('Error calculating KPIs:', error);
          return {
            totalMonthlySpend: 0,
            totalCreditLimit: 0,
            totalAvailableCredit: 0,
            totalOutstandingAmount: 0,
            cards: []
          };
        }
      };
    }]);
})();