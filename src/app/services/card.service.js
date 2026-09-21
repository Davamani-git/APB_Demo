angular.module('creditCardApp').factory('CardService',['$q',function($q){
var mockCards=[{id:1,name:'Visa Platinum',lastFour:'4523',creditLimit:50000,outstanding:12500,availableCredit:37500},{id:2,name:'MasterCard Gold',lastFour:'8901',creditLimit:30000,outstanding:8200,availableCredit:21800},{id:3,name:'Amex Blue',lastFour:'3456',creditLimit:40000,outstanding:15000,availableCredit:25000}];
return{
getAllCards:function(){
return $q.resolve(angular.copy(mockCards));
},
getCardById:function(cardId){
var card=mockCards.find(function(c){return c.id===cardId;});
return $q.resolve(angular.copy(card));
},
getDashboardKPIs:function(){
var totalLimit=0,totalOutstanding=0,totalAvailable=0;
mockCards.forEach(function(card){
totalLimit+=card.creditLimit;
totalOutstanding+=card.outstanding;
totalAvailable+=card.availableCredit;
});
return $q.resolve({monthlySpend:35700,totalCreditLimit:totalLimit,availableCredit:totalAvailable,outstandingAmount:totalOutstanding});
}
};
}]);