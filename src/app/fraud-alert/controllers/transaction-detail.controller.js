(function(){
'use strict';
angular.module('fraudAlertModule').controller('TransactionDetailController',['$routeParams','TransactionIngestionService','AlertRecordService','AuditLogService','ToastService','$location',function($routeParams,TransactionIngestionService,AlertRecordService,AuditLogService,ToastService,$location){
const vm=this;
vm.transaction=null;
vm.alerts=[];
vm.auditLogs=[];
vm.loading=true;
vm.transactionId=$routeParams.id;
vm.init=function(){
TransactionIngestionService.getTransactionById(vm.transactionId).then(function(transaction){
vm.transaction=transaction;
return AlertRecordService.getAlerts();
}).then(function(alerts){
vm.alerts=alerts.filter(function(alert){
return alert.transactionId===vm.transactionId;
});
return AuditLogService.getAuditLogs(vm.transactionId);
}).then(function(logs){
vm.auditLogs=logs;
vm.loading=false;
}).catch(function(error){
ToastService.error('Failed to load transaction details');
vm.loading=false;
});
};
vm.confirmTransaction=function(){
if(!vm.alerts||vm.alerts.length===0){
ToastService.info('No alerts to confirm');
return;
}
const alert=vm.alerts[0];
AlertRecordService.updateAlert(alert.alertId,{status:'Confirmed',resolvedAt:new Date().toISOString(),resolvedBy:'customer'}).then(function(){
ToastService.success('Transaction confirmed as legitimate');
AuditLogService.logEvent('fraud_alert_confirmed',{alertId:alert.alertId,transactionId:vm.transactionId});
$location.path('/dashboard');
}).catch(function(error){
ToastService.error('Failed to confirm transaction');
});
};
vm.reportTransaction=function(){
if(!vm.alerts||vm.alerts.length===0){
ToastService.info('No alerts to report');
return;
}
const alert=vm.alerts[0];
AlertRecordService.updateAlert(alert.alertId,{status:'Reported',resolvedAt:new Date().toISOString(),resolvedBy:'customer'}).then(function(){
ToastService.success('Transaction reported as unauthorized. Account protection initiated.');
AuditLogService.logEvent('fraud_alert_reported',{alertId:alert.alertId,transactionId:vm.transactionId});
$location.path('/dashboard');
}).catch(function(error){
ToastService.error('Failed to report transaction');
});
};
vm.goBack=function(){
$location.path('/dashboard');
};
vm.init();
}]);
})();