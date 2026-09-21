angular.module('creditCardApp').factory('AnalyticsService',['$q','TransactionService',function($q,$service){
return{
getMonthlyTrends:function(){
return $service.getAllTransactions().then(function(txns){
var monthlyData={};
txns.forEach(function(t){
var month=t.date.substring(0,7);
if(!monthlyData[month])monthlyData[month]=0;
monthlyData[month]+=Math.abs(t.amount);
});
var labels=Object.keys(monthlyData).sort();
var data=labels.map(function(l){return monthlyData[l];});
return{labels:labels,data:data};
});
},
getCategoryWiseSpend:function(cardId,startDate,endDate){
var promise=cardId?$service.getTransactionsByCard(cardId):$service.getAllTransactions();
return promise.then(function(txns){
var filtered=txns;
if(startDate||endDate){
filtered=txns.filter(function(t){
var tDate=new Date(t.date);
var valid=true;
if(startDate)valid=valid&&tDate>=new Date(startDate);
if(endDate)valid=valid&&tDate<=new Date(endDate);
return valid;
});
}
var categoryData={};
filtered.forEach(function(t){
if(!categoryData[t.category])categoryData[t.category]=0;
categoryData[t.category]+=Math.abs(t.amount);
});
var labels=Object.keys(categoryData);
var data=labels.map(function(l){return categoryData[l];});
return{labels:labels,data:data};
});
},
getCardWiseSpend:function(){
return $service.getAllTransactions().then(function(txns){
var cardData={};
txns.forEach(function(t){
var cardKey='Card '+t.cardId;
if(!cardData[cardKey])cardData[cardKey]=0;
cardData[cardKey]+=Math.abs(t.amount);
});
var labels=Object.keys(cardData);
var data=labels.map(function(l){return cardData[l];});
return{labels:labels,data:data};
});
}
};
}]);