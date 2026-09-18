(function(){
'use strict';
angular.module('creditCardApp').factory('CardService',['$q',function($q){
var mockCards=[{id:'CC001',name:'Platinum Rewards Card',type:'Platinum',issuer:'Bank A',creditLimit:50000,availableCredit:35000,outstandingAmount:15000,lastFourDigits:'4532',expiryDate:'12/2026',status:'Active'},{id:'CC002',name:'Travel Elite Card',type:'Gold',issuer:'Bank B',creditLimit:30000,availableCredit:22000,outstandingAmount:8000,lastFourDigits:'8765',expiryDate:'08/2025',status:'Active'},{id:'CC003',name:'Cashback Plus Card',type:'Silver',issuer:'Bank C',creditLimit:20000,availableCredit:18000,outstandingAmount:2000,lastFourDigits:'1234',expiryDate:'03/2027',status:'Active'}];
function getAllCards(){
return $q.resolve(angular.copy(mockCards));
}
function getCardById(cardId){
var card=mockCards.find(function(c){return c.id===cardId;});
return card?$q.resolve(angular.copy(card)):$q.reject('Card not found');
}
function getPortfolioSummary(){
var totalLimit=0,totalAvailable=0,totalOutstanding=0;
mockCards.forEach(function(card){
totalLimit+=card.creditLimit;
totalAvailable+=card.availableCredit;
totalOutstanding+=card.outstandingAmount;
});
return $q.resolve({totalCards:mockCards.length,totalCreditLimit:totalLimit,totalAvailableCredit:totalAvailable,totalOutstandingAmount:totalOutstanding,utilizationRate:totalLimit>0?((totalOutstanding/totalLimit)*100).toFixed(2):0});
}
return{getAllCards:getAllCards,getCardById:getCardById,getPortfolioSummary:getPortfolioSummary};
}]);
})();