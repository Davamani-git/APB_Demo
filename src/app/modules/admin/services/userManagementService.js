(function(){'use strict';
  angular.module('admin').service('userManagementService', userManagementService);
  userManagementService.$inject = ['$http','$q'];
  function userManagementService($http,$q){
    var self=this;
    self.getUsers=getUsers; self.lockUser=lockUser; self.unlockUser=unlockUser; self.resetPassword=resetPassword;
    function getUsers(){
      return $http.get('/api/users').then(function(res){return res.data;});
    }
    function lockUser(userId,reason){
      return $http.post('/api/users/'+userId+'/lock',{reason:reason,lockedAt:new Date()}).then(function(res){return res.data;});
    }
    function unlockUser(userId){
      return $http.post('/api/users/'+userId+'/unlock',{unlockedAt:new Date()}).then(function(res){return res.data;});
    }
    function resetPassword(userId){
      return $http.post('/api/users/'+userId+'/reset-password',{}).then(function(res){return res.data;});
    }
  }
})();
