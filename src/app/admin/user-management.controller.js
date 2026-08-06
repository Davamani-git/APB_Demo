(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('UserManagementController', ['$scope', 'UserManagementService', function($scope, UserManagementService) {
    var vm = this;
    vm.users = [];
    vm.loading = false;
    vm.roles = ['consumer', 'seller', 'admin'];
    vm.statuses = ['active', 'suspended', 'banned'];
    vm.init = function() {
      vm.loadUsers();
    };
    vm.loadUsers = function() {
      vm.loading = true;
      UserManagementService.getUsers().then(function(users) {
        vm.users = users;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load users.');
        console.error('Error loading users:', error);
      });
    };
    vm.updateUserRole = function(user) {
      UserManagementService.updateUserRole(user.userId, user.role).then(function() {
        alert('User role updated successfully!');
      }).catch(function(error) {
        alert('Failed to update user role.');
        console.error('Error updating role:', error);
      });
    };
    vm.updateUserStatus = function(user) {
      UserManagementService.updateUserStatus(user.userId, user.status).then(function() {
        alert('User status updated successfully!');
      }).catch(function(error) {
        alert('Failed to update user status.');
        console.error('Error updating status:', error);
      });
    };
    vm.suspendUser = function(userId) {
      if (!confirm('Are you sure you want to suspend this user?')) {
        return;
      }
      UserManagementService.suspendUser(userId).then(function() {
        alert('User suspended successfully!');
        vm.loadUsers();
      }).catch(function(error) {
        alert('Failed to suspend user.');
        console.error('Error suspending user:', error);
      });
    };
    vm.init();
  }]);
})();