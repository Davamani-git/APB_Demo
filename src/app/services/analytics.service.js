(function(){
'use strict';
angular.module('creditCardApp').factory('AnalyticsService',['$q','TransactionService',function($q,$transactionService){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
function getCategoryWiseSpend(cardId){
return $transactionService.getAllTransactions().then(function(transactions){
var filtered=cardId?transactions.filter(function(t){return t.cardId===cardId;}):transactions;
var categoryMap={};
categories.forEach(function(cat){categoryMap[cat]=0;});
filtered.forEach(function(txn){
if(categoryMap.hasOwnProperty(txn.category)){
categoryMap[txn.category]+=txn.amount;
}
});
var result=[];
for(var cat in categoryMap){
result.push({category:cat,amount:categoryMap[cat]});
}
return result;
});
}
function getMonthlySpendTrends(cardId){
return $transactionService.getAllTransactions().then(function(transactions){
var filtered=cardId?transactions.filter(function(t){return t.cardId===cardId;}):transactions;
var monthMap={};
filtered.forEach(function(txn){
var date=new Date(txn.date);
var monthKey=date.getFullYear()+'-'+(date.getMonth()+1);
if(!monthMap[monthKey]){
monthMap[monthKey]=0;
}
monthMap[monthKey]+=txn.amount;
});
var result=[];
for(var month in monthMap){
result.push({month:month,amount:monthMap[month]});
}
result.sort(function(a,b){return a.month.localeCompare(b.month);});
return result;
});
}
function getCardWiseSpendAnalysis(){
return $transactionService.getAllTransactions().then(function(transactions){
var cardMap={};
transactions.forEach(function(txn){
if(!cardMap[txn.cardId]){
cardMap[txn.cardId]=0;
}
cardMap[txn.cardId]+=txn.amount;
});
var result=[];
for(var cardId in cardMap){
result.push({cardId:cardId,amount:cardMap[cardId]});
}
return result;
});
}
return{getCategoryWiseSpend:getCategoryWiseSpend,getMonthlySpendTrends:getMonthlySpendTrends,getCardWiseSpendAnalysis:getCardWiseSpendAnalysis};
}]);
})();