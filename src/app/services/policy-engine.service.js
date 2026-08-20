(function(){
'use strict';
angular.module('FraudAlertModule').factory('PolicyEngineService',['$http','$q','FraudRiskService',PolicyEngineService]);
function PolicyEngineService($http,$q,FraudRiskService){
var apiBase='/api';
var service={mapToAction:mapToAction,executeAction:executeAction};
return service;
function mapToAction(riskEvaluation){
var payload={
transactionId:riskEvaluation.transactionId,
riskScore:riskEvaluation.riskScore,
riskLevel:riskEvaluation.riskLevel,
engineVersion:riskEvaluation.engineVersion
};
return $http.post(apiBase+'/policy/map-action',payload).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function executeAction(actionDecision){
var action=actionDecision.action;
switch(action){
case 'approve':
return $q.resolve({status:'approved',message:'Transaction approved'});
case 'alert':
return sendAlert(actionDecision);
case 'step_up_verify':
return triggerStepUp(actionDecision);
case 'hold':
return holdTransaction(actionDecision);
case 'decline':
return declineTransaction(actionDecision);
default:
return $q.reject({error:'Unknown action: '+action});
}
}
function sendAlert(decision){
return $http.post(apiBase+'/alerts/send',decision).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function triggerStepUp(decision){
return $http.post(apiBase+'/auth/step-up',decision).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function holdTransaction(decision){
return $http.post(apiBase+'/transactions/hold',decision).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function declineTransaction(decision){
return $http.post(apiBase+'/transactions/decline',decision).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
}
})();