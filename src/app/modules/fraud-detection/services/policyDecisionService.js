(function(){
'use strict';
angular.module('fraudDetection')
.service('policyDecisionService',['$http','$q','fraudConstants',function($http,$q,fraudConstants){
var cachedThresholds=null;
this.evaluatePolicy=function(riskScore){
if(!riskScore||!riskScore.transactionId||typeof riskScore.riskScore==='undefined'){
return $q.reject({error:'Invalid risk score for policy evaluation'});
}
var self=this;
return this.getThresholds().then(function(thresholds){
var matchedThreshold=null;
for(var i=0;i<thresholds.length;i++){
var threshold=thresholds[i];
if(threshold.isActive&&riskScore.riskScore>=threshold.minScore&&riskScore.riskScore<=threshold.maxScore){
matchedThreshold=threshold;
break;
}
}
if(!matchedThreshold){
matchedThreshold=fraudConstants.DEFAULT_THRESHOLDS.find(function(t){
return riskScore.riskScore>=t.minScore&&riskScore.riskScore<=t.maxScore;
})||fraudConstants.DEFAULT_THRESHOLDS[0];
}
return{
transactionId:riskScore.transactionId,
riskLevel:matchedThreshold.riskLevel,
action:matchedThreshold.action,
thresholdApplied:matchedThreshold,
decidedAt:new Date().toISOString()
};
});
};
this.getThresholds=function(){
if(cachedThresholds){
return $q.resolve(cachedThresholds);
}
return $http.get(fraudConstants.API_ENDPOINTS.POLICY_THRESHOLDS).then(function(response){
cachedThresholds=response.data||fraudConstants.DEFAULT_THRESHOLDS;
return cachedThresholds;
}).catch(function(error){
console.error('Failed to fetch thresholds, using defaults:',error);
return fraudConstants.DEFAULT_THRESHOLDS;
});
};
this.updateThreshold=function(threshold){
if(!threshold||!threshold.riskLevel){
return $q.reject({error:'Invalid threshold configuration'});
}
return $http.post(fraudConstants.API_ENDPOINTS.UPDATE_THRESHOLD,threshold).then(function(response){
cachedThresholds=null;
return response.data;
}).catch(function(error){
console.error('Threshold update failed:',error);
return $q.reject(error);
});
};
}]);
})();