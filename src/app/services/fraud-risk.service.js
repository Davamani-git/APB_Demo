(function(){
'use strict';
angular.module('FraudAlertModule').factory('FraudRiskService',['$http','$q','ConfigService',FraudRiskService]);
function FraudRiskService($http,$q,ConfigService){
var apiBase='/api';
var service={evaluateRisk:evaluateRisk,getRiskHistory:getRiskHistory};
return service;
function evaluateRisk(transactionEvent){
var payload=buildRiskPayload(transactionEvent);
return $http.post(apiBase+'/fraud-risk/evaluate',payload).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function buildRiskPayload(event){
return{
transactionId:event.transactionId,
amount:event.amount,
currency:event.currency,
merchantId:event.merchantId,
merchantCategory:event.merchantCategory,
timestamp:event.timestamp,
geoLocation:event.geoLocation,
deviceFingerprint:event.deviceFingerprint,
ipAddress:event.ipAddress,
compromisedIndicator:event.compromisedIndicator
};
}
function getRiskHistory(transactionId){
return $http.get(apiBase+'/fraud-risk/history/'+transactionId).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
}
})();