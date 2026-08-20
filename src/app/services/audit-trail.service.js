(function(){
'use strict';
angular.module('FraudAlertModule').factory('AuditTrailService',['$http','$q',AuditTrailService]);
function AuditTrailService($http,$q){
var apiBase='/api';
var service={logDecision:logDecision,logAction:logAction,getAuditRecords:getAuditRecords};
return service;
function logDecision(decision){
var record={
transactionId:decision.transactionId,
action:decision.action,
riskLevel:decision.riskLevel,
decisionTimestamp:decision.decisionTimestamp||new Date(),
engineVersion:decision.engineVersion,
eventType:'decision'
};
return $http.post(apiBase+'/audit/record',record).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function logAction(action){
var record={
actionType:action.type,
actionData:action.data,
timestamp:new Date(),
eventType:'action'
};
return $http.post(apiBase+'/audit/record',record).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function getAuditRecords(filters){
return $http.get(apiBase+'/audit/records',{params:filters}).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
}
})();