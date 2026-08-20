(function(){
'use strict';
angular.module('fraudDetection')
.service('fraudRiskService',['$http','$q','fraudConstants',function($http,$q,fraudConstants){
this.calculateRiskScore=function(transaction){
if(!transaction||!transaction.transactionId){
return $q.reject({error:'Invalid transaction for risk scoring'});
}
var riskPayload={
transactionId:transaction.transactionId,
cardIdentifier:transaction.cardIdentifier,
amount:transaction.amount,
currency:transaction.currency,
merchantId:transaction.merchantId,
merchantCategory:transaction.merchantCategory,
location:transaction.location,
timestamp:transaction.timestamp,
deviceId:transaction.deviceId
};
return $http.post(fraudConstants.API_ENDPOINTS.RISK_SCORE,riskPayload).then(function(response){
var riskScore=response.data;
if(!riskScore.transactionId||typeof riskScore.riskScore==='undefined'){
return $q.reject({error:'Invalid risk score response'});
}
return{
transactionId:riskScore.transactionId,
riskScore:riskScore.riskScore,
riskLevel:riskScore.riskLevel,
signals:riskScore.signals||{},
evaluatedAt:riskScore.evaluatedAt||new Date().toISOString()
};
}).catch(function(error){
console.error('Risk scoring failed:',error);
return $q.reject(error);
});
};
}]);
})();