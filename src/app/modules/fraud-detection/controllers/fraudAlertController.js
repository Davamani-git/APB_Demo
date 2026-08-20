(function(){
'use strict';
angular.module('fraudDetection')
.controller('fraudAlertController',['$scope','transactionIngestionService','fraudRiskService','policyDecisionService','auditFactory',function($scope,transactionIngestionService,fraudRiskService,policyDecisionService,auditFactory){
var vm=this;
vm.transactions=[];
vm.alerts=[];
vm.loading=false;
vm.error=null;
vm.processTransaction=function(transactionEvent){
vm.loading=true;
vm.error=null;
transactionIngestionService.ingestTransaction(transactionEvent).then(function(validatedTransaction){
return fraudRiskService.calculateRiskScore(validatedTransaction);
}).then(function(riskScore){
return policyDecisionService.evaluatePolicy(riskScore).then(function(policyDecision){
return{riskScore:riskScore,policyDecision:policyDecision};
});
}).then(function(result){
var alert={
transactionId:result.policyDecision.transactionId,
riskScore:result.riskScore.riskScore,
riskLevel:result.policyDecision.riskLevel,
action:result.policyDecision.action,
signals:result.riskScore.signals,
status:'active',
createdAt:new Date().toISOString()
};
vm.alerts.push(alert);
vm.transactions.push({
transactionId:transactionEvent.transactionId,
amount:transactionEvent.amount,
currency:transactionEvent.currency,
merchant:transactionEvent.merchantId,
timestamp:transactionEvent.timestamp,
action:result.policyDecision.action,
riskLevel:result.policyDecision.riskLevel
});
auditFactory.logDecision(result.policyDecision);
vm.loading=false;
$scope.$apply();
}).catch(function(error){
vm.error=error.error||'Transaction processing failed';
vm.loading=false;
$scope.$apply();
});
};
vm.simulateTransaction=function(){
var mockTransaction={
transactionId:'TXN-'+Date.now(),
cardIdentifier:'****1234',
amount:Math.floor(Math.random()*1000)+50,
currency:'USD',
merchantId:'MERCHANT-'+Math.floor(Math.random()*1000),
merchantCategory:'RETAIL',
location:{country:'US',city:'New York',coordinates:{lat:40.7128,lon:-74.0060}},
timestamp:new Date().toISOString(),
deviceId:'DEVICE-'+Math.floor(Math.random()*100),
idempotencyKey:'IDEM-'+Date.now()+'-'+Math.random()
};
vm.processTransaction(mockTransaction);
};
vm.confirmTransaction=function(alert){
if(alert.status==='active'){
alert.status='confirmed';
alert.confirmedAt=new Date().toISOString();
auditFactory.logDecision({
transactionId:alert.transactionId,
riskLevel:alert.riskLevel,
action:'customer_confirmed',
thresholdApplied:{},
decidedAt:alert.confirmedAt
});
}
};
vm.reportTransaction=function(alert){
if(alert.status==='active'){
alert.status='reported';
alert.reportedAt=new Date().toISOString();
alert.action='decline';
auditFactory.logDecision({
transactionId:alert.transactionId,
riskLevel:'confirmed_fraud',
action:'customer_reported_unauthorized',
thresholdApplied:{},
decidedAt:alert.reportedAt
});
}
};
}]);
})();