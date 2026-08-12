(function(){
'use strict';
angular.module('creditCardApp').service('kpiCalculatorService',[function(){
var service=this;
service.calculateKPIs=function(cards,transactions){
try{
var totalCreditLimit=0;
var totalAvailableCredit=0;
var totalOutstanding=0;
var monthlySpend=0;
var currentMonth=new Date().getMonth();
var currentYear=new Date().getFullYear();
angular.forEach(cards,function(card){
totalCreditLimit+=card.creditLimit||0;
totalAvailableCredit+=card.availableCredit||0;
totalOutstanding+=card.outstandingAmount||0;
});
angular.forEach(transactions,function(transaction){
var transactionDate=new Date(transaction.transactionDate);
if(transactionDate.getMonth()===currentMonth&&transactionDate.getFullYear()===currentYear){
monthlySpend+=transaction.amount||0;
}
});
return{totalCreditLimit:totalCreditLimit,totalAvailableCredit:totalAvailableCredit,totalOutstanding:totalOutstanding,monthlySpend:monthlySpend,cards:cards};
}catch(error){
throw new Error('KPI calculation failed: '+error.message);
}
};
}]);
})();