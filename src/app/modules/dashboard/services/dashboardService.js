(function(){
'use strict';
angular.module('creditCardApp').service('dashboardService',['$q','creditCardDataFactory','transactionDataFactory','kpiCalculatorService',function($q,creditCardDataFactory,transactionDataFactory,kpiCalculatorService){
var service=this;
service.getKPIs=function(){
var deferred=$q.defer();
$q.all([creditCardDataFactory.fetchCreditCards(),transactionDataFactory.fetchTransactions()]).then(function(results){
var cards=results[0];
var transactions=results[1];
var kpiData=kpiCalculatorService.calculateKPIs(cards,transactions);
deferred.resolve(kpiData);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();