(function(){
'use strict';
angular.module('fraudAlertApp').service('AuditLogService',['$http','AUDIT_API_ENDPOINT',function($http,AUDIT_API_ENDPOINT){
const self=this;
self.logDecision=function(transaction,decision,riskScore){
const auditData={transactionId:transaction.transactionId,eventType:'fraud_decision',eventData:{decision:decision,riskScore:riskScore,transaction:transaction},timestamp:new Date().toISOString(),userId:'system'};
return $http.post(AUDIT_API_ENDPOINT,auditData).then(function(response){
return response.data;
}).catch(function(error){
console.error('Audit log failed:',error);
});
};
self.logEvent=function(eventType,eventData){
const auditData={eventType:eventType,eventData:eventData,timestamp:new Date().toISOString(),userId:'system'};
return $http.post(AUDIT_API_ENDPOINT,auditData).then(function(response){
return response.data;
}).catch(function(error){
console.error('Audit log failed:',error);
});
};
self.getAuditLogs=function(transactionId){
return $http.get(AUDIT_API_ENDPOINT+'?transactionId='+transactionId).then(function(response){
return response.data;
}).catch(function(error){
throw error;
});
};
}]);
})();