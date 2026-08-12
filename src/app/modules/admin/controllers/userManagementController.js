(function(){'use strict';
  angular.module('admin').controller('userManagementController', userManagementController);
  userManagementController.$inject = ['userManagementService','rbacService'];
  function userManagementController(userManagementService,rbacService){
    var vm=this;
    vm.users=[];
    vm.roles=[];
    vm.lockUser=lockUser;
    vm.unlockUser=unlockUser;
    vm.resetPassword=resetPassword;
    vm.assignRole=assignRole;
    activate();
    function activate(){
      userManagementService.getUsers().then(function(users){vm.users=users;});
      rbacService.getRoles().then(function(roles){vm.roles=roles;});
    }
    function lockUser(userId){
      var reason=prompt('Reason for locking user?');
      if(!reason){return;}
      userManagementService.lockUser(userId,reason).then(function(){
        alert('User locked');
        activate();
      });
    }
    function unlockUser(userId){
      userManagementService.unlockUser(userId).then(function(){
        alert('User unlocked');
        activate();
      });
    }
    function resetPassword(userId){
      if(!confirm('Reset password for this user?')){return;}
      userManagementService.resetPassword(userId).then(function(){
        alert('Password reset email sent');
      });
    }
    function assignRole(userId,roleId){
      rbacService.assignRole(userId,roleId).then(function(){
        alert('Role assigned');
        activate();
      });
    }
  }
})();
