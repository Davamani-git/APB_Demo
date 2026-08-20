(function(){
'use strict';
angular.module('fraudDetectionModule')
.factory('auditFactory',['$http','fraudConstants',function($http,fraudConstants){
return{
logDecision:function(policyDecision){
var auditPayload={
transactionId:policyDecision.transactionId,
riskLevel:policyDecision.riskLevel,
action:policyDecision.action,
thresholdApplied:policyDecision.thresholdApplied,
decidedAt:policyDecision.decidedAt,
timestamp:new Date().toISOString()
};
return $http.post(fraudConstants.API_ENDPOINTS.AUDIT_LOG,auditPayload).catch(function(error){
console.error('Audit logging failed:',error);
});
}
};
}]);
})();