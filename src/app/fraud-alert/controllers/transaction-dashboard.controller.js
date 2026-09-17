(function(){
'use strict';
angular.module('fraudAlertModule').controller('TransactionDashboardController',['TransactionIngestionService','PolicyDecisionService','$scope','ToastService',function(TransactionIngestionService,PolicyDecisionService,$scope,ToastService){
const vm=this;
vm.transactions=[];
vm.loading=true;
vm.error=null;
vm.init=function(){
TransactionIngestionService.getTransactions().then(function(transactions){
vm.transactions=transactions;
vm.evaluateTransactions();
}).catch(function(error){
vm.error='Failed to load transactions';
ToastService.error('Failed to load transactions');
vm.loading=false;
});
};
vm.evaluateTransactions=function(){
let completed=0;
vm.transactions.forEach(function(transaction){
PolicyDecisionService.evaluateTransaction(transaction).then(function(result){
transaction.riskScore=result.riskScore;
transaction.decision=result.decision;
transaction.alert=result.alert;
completed++;
if(completed===vm.transactions.length){
vm.loading=false;
$scope.$apply();
}
}).catch(function(error){
transaction.error='Evaluation failed';
completed++;
if(completed===vm.transactions.length){
vm.loading=false;
$scope.$apply();
}
});
});
};
vm.getRiskClass=function(riskLevel){
if(!riskLevel)return'risk-low';
const level=riskLevel.toLowerCase();
return'risk-'+level;
};
vm.getStatusClass=function(status){
if(!status)return'status-pending';
const st=status.toLowerCase();
return'status-'+st;
};
vm.init();
}]);
})();