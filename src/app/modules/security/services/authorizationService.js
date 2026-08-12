(function(){'use strict';
  angular.module('security').service('authorizationService', authorizationService);
  authorizationService.$inject = ['authService','rbacService','auditLogService','$q'];
  function authorizationService(authService,rbacService,auditLogService,$q){
    var self=this;
    self.canAccess=canAccess;
    function canAccess(resource,action){
      var profile=authService.getProfile();
      if(!profile){return $q.reject(new Error('Not authenticated'));}
      var userId=profile.userId;
      return rbacService.getPermissions(profile.roleId).then(function(perms){
        var allowed=perms.some(function(p){return p.resource===resource&&p.action===action;});
        auditLogService.logAccess(userId,resource,allowed?'granted':'denied');
        return allowed?$q.when(true):$q.reject(new Error('Access denied'));
      });
    }
  }
})();
