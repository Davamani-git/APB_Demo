(function(){
'use strict';
angular.module('creditCardApp').factory('KpiService',['$q','CardService','TransactionService',function($q,$cardService,$transactionService){
function calculateMonthlySpend(cardId){
var now=new Date();
var startOfMonth=new Date(now.getFullYear(),now.getMonth(),1);
var endOfMonth=new Date(now.getFullYear(),now.getMonth()+1,0);
return $transactionService.getTransactionsByDateRange(startOfMonth.toISOString().split('T')[0],endOfMonth.toISOString().split('T')[0]).then(function(transactions){
var filtered=cardId?transactions.filter(function(t){return t.cardId===cardId;}):transactions;
var total=filtered.reduce(function(sum,txn){return sum+txn.amount;},0);
return total;
});
}
function getPortfolioKpis(){
return $q.all({summary:$cardService.getPortfolioSummary(),monthlySpend:calculateMonthlySpend()}).then(function(results){
return{monthlySpend:results.monthlySpend,totalCreditLimit:results.summary.totalCreditLimit,availableCredit:results.summary.totalAvailableCredit,outstandingAmount:results.summary.totalOutstandingAmount,totalCards:results.summary.totalCards,utilizationRate:results.summary.utilizationRate};
});
}
function getCardKpis(cardId){
return $q.all({card:$cardService.getCardById(cardId),monthlySpend:calculateMonthlySpend(cardId)}).then(function(results){
var card=results.card;
return{cardId:card.id,cardName:card.name,monthlySpend:results.monthlySpend,creditLimit:card.creditLimit,availableCredit:card.availableCredit,outstandingAmount:card.outstandingAmount,utilizationRate:card.creditLimit>0?((card.outstandingAmount/card.creditLimit)*100).toFixed(2):0};
});
}
return{calculateMonthlySpend:calculateMonthlySpend,getPortfolioKpis:getPortfolioKpis,getCardKpis:getCardKpis};
}]);
})();