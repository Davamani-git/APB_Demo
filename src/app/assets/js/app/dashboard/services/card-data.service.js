(function(){
  'use strict';
  angular.module('appmrn25.dashboard')
    .service('CardDataService', [function(){
      this.getCardById = function(cards, cardId){
        if(!cards || !cardId){
          return null;
        }
        for(var i=0;i<cards.length;i++){
          if(cards[i].cardId === cardId){
            return cards[i];
          }
        }
        return null;
      };
      this.computeUtilization = function(card){
        if(!card){
          return 0;
        }
        var creditLimit = Number(card.creditLimit);
        var outstanding = Number(card.outstandingAmount);
        if(isNaN(creditLimit) || creditLimit <= 0){
          return 0;
        }
        if(isNaN(outstanding) || outstanding < 0){
          outstanding = 0;
        }
        return outstanding / creditLimit;
      };
    }]);
})();
