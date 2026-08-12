(function(){'use strict';
  angular.module('dataInfrastructure').factory('cloudProviderFactory', cloudProviderFactory);
  cloudProviderFactory.$inject = ['$http','authService','$q'];
  function cloudProviderFactory($http,authService,$q){
    var supported=['aws','azure','gcp'], pool={};
    return {getConnection:getConnection,fetchUsageData:fetchUsageData};
    function getConnection(provider,credentials){
      if(supported.indexOf(provider)===-1){return $q.reject(new Error('Unsupported provider: '+provider));}
      if(pool[provider]){return $q.when(pool[provider]);}
      return $http.post('/api/integrations/'+provider+'/connect',{credentials:credentials}).then(function(res){
        pool[provider]={provider:provider,sessionId:res.data.sessionId,connectedAt:new Date()};
        return pool[provider];
      },function(err){return $q.reject(err);});
    }
    function fetchUsageData(provider,companyId,credentials){
      return getConnection(provider,credentials).then(function(conn){
        return $http.get('/api/integrations/'+provider+'/usage',{params:{companyId:companyId,sessionId:conn.sessionId}}).then(function(res){
          return {provider:provider,companyId:companyId,serviceType:res.data.serviceType,usageMetrics:res.data.usageMetrics,spendAmount:res.data.spendAmount,currency:res.data.currency,timestamp:new Date(),rawPayload:res.data};
        });
      });
    }
  }
})();
