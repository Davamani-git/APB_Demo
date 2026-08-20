(function(){
'use strict';
angular.module('FraudAlertModule').controller('ActionRouterController',['$scope','EventIngestionService','FraudRiskService','PolicyEngineService','AuditTrailService','$interval',ActionRouterController]);
function ActionRouterController($scope,EventIngestionService,FraudRiskService,PolicyEngineService,AuditTrailService,$interval){
var vm=this;
vm.transactions=[];
vm.loading=false;
vm.error=null;
vm.processTransaction=processTransaction;
vm.refreshDashboard=refreshDashboard;
vm.confirmTransaction=confirmTransaction;
vm.reportTransaction=reportTransaction;
activate();
function activate(){
refreshDashboard();
$interval(refreshDashboard,30000);
}
function refreshDashboard(){
vm.loading=true;
vm.error=null;
EventIngestionService.ingestEvents().then(function(events){
vm.transactions=events.map(function(event){
return{
event:event,
riskEvaluation:null,
actionDecision:null,
status:'pending'
};
});
vm.transactions.forEach(function(txn){
processTransaction(txn);
});
vm.loading=false;
},function(error){
vm.error='Failed to load transactions: '+(error.data?error.data.message:error.statusText);
vm.loading=false;
});
}
function processTransaction(transaction){
transaction.status='evaluating';
FraudRiskService.evaluateRisk(transaction.event).then(function(riskEvaluation){
transaction.riskEvaluation=riskEvaluation;
return PolicyEngineService.mapToAction(riskEvaluation);
}).then(function(actionDecision){
transaction.actionDecision=actionDecision;
transaction.status='action_mapped';
return PolicyEngineService.executeAction(actionDecision);
}).then(function(executionResult){
transaction.executionResult=executionResult;
transaction.status='completed';
return AuditTrailService.logDecision(transaction.actionDecision);
}).then(function(){
transaction.status='audited';
},function(error){
transaction.error='Processing failed: '+(error.data?error.data.message:error.statusText||error.error);
transaction.status='failed';
});
}
function confirmTransaction(transaction){
var action={type:'confirm',data:{transactionId:transaction.event.transactionId,timestamp:new Date()}};
AuditTrailService.logAction(action).then(function(){
transaction.status='confirmed';
alert('Transaction confirmed as legitimate.');
},function(error){
alert('Failed to confirm transaction: '+(error.data?error.data.message:error.statusText));
});
}
function reportTransaction(transaction){
var action={type:'report',data:{transactionId:transaction.event.transactionId,timestamp:new Date()}};
AuditTrailService.logAction(action).then(function(){
transaction.status='reported';
alert('Transaction reported. Account protection initiated.');
},function(error){
alert('Failed to report transaction: '+(error.data?error.data.message:error.statusText));
});
}
}
})();