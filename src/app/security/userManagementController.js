angular.module('apbApp').controller('userManagementController', ['userManagementService', 'notificationService', function(userManagementService, notificationService) {
  var vm = this;
  vm.users = [];
  vm.newUser = {};
  vm.loadUsers = function() {
    userManagementService.listUsers().then(function(data) {
      vm.users = data;
    }, function(err) {
      notificationService.error('Failed to load users');
    });
  };
  vm.createUser = function() {
    userManagementService.createUser(vm.newUser).then(function() {
      notificationService.success('User created');
      vm.newUser = {};
      vm.loadUsers();
    }, function(err) {
      notificationService.error('Failed to create user');
    });
  };
  vm.updateUser = function(user) {
    userManagementService.updateUser(user.id, user).then(function() {
      notificationService.success('User updated');
      vm.loadUsers();
    }, function(err) {
      notificationService.error('Failed to update user');
    });
  };
  vm.deleteUser = function(userId) {
    if (!confirm('Delete this user?')) { return; }
    userManagementService.deleteUser(userId).then(function() {
      notificationService.success('User deleted');
      vm.loadUsers();
    }, function(err) {
      notificationService.error('Failed to delete user');
    });
  };
  vm.loadUsers();
}]);
