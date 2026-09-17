(function(){
'use strict';
angular.module('fraudAlertApp').service('PolicyDecisionService',['FraudRiskFactory','POLICY_CONFIG','AlertRecordService','AuditLogService','$q',function(FraudRiskFactory,POLICY_CONFIG,AlertRecordService,AuditLogService,$q){
const self=this;
self.evaluateTransaction=function(transaction){
const deferred=$q.defer();
FraudRiskFactory.getRiskScore({transactionId:transaction.transactionId}).$promise.then(function(riskScore){
const decision=self.applyRules(riskScore);
const result={transaction:transaction,riskScore:riskScore,decision:decision};
if(decision.action==='alert'||decision.action==='hold'||decision.action==='decline'){
AlertRecordService.createAlert(transaction,riskScore,decision).then(function(alert){
result.alert=alert;
AuditLogService.logDecision(transaction,decision,riskScore);
deferred.resolve(result);
}).catch(function(error){
AuditLogService.logDecision(transaction,decision,riskScore);
deferred.reject(error);
});
}else{
AuditLogService.logDecision(transaction,decision,riskScore);
deferred.resolve(result);
}
}).catch(function(error){
deferred.reject(error);
});
return deferred.promise;
};
self.applyRules=function(riskScore){
const score=riskScore.score;
let action,reason;
if(score>=POLICY_CONFIG.thresholds.critical){
action='decline';
reason='Critical risk level detected';
}else if(score>=POLICY_CONFIG.thresholds.high){
action='hold';
reason='High risk level detected';
}else if(score>=POLICY_CONFIG.thresholds.medium){
action='alert';
reason='Medium risk level detected';
}else{
action='approve';
reason='Low risk level';
}
return{action:action,reason:reason,riskLevel:riskScore.riskLevel};
};
}]);
})();