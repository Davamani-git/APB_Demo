(function(){'use strict';
  angular.module('security').service('auditLogService', auditLogService);
  auditLogService.$inject = ['$http','$q'];
  function auditLogService($http,$q){
    var self=this; self.logAccess=logAccess;
    function logAccess(userId,resource,result){
      var entry={timestamp:new Date(),userId:userId,resource:resource,result:result,ipAddress:null};
      return $http.post('/api/audit/log',entry).then(function(r){return r.data;},function(err){return $q.reject(err);});
    }
  }
})();
