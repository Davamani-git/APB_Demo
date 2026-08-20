(function(){
'use strict';
angular.module('FraudAlertModule').directive('transactionMonitor',[transactionMonitor]);
function transactionMonitor(){
return{
restrict:'E',
templateUrl:'src/app/fraud-alert/views/transaction-monitor.template.html',
scope:{transactions:'=',onConfirm:'&',onReport:'&'},
controller:['$scope',function($scope){
$scope.getRiskClass=function(riskLevel){
if(!riskLevel)return'';
switch(riskLevel.toLowerCase()){
case 'low':return'label-success';
case 'medium':return'label-warning';
case 'high':return'label-danger';
case 'confirmed_fraud':return'label-danger';
default:return'label-default';
}
};
$scope.getActionClass=function(action){
if(!action)return'';
switch(action.toLowerCase()){
case 'approve':return'label-success';
case 'alert':return'label-info';
case 'step_up_verify':return'label-warning';
case 'hold':return'label-warning';
case 'decline':return'label-danger';
default:return'label-default';
}
};
}]
};
}
})();