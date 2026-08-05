(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .service('TransactionDataService', [function(){
      this.buildMonthlySpendSeries = function(summary){
        if(!summary){
          return [];
        }
        return [{
          label: summary.monthLabel,
          value: summary.monthlySpend,
          currency: summary.currency
        }];
      };
    }]);
})();
