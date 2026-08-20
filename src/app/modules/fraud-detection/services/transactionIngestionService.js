(function(){
'use strict';
angular.module('fraudDetection')
.service('transactionIngestionService',['$http','$q','fraudConstants','auditFactory',function($http,$q,fraudConstants,auditFactory){
var processedKeys={};
this.ingestTransaction=function(transactionEvent){
if(!transactionEvent||!transactionEvent.idempotencyKey){
return $q.reject({error:'Invalid transaction event or missing idempotency key'});
}
if(processedKeys[transactionEvent.idempotencyKey]){
return $q.reject({error:'Duplicate transaction event',transactionId:transactionEvent.transactionId});
}
if(!transactionEvent.transactionId||!transactionEvent.cardIdentifier||!transactionEvent.amount){
return $q.reject({error:'Missing required transaction fields'});
}
processedKeys[transactionEvent.idempotencyKey]=true;
var payload={
transactionId:transactionEvent.transactionId,
cardIdentifier:transactionEvent.cardIdentifier,
amount:transactionEvent.amount,
currency:transactionEvent.currency||'USD',
merchantId:transactionEvent.merchantId,
merchantCategory:transactionEvent.merchantCategory,
location:transactionEvent.location,
timestamp:transactionEvent.timestamp||new Date().toISOString(),
deviceId:transactionEvent.deviceId,
idempotencyKey:transactionEvent.idempotencyKey
};
return $http.post(fraudConstants.API_ENDPOINTS.TRANSACTION_INGEST,payload).then(function(response){
return payload;
}).catch(function(error){
delete processedKeys[transactionEvent.idempotencyKey];
return $q.reject(error);
});
};
}]);
})();