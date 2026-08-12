(function(){'use strict';
  angular.module('security').service('rbacService', rbacService);
  rbacService.$inject = ['$http','$q'];
  function rbacService($http,$q){
    var self=this, cache={};
    self.getRoles=getRoles; self.getPermissions=getPermissions; self.assignRole=assignRole; self.revokeRole=revokeRole;
    function getRoles(){
      if(cache.roles){return $q.when(cache.roles);}
      return $http.get('/api/rbac/roles').then(function(res){
        cache.roles=res.data;
        return cache.roles;
      });
    }
    function getPermissions(roleId){
      return $http.get('/api/rbac/roles/'+roleId+'/permissions').then(function(res){return res.data;});
    }
    function assignRole(userId,roleId){
      return $http.post('/api/rbac/users/'+userId+'/roles',{roleId:roleId}).then(function(res){return res.data;});
    }
    function revokeRole(userId,roleId){
      return $http.delete('/api/rbac/users/'+userId+'/roles/'+roleId).then(function(res){return res.data;});
    }
  }
})();
